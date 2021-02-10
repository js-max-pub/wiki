
export async function search(language, query) {
	// console.log('search', language, query)
	let result = await fetch(`https://${language}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`).then(x => x.json());
	// console.log('search result', result)
	return result?.query?.search;
}

export async function page(language, title) {
	let result = await fetch(`https://${language}.wikipedia.org/w/api.php?action=parse&prop=wikitext&page=${title}&format=json&origin=*`).then(x => x.json())
	return result?.parse?.wikitext?.['*'];
}

export async function category(language, categoryName) {
	let prefix = {
		de: 'Kategorie',
		en: 'Category',
	}
	let titles = []
	let gcmcontinue;
	do {
		let result = await fetch(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=info&generator=categorymembers&gcmtitle=${prefix[language]}:${categoryName}&gcmlimit=max${gcmcontinue ? `&gcmcontinue=${gcmcontinue}` : ""}`).then(x => x.json());
		titles = [...titles, ...Object.values(result.query.pages).map(x => x.title)]
		console.log(`loaded ${titles.length} results`)
		gcmcontinue = result?.continue?.gcmcontinue;
	} while (gcmcontinue)
	return titles;
}


export async function languages(language, title, options = {}) {
	let output = [];
	var llcontinue;
	do {
		let res = await fetch(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=langlinks&titles=${title}&llprop=autonym%7Clangname%7Curl&lllimit=max${llcontinue ? `&llcontinue=${llcontinue}` : ''}`).then(data => data.json())
		output = [...output, ...Object.values(res?.query?.pages)[0]?.langlinks ?? []]
		// console.log('o', output)
		llcontinue = res?.continue?.llcontinue
	} while (llcontinue)
	return options.raw ? output : Object.fromEntries(output.map(x => [x.lang, x['*']]));
}

export async function box(language, title, boxName, options = {}) {
	let text = await page(language, title);
	let start = text.search('{{' + boxName + '\n')
	let end = text.search('\n}}\n')
	let lines = text.slice(start, end).split('\n').slice(1)
	let output = {}
	let key, val;
	for (let line of lines) {
		if (line.startsWith('|')) { // lines with a key
			key = line.split('=')[0].slice(1).trim()
			if (options.lowerCaseKeys) key = key.toLowerCase()
			if (options.alphaNumericalKeys) key = key.replace(/[^a-z]/gi, '_')
			val = line.split('=').slice(1).join('=').trim()
			if (val.startsWith('*')) // multi-line-entry
				output[key] = [val.slice(1).trim()]
			else output[key] = val;
		}
		if (line.startsWith('*')) { // continuing previous line
			val = line.slice(1).trim()
			output[key].push(val)
		}
	}
	return output
}

export default {
	search, page, category, languages, box
}