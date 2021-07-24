// import { FS } from 'https://jsv.max.pub/fs/2021/deno.js'
const defaultOptions = {
	language: 'en',
	recursive: true,
	short: true,
	limit: 100,
	counter: 0,
}

function url(language = 'en', params = {}) {
	return new URL(`https://${language}.wikipedia.org/w/api.php`) + '?' + new URLSearchParams(params).toString()
}
function fetchJSON(language, params = {}) {
	console.log('-------load', url(language, params))
	return fetch(url(language, params)).then(x => x.json())
}



export async function* search(query, options = {}) {
	options = { ...defaultOptions, ...options }
	let more = {}
	do {
		let result = await fetchJSON(options.language, { action: 'query', list: 'search', srsearch: query, format: 'json', origin: '*', ...more })
		more = result?.continue ?? {}
		let list = result?.query?.search;
		if (!list?.length) return
		for (let key in list) {
			let page = list[key]
			if (options.limit && options.counter++ >= options.limit) return
			yield options.short ? page.title : page
		}
	} while (more?.sroffset)
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

	let more = {}
	do {
		let result = await fetchJSON(options.language, { action: 'query', gcmtitle: categoryName, format: 'json', origin: '*', prop: 'info', generator: 'categorymembers', gcmlimit: 'max', ...more })
		more = result?.continue ?? {}
		let pages = result?.query?.pages
		for (let key in pages) {
			let page = pages[key]
			if (options.limit && localOptions.counter >= options.limit) return
			if (options.recursive && page.title.includes(':'))
				for await (let item of category(page.title, localOptions))
					yield item
			else {
				localOptions.counter++
				yield options.short ? page.title : page
			}
		}

	} while (more?.gcmcontinue)
}




export async function text(title, options = {}) {
	options = { ...defaultOptions, ...options }
	let result = await fetchJSON(options.language, { action: 'parse', prop: 'wikitext', page: title, format: 'json', origin: '*' })
	// let result = await fetch(`https://${this.wiki.language}.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=${this.title}&format=json&origin=*`).then(x => x.json())
	// console.log('res', result)
	return options.short ? result?.parse?.wikitext?.['*'] : result
}




/**
 * returns an array of languages for a given wikipedia page
 * @param {string} title 
 * @param {dict} options - {raw:true}
 */
//  https://www.mediawiki.org/wiki/API:Langlinks
export async function* languages(title, options = {}) {
	options = { ...defaultOptions, ...options }
	let more = {}
	do {
		let result = await fetchJSON(options.language, { action: 'query', prop: 'langlinks', titles: title, format: 'json', origin: '*', lllimit: 'max', ...more }) //llprop:'autonym',
		more = result?.continue ?? {}
		let pages = Object.values(result?.query?.pages ?? {})
		if (!pages?.length) return
		let links = pages[0].langlinks
		for (let key in links) {
			if (options.limit && options.counter++ >= options.limit) return

			let page = links[key]
			yield options.short ? { lang: page.lang, page: page['*'] } : page
		}
	} while (more?.llcontinue)
}