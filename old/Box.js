import { camelCase, trim, lines } from 'https://js.max.pub/string/src.js'
import {parse} from './Template.js'

export default class WikiBox {
	constructor(page, title) {
		this.page = page;
		this.title = title;
	}

	async text() {
		let text = await this.page.text();
		// if(typeof(text) == "undefined") return false;
		if (!text) return false
		let start = text.search('{{' + this.title + '\n')
		// console.log('st',start)
		if (start == -1) return false;
		let end = text.search('\n}}\n')
		// let lines = text.slice(start, end).split('\n').slice(1)
		return text.slice(start, end + 3)
	}


	async json(options = {}) {
		let boxLines = lines(await this.text())?.slice(1, -1)
		if(!boxLines) return false
		let output = {}
		let key, val;
		for (let line of boxLines) {
			line = line.trim()
			if (line.startsWith('|')) { // lines with a key
				key = line.split('=')[0].slice(1).trim()
				// if (options.camelCaseKeys) key = (await import('./string.mjs')).toCamelCase(key)
				if (options.camelCaseKeys) key = camelCase(key)
				// if (options.lowerCaseKeys) key = key.toLowerCase()
				// if (options.alphaNumericalKeys) key = key.replace(/[^a-z]/gi, '_')
				val = line.split('=').slice(1).join('=').trim()
				if (val.startsWith('*')) // multi-line-entry
					output[key] = [val.slice(1).trim()]
				else output[key] = options.arraysOnly ? [val] : val;
			}
			if (line.startsWith('*')) { // continuing previous line
				val = line.slice(1).trim()
				if (!output[key]) output[key] = []
				output[key].push(val)
			}
			// if(options.parseValues) 
		}

		for(let key in output)
			output[key] = parse(output[key])

		if (options.splitBracketItems)
			for (let key in output)
				output[key] = output[key].flatMap(x => x.split('{{').filter(x => x).map(x => '{{' + x).map(x => trim(x, ', ')))

		return output
	}
}









// 	async box(boxName, options = {}) {
// 		let text = await this.text();
// 		// if (typeof (text) == "undefined") return false;
// 		if(!text) return false

// 		let start = text.search('{{' + boxName + '\n')
// 		// console.log('st',start)
// 		if (start == -1) return false;
// 		let end = text.search('\n}}\n')
// 		let lines = text.slice(start, end).split('\n').slice(1)
// 		let output = {}
// 		let key, val, brackets;
// 		// let isParsingBrackets = false
// 		for (let line of lines) {
// 			if (line.startsWith('|')) { // lines with a key
// 				key = line.split('=')[0].slice(1).trim()
// 				// isParsingBrackets = key == "ATC-Code"
// 				// if (options.camelCaseKeys) key = (await import('./string.mjs')).toCamelCase(key)
// 				if (options.camelCaseKeys) key = camelCase(key)
// 				// if (options.lowerCaseKeys) key = key.toLowerCase()
// 				// if (options.alphaNumericalKeys) key = key.replace(/[^a-z]/gi, '_')
// 				val = line.split('=').slice(1).join('=').trim()
// 				brackets = null;
// 				if (val.startsWith('*')) { // multi-line-entry
// 					val = val.slice(1).trim()
// 					// brackets = isParsingBrackets ? this.parseBrackets(val) : [val]
// 					output[key] = [...brackets]
// 				}
// 				else {
// 					// brackets = isParsingBrackets ? this.parseBrackets(val) : [val]
// 					//array with length > 1 -> array else -> array[0] (val but no array)
// 					output[key] = options.onlyArrays ? brackets : brackets.length > 1 ? brackets : brackets[0];
// 				}
// 			}
// 			if (line.startsWith('*')) { // continuing previous line
// 				val = line.slice(1).trim()
// 				brackets = null;
// 				brackets = this.parseBrackets(val)
// 				if (!output[key]) output[key] = []
// 				brackets.forEach(val => output[key].push(val))
// 			}
// 			// if(options.parseValues) 
// 		}
// 		//let newParse = parseBox(text)
// 		//	console.log(newParse)
// 		return output
// 	}

// 	//return only found bracketed expression like [{{ATC|S01|AA03}},...] or [text] if no expressions found
// 	parseBrackets(text) {
// 		//const bracketRegex = /{{[^{}]*?}}|\[\[[^\[\]]*?\]\]/gm;
// 		//const refRegex = /<ref(?:(?!<ref).)*?(?:\/>|<\/ref>)/gm; regex for detecting references
// 		const bracketRegex = /{{[^{}]*?}}/gm;
// 		let res = []
// 		let m = null;
// 		while ((m = bracketRegex.exec(text)) !== null) {
// 			if (m == null) {
// 				continue;
// 			}
// 			// This is necessary to avoid infinite loops with zero-width matches
// 			if (m.index === bracketRegex.lastIndex) {
// 				bracketRegex.lastIndex++;
// 			}
// 			// The result can be accessed through the `m`-variable.
// 			m.forEach((match, groupIndex) => {
// 				res.push(match)
// 				//console.log(`Found match, group ${groupIndex}: ${match}`);
// 			});
// 		}
// 		if (res.length < 1)
// 			return [text]
// 		else
// 			return res;
// 	}
// }

