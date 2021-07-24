import * as API from './API.js';

import WikiPage from './Page.js';


export default class WikiSite {
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