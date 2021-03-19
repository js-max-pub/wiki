// export default class WikiTemplate {
// 	constructor(text){

// 	}
// }
import { groups } from 'https://js.max.pub/string/src.js'

function findTemplate(text) {
	// console.log('find template in ',text)
	let t = findGroups(text, /\{\{(.*?)\}\}/g)
	return t.map(x => {
		let [name, ...args] = x?.[0]?.split('|') ?? [] // arguments is JS-keyword, cannot be used in destructuring
		return { template: { name, arguments: args } }
	})
	// console.log('template', t)
	// console.log('template',t.map(x=>x?.[0]?.split('|')))
	// console.log('template', t?.split('|'))
}
function extractTemplate(string) {
	let start = string.search('{{')
	// console.log('extractTemplate', string, start)
	if (start == -1) return false
	let end = string.search('}}') + 2
	let raw = string.slice(start, end)
	let items = raw.slice(2, -2).split('|').map(x => x.trim())
	items = items.map(x => {
		let tmp = x.split('=')
		if (tmp.length > 1) return { key: tmp[0], value: tmp.slice(1).join('=') }
		return { value: tmp.join('=') }
		// return { key, value: v.join("=") }
	})
	return { start, end, template: { name: items[0].value, arguments: items.slice(1), raw } }
}


export function parse(text) {
	let output = []
	if (typeof text == 'string') text = [text];
	for (let item of text) {
		while (1) {
			let template = extractTemplate(item)
			if (template === false) {
				output.push(item);
				break;
			}
			let string = item.slice(0, template.start)
			if (string) output.push(string)
			output.push({ template: template.template })
			item = item.slice(template.end)
		}

		// console.log(JSON.stringify(output, 0, 4))
		// let square = item.search(/\[\[/)
		// console.log(item, curly, square)
		// output.push(findTemplate(item))
		// console.log(findTemplate(item))
	}
	return output
}