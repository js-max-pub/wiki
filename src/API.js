// import { FS } from 'https://jsv.max.pub/fs/2021/deno.js'

export const defaultOptions = {
	language: 'en',
	recursive: true,
	short: true,
	limit: 100,
	counter: 0,
	format: 'xml',
}
export const defaultParameters = {
	format: 'json',
	origin: '*',
}




export function url(language = 'en', params = {}) {
	return new URL(`https://${language}.wikipedia.org/w/api.php`) + '?' + new URLSearchParams(params).toString()
}
export function fetchJSON(language, params = {}) {
	params = { ...defaultParameters, ...params }
	console.log('-------load', url(language, params))
	return fetch(url(language, params)).then(x => x.json())
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

