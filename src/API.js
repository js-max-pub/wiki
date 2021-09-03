// import { FS } from 'https://jsv.max.pub/fs/2021/deno.js'
// import { Log } from 'https://v.max.pub/@js-max-pub/log/2021-07/css.js'
let log = {}
export function wikiLog(x) { log = x }

export var CACHE = {}
export function clearCache() { CACHE = {} }

export const defaultOptions = {
	language: 'en',
	recursive: true,
	short: true,
	limit: 0,
	counter: 0,
	format: 'xml',
}
export const defaultParameters = {
	format: 'json',
	origin: '*',
	redirects: '',
}




export function wikiURL(language = 'en', params = {}) {
	return new URL(`https://${language}.wikipedia.org/w/api.php`) + '?' + new URLSearchParams(params).toString()
}
export async function fetchJSON(language, params = {}) {
	let t0 = Date.now()
	params = { ...defaultParameters, ...params }
	let url = wikiURL(language, params)

	var mode = 'cache'
	if (!CACHE[url]) {
		CACHE[url] = await fetch(url).then(x => x.json())
		mode = 'web'
	}
	log?.timeCounter?.gray?.text(mode)?.tib?.text(Date.now() - t0 + 'ms')?.move(50)?.reset?.text(url)?.line
	return CACHE[url]
}
export async function* fetchAll(language, params = {}) {
	let more
	do {
		let result = await fetchJSON(language, { ...params, ...more })
		yield result
		more = result?.continue
	} while (more)
}



// https://www.mediawiki.org/wiki/API:Query
export async function* search(query, options = {}) {
	options = { ...defaultOptions, ...options }
	for await (let result of fetchAll(options.language, { action: 'query', list: 'search', srsearch: query })) {
		for (let page of result?.query?.search ?? []) {
			if (options.limit && options.counter++ >= options.limit) return
			yield options.short ? page.title : page
		}
	}
}

export async function revisions(title, options = {}) {
	// https://en.wikipedia.org/w/api.php?format=json&origin=*&redirects=&action=query&titles=Hydromorphone&prop=revisions&rvlimit=10
	options = { ...defaultOptions, ...options }
	let data = await fetchJSON(options.language, { action: 'query', prop: 'revisions', rvlimit: 10, titles: title })
	data = Object.values(data?.query?.pages ?? {})?.[0]?.revisions ?? []
	let short = Object.fromEntries(data.map(x => [new Date(Date.parse(x.timestamp)).toISOString().slice(0, 19), x.comment]))
	return options.short ? short : data
}

// export async function* queryProp(titles, prop, localOptions = {}) {
// 	let options = { ...defaultOptions, ...localOptions }
// 	for await (let result of fetchAll(options.language, { action: 'query', titles, prop }))
// 		for (let page of Object.values(result?.query?.pages ?? {}) ?? [])
// 			yield page
// }


// export async function* redirects(titles, localOptions = {}) {
// 	for await (let page of queryProp(titles, 'redirects', localOptions))
// 		for (let link of page?.redirects ?? [])
// 			yield link.title
// }

// export async function* categories(titles, localOptions = {}) {
// 	for await (let page of queryProp(titles, 'categories', localOptions))
// 		for (let link of page?.categories ?? [])
// 			yield link.title.replace('Kategorie:', '')
// }

// export async function terms(titles, localOptions = {}) {
// 	for await (let page of queryProp(titles, 'pageterms', localOptions))
// 		return page.terms
// }


// https://de.wikipedia.org/w/api.php?format=json&origin=*&redirects=&action=query&titles=natriumchlorid&prop=redirects|categories|pageterms
export async function meta(title, localOptions) {
	let options = { ...defaultOptions, ...localOptions }
	let output = {
		page: '',
		redirects: [],
		categories: [],
		aliases: [],
		languages: {},
	}
	// |templates|links|pageviews
	for await (let result of fetchAll(options.language, { action: 'query', titles: title, prop: 'redirects|categories|pageterms|langlinks|info' })) {
		output.page = result?.query?.redirects?.[0]?.to ?? title
		// console.log(result)
		for (let page of Object.values(result?.query?.pages ?? {}) ?? []) {
			// console.log(page)
			output.touched = page?.touched ?? output?.touched
			output.redirects = [...new Set([...output.redirects, ...(page.redirects?.map(x => x.title) ?? []), result?.query?.redirects?.[0]?.from])].filter(x => x)
			output.categories = [...new Set([...output.categories, ...(page.categories?.map(x => x.title)?.map(x => x.replace('Kategorie:', '')) ?? [])])]
			output.aliases = [...new Set([...output.aliases, ...(page.terms?.alias ?? [])])]
			output.label = page.terms?.label ?? output.label//?.[0]
			output.description = page.terms?.description ?? output.description//?.[0]
			for (let lang of page.langlinks ?? [])
				output.languages[lang.lang] = lang['*']
		}
	}
	return output
}




export async function* category(categoryName, localOptions = {}) {
	let options = { ...defaultOptions, ...localOptions }
	if (!localOptions.counter) localOptions.counter = 0
	let prefixes = {
		de: 'Kategorie:',
		en: 'Category:',
	}
	if (!categoryName.includes(':'))
		categoryName = prefixes[options.language] + categoryName

	for await (let result of fetchAll(options.language, { action: 'query', gcmtitle: categoryName, prop: 'info', generator: 'categorymembers', gcmlimit: 'max' })) {
		// console.log(result)
		// FS.file('test.json').json = result
		let pages = Object.values(result?.query?.pages ?? {}) ?? []
		for (let page of pages) {
			if (options.limit && localOptions.counter >= options.limit) return
			if (options.recursive && page.title.includes(':'))
				for await (let item of category(page.title, localOptions))
					yield item
			else {
				localOptions.counter++
				yield options.short ? page.title : page
			}
		}
	}
}


// https://www.mediawiki.org/wiki/API:Parsing_wikitext
export async function content(title, options = {}) {
	options = { ...defaultOptions, ...options }
	let formats = { xml: 'parsetree', html: 'text', markdown: 'wikitext' }
	let prop = options.prop ?? formats[options.format]
	// langlinks|categories|links|templates|images
	let result = await fetchJSON(options.language, { action: 'parse', page: title, prop })
	return options.short ? result?.parse?.[prop]?.['*'] : result
}





/**
 * returns an array of equivalent pages in other languages for a given wikipedia page
 * https://www.mediawiki.org/wiki/API:Langlinks
 * @param {string} title 
 * @param {dict} options - {}
 */
export async function* languages(title, options = {}) {
	options = { ...defaultOptions, ...options }
	for await (let result of fetchAll(options.language, { action: 'parse', prop: 'langlinks', page: title, })) {
		for (let page of result?.parse?.langlinks ?? []) {
			if (options.limit && options.counter++ >= options.limit) return
			yield options.short ? { lang: page.lang, page: page['*'] } : page
		}
	}
}

