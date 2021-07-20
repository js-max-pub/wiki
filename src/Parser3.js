// import { last } from 'https://js.max.pub/array/src.js'
// import { camelCase } from 'https://js.max.pub/string/src.js'
import { last, camelCase } from '../deps.js'

export default class WikiParser {
	constructor(page, title) {
		this.page = page;
	}
	// splitter = ['{{', '}}', /\|/, /\[\[/, /\]\]/]
	// splitter = ['{{', '}}', '|', '[[', ']]'] // with indexOf no regex necessary
	// splitterRE = this.splitter.map(x => new RegExp(x.split('').map(x => '\\' + x).join('')))
	// next() {
	// 	// console.log(this.splitterRE)
	// 	let nextSplitter = this.splitterRE.map((x, i) => [this.splitter[i], this.text.search(x)]).filter(x => x[1] != -1).sort((a, b) => a[1] - b[1])
	// 	console.log('next splitter', nextSplitter)
	// 	let splitter = nextSplitter[0][0]
	// 	let splitPos = nextSplitter[0][1]
	// 	let output = [this.string.slice(0, splitPos), splitter]
	// 	this.string = this.string.slice(splitPos + splitter.length)
	// 	return output
	// }

	async json() {
		this.text = await this.page.text()
		if (!this.text) return false
		// console.log('text', this.text)
		this.parts = this.text.split(/({{|\||}}|\[\[|\]\])/g)//.filter(x => x !== '')
		return this.parse()
	}


	parseArgument(text) {
		let tmp = text.split('=')
		if (tmp.length > 1) return {
			// type: 'argument',
			// key: tmp[0].trim(),
			// camel: camelCase(tmp[0].trim()),
			argument: tmp[0].trim(),
			value: [tmp.slice(1).join('=').trim()],
			// argument: { [tmp[0].trim()]: tmp.slice(1).join('=').trim() },
			// [tmp[0].trim()]: tmp.slice(1).join('=').trim(),
			// text
		}
		return {
			// type: 'argument',
			argument: true,
			value: [tmp.join('=').trim()],
			// text
		}
	}


	async parse() {
		let output = { root: true, type: 'text', value: [] }
		let stack = [output]
		// let stackTop = output
		// for (let part of this.parts) {
		while (1) {
			if (this.parts.length == 0) return output
			let part = this.parts.shift()
			// console.log('part', part)
			// console.log('stack', last(stack))
			switch (part) {
				case '{{':
					// console.log('found')
					let name = this.parts.shift().trim()
					// let template = { template: { name, camel: camelCase(name), arguments: [] } }
					let template = { template: name, value: [] } // type: 'template', name, camel: camelCase(name),
					last(stack)?.value?.push(template)
					stack.push(template)
					// console.log('part', part)
					// console.log('next', this.parts.shift())
					// output.push(template)
					// output.template = { name: this.parts.shift() }
					break
				case '|':
					if (type(last(stack)) == 'argument') stack.pop()

					// if (last(stack)?.argument) stack.pop()
					// if (last(stack)?.type == 'argument') stack.pop()
					// console.log('last stack', last(stack))
					let argument = this.parseArgument(this.parts.shift().trim())
					last(stack)?.value?.push(argument)
					stack.push(argument)
					break
				case '}}':
					if (type(last(stack)) == 'argument') stack.pop()
					// if (last(stack)?.type == 'argument') stack.pop()
					stack.pop()
					break
				case '[[':
					let url = this.parts.shift().trim()
					let link = { link: url, value: [] } //, type: 'link', url,
					last(stack)?.value?.push(link)
					stack.push(link)
					break
				case ']]':
					if (type(last(stack)) == 'argument') stack.pop()
					stack.pop()
					break
				default:
					last(stack)?.value?.push(part)
			}
		}
		// return output
	}
}

function type(x) {
	if (x?.link) return 'link'
	if (x?.template) return 'template'
	return 'argument'
}