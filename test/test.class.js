// import { wiki } from '../src/classes.js'
// import { markdownParser } from '../src/markdown.parser.js'

import { wiki, markdownParser } from '../mod.js'


import { FS } from 'https://jsv.max.pub/fs/2021/deno.js'
// import { XML, camelCase } from '../deps.js'

let f = FS.folder('content').remove().create()

let w = wiki('de')


for await (let page of w.search('fuzzi', { short: true, limit: 7 })) {
	console.log(page)
	f.file('search.txt').append.text = page + '\n'
}

for await (let page of w.category('ATC-Code', { short: true, limit: 7 })) {
	console.log(page)
	f.file('atc.txt').append.text = page + '\n'
}




let page = w.page('Amoxicillin')

for await (let lang of page.languages()) {
	console.log(lang)
	f.file('lang.ndjson').append.ndjson = [lang]
}


f.file(page.title + '.xml').text = await page.xml(1)
f.file(page.title + '.html').text = await page.html()
f.file(page.title + '.md').text = await page.markdown()
f.file(page.title + '.json').json = markdownParser(await page.markdown())




// f.file(page.title + '.t.json').json = await page.templates()

// console.log(await page.templates())


// class XML extends baseXML {
// 	templates(title) {
// 		return this.tags('template').filter(x => !title || title == x.tags('title')?.[0].text().join())
// 	}
// 	list() {
// 		return this.tags('part').map(x => x.tags('value')?.[0].text()).flat(5)
// 	}
// 	dict() {
// 		return Object.fromEntries(this.tags('part').map(x => [x.tags('name')?.[0].text().join(), x.tags('value')]) ?? []) ?? {}
// 	}
// }
// Object.assign(XML, baseXML);
// console.log(XML.toString())

// let xml = XML.parse(f.file(page.title + '.xml').text)
// let xml = await page.xml(1)
// f.file(page.title + '.2.xml').text = xml
// xml = XML.parse(xml)

// console.log(xml)
// XML.prototype.templates = function (title) {
// 	return new XML(this.tags('template').filter(x => !title || title == x.tags('title', 1).first.text().join()))//.map(x => new WikiTemplate(x))
// }
// XML.prototype.values = function () {
// 	// console.log('val',this)
// 	return this.tags('part', 1).map(x => [x.tags('value').first.text()])//.flat(5)
// }
// XML.prototype.dict = function () {
// 	return Object.fromEntries(this.children.filter(x => x.name == 'part').map(x => [
// 		camelCase(x.tags('name')?.[0].text().join()),
// 		x.children.filter(x => x.name == 'value').flatMap(x => x.children)
// 	]) ?? []) ?? {}
// }

// for (let t of xml.templates('CASRN'))
// 	console.log('t', t.list())

// for (let t of xml.templates('ATC'))
// 	console.log('t', t.list())

// let t = xml.templates()[0]
// console.log(t.dict().atcCode[0].list())//.map(x => x.json))//.map(x=>x.text().join()))//.map(x=>x.text()))

// console.log(xml)
// console.log(xml.tags('template'))
// console.log(xml.tags('template').toString())

// console.log('\n--------------\n')

// console.log(xml.templates('CASRN').values())