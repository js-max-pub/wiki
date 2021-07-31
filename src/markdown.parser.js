// import { last } from 'https://js.max.pub/array/src.js'
// import { camelCase } from 'https://js.max.pub/string/src.js'
// import { last, camelCase } from '../deps.js'
import { last } from 'https://jsv.max.pub/array/2021/mod.js'
import { camelCase } from 'https://jsv.max.pub/string/2021/mod.js'


export function markdownParser(text = '') {
	text = text.replace(/<!--.*?-->/g, '') // remove comments
	// console.log('parse wikitext', text.length)
	let parts = text.split(/({{|\||}}|\[\[|\]\])/g)//.filter(x => x !== '')

	let output = { root: true, type: 'text', value: [] }
	let stack = [output]
	// let stackTop = output
	// for (let part of this.parts) {
	while (1) {
		if (parts.length == 0) return output
		let part = parts.shift()
		// console.log('part', part)
		// console.log('stack', last(stack))
		switch (part) {
			case '{{':
				// console.log('found')
				let name = parts.shift().trim()
				// let template = { template: { name, camel: camelCase(name), arguments: [] } }
				let template = { type: 'template', name, camel: camelCase(name), value: [] }
				last(stack)?.value?.push(template)
				stack.push(template)
				// console.log('part', part)
				// console.log('next', this.parts.shift())
				// output.push(template)
				// output.template = { name: this.parts.shift() }
				break
			case '|':
				if (last(stack)?.type == 'argument') stack.pop()
				// console.log('last stack', last(stack))
				let argument = parseArgument(parts.shift().trim())
				last(stack)?.value?.push(argument)
				stack.push(argument)
				break
			case '}}':
				if (last(stack)?.type == 'argument') stack.pop()
				stack.pop()
				break
			case '[[':
				let url = parts.shift().trim()
				let link = { type: 'link', url, value: [] }
				last(stack)?.value?.push(link)
				stack.push(link)
				break
			case ']]':
				if (last(stack)?.type == 'argument') stack.pop()
				stack.pop()
				break
			default:
				last(stack)?.value?.push(part)
		}
	}
	return output
}


function parseArgument(text) {
	let tmp = text.split('=')
	if (tmp.length > 1) return {
		type: 'argument',
		key: tmp[0].trim(),
		camel: camelCase(tmp[0].trim()),
		value: [tmp.slice(1).join('=').trim()],
		// text
	}
	return {
		type: 'argument',
		value: [tmp.join('=').trim()],
		// text
	}
}