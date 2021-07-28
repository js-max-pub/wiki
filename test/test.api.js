import * as api from '../src/API.js'

import { FS } from 'https://jsv.max.pub/fs/2021/deno.js'


// for await (let page of api.search('fuzzi', { language: 'de', recursive: true, short: true, limit: 30 })) {
// 	console.log(page)
// }

// for await (let page of api.category('ATC-Code', { language: 'de', recursive: true, limit: 30 })) {
// 	console.log(page)
// }

// for await (let page of api.languages('Canakinumab', { language: 'de', short: true, limit: 30 })) {
// 	console.log(page)
// }

// console.log(await api.text('Canakinumab', { language: 'de' }))

let f = FS.folder('content').create()
f.file('test.xml').text = await api.content('Canakinumab', { language: 'de', format: 'html' })