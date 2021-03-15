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
		let output = this.boxFunction(text,boxName,options)	
		return output
	}

	boxFunction(text,boxName,options ={}){
		if(typeof(text) == "undefined") return false;
		let start = text.search('{{' + boxName + '\n')
		// console.log('st',start)
		if (start == -1) return false;
		let end = text.search('\n}}\n')
		let lines = text.slice(start, end).split('\n').slice(1)
		let output = {}
		let key, val,brackets;
		let isParsingBrackets =false
		for (let line of lines) {
			if (line.startsWith('|')) { // lines with a key
				key = line.split('=')[0].slice(1).trim()
				isParsingBrackets = key=="ATC-Code"
				// if (options.camelCaseKeys) key = (await import('./string.mjs')).toCamelCase(key)
				if (options.camelCaseKeys) key = camelCase(key)
				// if (options.lowerCaseKeys) key = key.toLowerCase()
				// if (options.alphaNumericalKeys) key = key.replace(/[^a-z]/gi, '_')
				val = line.split('=').slice(1).join('=').trim()
				brackets = null;
				if (val.startsWith('*')){ // multi-line-entry
					val = val.slice(1).trim()
					brackets = isParsingBrackets? this.parseBrackets(val): [val]
					output[key] = [...brackets]
				}
				else {
					brackets = isParsingBrackets? this.parseBrackets(val): [val]
					//array with length > 1 -> array else -> array[0] (val but no array)
					output[key] = options.onlyArrays ? brackets : brackets.length>1?brackets:brackets[0];
				}
			}
			if (line.startsWith('*')) { // continuing previous line
				val = line.slice(1).trim()
				brackets = null;
				brackets = this.parseBrackets(val)
				brackets.forEach(val => output[key].push(val))
			}
			// if(options.parseValues) 
		}
		//let newParse = parseBox(text)
	//	console.log(newParse)
	return output
	}

	//return only found bracketed expression like [{{ATC|S01|AA03}},...] or [text] if no expressions found
 	parseBrackets(text){
		//const bracketRegex = /{{[^{}]*?}}|\[\[[^\[\]]*?\]\]/gm;
		//const refRegex = /<ref(?:(?!<ref).)*?(?:\/>|<\/ref>)/gm; regex for detecting references
		const bracketRegex = /{{[^{}]*?}}/gm;
		let res = []
		let m = null;
		while ((m = bracketRegex.exec(text)) !== null) {
			if(m==null){
				continue;
			}
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === bracketRegex.lastIndex) {
				bracketRegex.lastIndex++;
			}
			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) => {
				res.push(match)
				//console.log(`Found match, group ${groupIndex}: ${match}`);
			});	
		}
		if(res.length<1)
			return [text]
		else
			return res;
			}	
}

