import { wiki } from './mod.js';
import FS from 'https://jsv.max.pub/fs/2021/deno.js'
import { markdownParser, templates, treeToList } from './src/markdown.parser.js';
// let search = await wiki('de').search('aspirin', {min:true})
// console.log('search', search)

// let category = await wiki('de').category('ATC-Code')
// let category = await wiki('de').category('ATC-J04')

// let category = await wiki('de').category('Arzneimittel')
// console.log('category', category)


// let languages = await wiki('de').page('Acetylsalicylsäure').languages()
// console.log('languages', languages)


// let box = await wiki('de').page('Acetylsalicylsäure').box('Infobox Chemikalie')
// let box = wiki('de').page('Amikacin').box('Infobox Chemikalie')
// // console.log('box', await box.text())
// console.log('box', JSON.stringify(await box.json({ camelCaseKeys: true, onlyArrays: true }), 0, 4))
// FS.file('test.json').json = await box.json({ camelCaseKeys: true, onlyArrays: true })

// let box = wiki('de').page('Amikacin')


// let json = await wiki('de').page('Amikacin').parse().json()
// console.log(JSON.stringify(json, 0, 4))
// FS.file('demo.json').json = json

// FS.file('demo.json').json = await wiki('de').page('Arginin').parse().json()
// FS.file('demo.md').text = await wiki('de').page('Arginin').text()

// console.log(await wiki('de').page('Arginin').revisions())

FS.file('demo.json').json = markdownParser(await wiki('en').page('cortisol').markdown())
FS.file('demo2.json').json = treeToList(markdownParser(await wiki('en').page('cortisol').markdown())).filter(x => x.type == 'template')