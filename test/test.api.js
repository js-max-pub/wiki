import * as api from '../src/API.js'




for await (let page of api.search('fuzzi', { language: 'de', recursive: true, short: true, limit: 7 })) {
	console.log(page)
}

for await (let page of api.category('ATC-Code', { language: 'de', recursive: true, limit: 7 })) {
	console.log(page)
}

for await (let page of api.languages('Canakinumab', { language: 'de', short: true, limit: 7 })) {
	console.log(page)
}

// console.log(await api.text('Canakinumab', { language: 'de' }))

