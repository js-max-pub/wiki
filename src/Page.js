import { camelCase } from 'https://js.max.pub/string/src.js'

export default class WikiPage {
	#content;

	constructor(wiki, title) {
		this.wiki = wiki;
		this.title = title;
	}
	async text() {
		if (this.#content) return this.#content;
		let result = await fetch(`https://${this.wiki.language}.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=${this.title}&format=json&origin=*`).then(x => x.json())
		return this.#content = result?.parse?.wikitext?.['*'];
	}

	/**
	 * returns an array of languages for a given wikipedia page
	 * @param {string} title 
	 * @param {dict} options - {raw:true}
	 */
	async languages(options = {}) {
		let output = [];
		var llcontinue;
		do {
			let res = await fetch(`https://${this.wiki.language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=langlinks&titles=${this.title}&llprop=autonym%7Clangname%7Curl&lllimit=max${llcontinue ? `&llcontinue=${llcontinue}` : ''}`).then(data => data.json())
			output = [...output, ...Object.values(res?.query?.pages)[0]?.langlinks ?? []]
			// console.log('o', output)
			llcontinue = res?.continue?.llcontinue
		} while (llcontinue)
		return options.raw ? output : Object.fromEntries(output.map(x => [x.lang, x['*']]));
	}

	async box(boxName, options = {}) {
		let text = await this.text();
		if(typeof(text) == "undefined") return false;
		let start = text.search('{{' + boxName + '\n')
		// console.log('st',start)
		if (start == -1) return false;
		let end = text.search('\n}}\n')
		let lines = text.slice(start, end).split('\n').slice(1)
		let output = {}
		let key, val;
		for (let line of lines) {
			if (line.startsWith('|')) { // lines with a key
				key = line.split('=')[0].slice(1).trim()
				// if (options.camelCaseKeys) key = (await import('./string.mjs')).toCamelCase(key)
				if (options.camelCaseKeys) key = camelCase(key)
				// if (options.lowerCaseKeys) key = key.toLowerCase()
				// if (options.alphaNumericalKeys) key = key.replace(/[^a-z]/gi, '_')
				val = line.split('=').slice(1).join('=').trim()
				if (val.startsWith('*')) // multi-line-entry
					output[key] = [val.slice(1).trim()]
				else output[key] = options.onlyArrays ? [val] : val;
			}
			if (line.startsWith('*')) { // continuing previous line
				val = line.slice(1).trim()
				output[key].push(val)
			}
			// if(options.parseValues) 
		}
		return output
	}
}
