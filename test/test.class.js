import wiki from '../src/classes.js'

let w = wiki('de')


// for await (let page of w.search('fuzzi', { short: true, limit: 7 })) {
// 	console.log(page)
// }

// for await (let page of w.category('ATC-Code', { short: true, limit: 7 })) {
// 	console.log(page)
// }
let page = w.page('Canakinumab')


console.log('text', await page.text)

console.log('json', await page.json)

// for await (let lang of w.page('Canakinumab').languages) {
// 	console.log(lang)
// }