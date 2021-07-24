// import WikiBox from './Box.js';
import WikiParser from './Parser.js';
import * as API from './API.js';

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
	languages(options = {}) {
		return API.languages(this.title, { language: this.wiki.language })
		// let output = [];
		// var llcontinue;
		// do {
		// 	let res = await fetch(`https://${this.wiki.language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=langlinks&titles=${this.title}&llprop=autonym%7Clangname%7Curl&lllimit=max${llcontinue ? `&llcontinue=${llcontinue}` : ''}`).then(data => data.json())
		// 	output = [...output, ...Object.values(res?.query?.pages)[0]?.langlinks ?? []]
		// 	// console.log('o', output)
		// 	llcontinue = res?.continue?.llcontinue
		// } while (llcontinue)
		// return options.raw ? output : Object.fromEntries(output.map(x => [x.lang, x['*']]));
	}

	// box(title) {
	// 	return new WikiBox(this, title);
	// }

	parse() {
		return new WikiParser(this);
	}


}
