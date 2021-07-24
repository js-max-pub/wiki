import * as API from './API.js';

import wikiTextToJSON from './parser.js';


export default function (language) { return new WikiSite(language) }

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
	#content;

	constructor(wiki, title) {
		this.wiki = wiki;
		this.title = title;
	}


	get languages() {
		return API.languages(this.title, { language: this.wiki.language })
	}


	get text() {
		return new Promise(async (resolve, reject) => {
			if (!this.#content)
				this.#content = await API.text(this.title, { language: this.wiki.language })
			resolve(this.#content)
		})
	}


	get json() {
		return new Promise(async (resolve, reject) => {
			resolve(wikiTextToJSON(await this.text))
		});
	}


	get links() {
		// return all links from .json
	}


	get boxes() {
		// return all boxes
	}


}
