import * as API from './API.js';
// import { XML } from '../deps.js'
// import wikiTextToJSON from './parser.js';

export function wiki(language) { return new WikiSite(language) }

export class WikiSite {
	constructor(language = 'en') {
		this.language = language
	}

	search(query, options = {}) {
		return API.search(query, { language: this.language, ...options })
	}

	page(title) {
		return new WikiPage(this, title);
	}

	category(categoryName, options = {}) {
		return API.category(categoryName, { language: this.language, ...options })
	}
}




export class WikiPage {
	#content = {};

	constructor(wiki, title) {
		this.wiki = wiki;
		this.title = title;
	}


	languages() {
		return API.languages(this.title, { language: this.wiki.language })
	}
	redirects() {
		return API.redirects(this.title, { language: this.wiki.language })
	}
	categories() {
		return API.categories(this.title, { language: this.wiki.language })
	}
	terms() {
		return API.terms(this.title, { language: this.wiki.language })
	}

	async links() {
		return links(await this.markdown())
	}
	async isDisambiguation() {
		let terms = { en: 'disambiguation', de: 'Begriffsklärung' }
		return (await this.markdown())?.includes(terms[this.wiki.language])
	}
	async content(format = 'xml') {
		if (!this.#content[format])
			this.#content[format] = await API.content(this.title, { language: this.wiki.language, format })
		return this.#content[format]
	}



	markdown(parsed = false) { return this.content('markdown') }

	async xml(parsed = false) { // links are not parsed for some reason
		let xml = await this.content('xml')
		return parsed ? xmlReplaceLinks(xml) : xml
		// console.log('content',xml)
		// return parsed ? XML.parse(xml) : xml
	}
	html(parsed = false) { return this.content('html') }


}

function replaceLink(string) {
	// console.log('REPLACE', `<link> ${string.slice(2, -2).split('|').map(x => `<part>${x}</part>`).join(' ')} </link>`)
	return `<link> ${string.slice(2, -2).split('|').map(x => `<part>${x}</part>`).join(' ')} </link>`
}
function xmlReplaceLinks(xml) {
	// console.log('REPLACE ALL',xml.split(/(\[\[.*?\]\])/g).map(x => x.startsWith('[[') ? replaceLink(x) : x).join(''))
	return xml.split(/(\[\[.*?\]\])/g).map(x => x.startsWith('[[') ? replaceLink(x) : x).join('')
}


export function links(text) {
	return Array.from(text.matchAll(/(\[\[.*?\]\])/g))
		.map(x => [x[0], ...x[0].slice(2, -2).split('|')])
}






	// get json() {
	// 	return new Promise(async (resolve, reject) => {
	// 		// console.log('jo')
	// 		// console.log('xml', XML.parse(await this.xml).json)
	// 		resolve(XML.parse(await this.xml).json)
	// 		// resolve(wikiTextToJSON(await this.markdown))
	// 	});
	// }


	// get links() {
	// 	// return all links from .json
	// }

	// async templates(title) {
	// 	let xml = await this.xml(1)
	// 	console.log('xml', xml)
	// 	return xml.tags('template').filter(x => !title || title == x.tags('title', 1).first.text().join())//.map(x => new WikiTemplate(x))
	// 	// let xml = XML.parse(await this.xml)
	// 	// return xml.tags('template')
	// }

	// get templates() {
	// 	return new Promise(async (resolve, reject) => {
	// 		let data = await this.json
	// 		let templates = tags(data, 'template')
	// 		for (let i in templates) {
	// 			templates[i] = {
	// 				template: templates[i].children.filter(x => x.tag == 'title')[0].children[0].trim(),
	// 				items: Object.fromEntries(templates[i].children.filter(x => x.tag == 'part').map(x => partToArray(x)))
	// 			}
	// 		}
	// 		resolve(templates)
	// 	});
	// }




// function partToArray(part) {
// 	// return part?.children
// 	return [
// 		part?.children?.filter(x => x.tag == 'name')?.[0]?.children?.join('').trim(),
// 		part?.children?.filter(x => x.tag == 'value')?.[0]?.children
// 	]
// }

// function tags(xml, tagName) {
// 	if (!xml) return []
// 	let output = []
// 	for (let tag of xml) {
// 		if (tag.tag == tagName) output.push(tag)
// 		output = [...output, ...tags(tag?.children, tagName)]
// 	}
// 	return output
// }

// export function* deep(xml) {
// 	if (!xml) return
// 	for (let tag of xml) {
// 		yield deep(tag)
// 		yield tag
// 	}
// }