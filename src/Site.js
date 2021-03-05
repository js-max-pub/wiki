import WikiPage from './Page.js';

export default class WikiSite {
	constructor(language) {
		this.language = language
	}

	async search(query, options = {}) {
		// console.log('search', language, query)
		let result = await fetch(`https://${this.language}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`).then(x => x.json());
		// console.log('search result', result)
		let list = result?.query?.search;
		if (options.min) return list.map(x => x.title)
		return list
	}

	page(title) {
		return new WikiPage(this, title);
	}

	async category(categoryName) {
		let prefix = {
			de: 'Kategorie',
			en: 'Category',
		}
		let titles = []
		let gcmcontinue;
		do {
			let result = await fetch(`https://${this.language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=info&generator=categorymembers&gcmtitle=${prefix[this.language]}:${categoryName}&gcmlimit=max${gcmcontinue ? `&gcmcontinue=${gcmcontinue}` : ""}`).then(x => x.json());
			titles = [...titles, ...Object.values(result.query.pages).map(x => x.title)]
			// console.log(`loaded ${titles.length} results`)
			gcmcontinue = result?.continue?.gcmcontinue;
		} while (gcmcontinue)
		return titles;
	}
}