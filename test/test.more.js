import { wiki, wikiLog } from '../mod.js'
import { Log } from '../../log/css.js'
wikiLog(new Log())
let w = wiki('de')

await w.page('clexane').meta()
// console.log(await w.page('clexane').meta())
// await w.page('clexane').meta()
// await w.page('clexane').meta()
// console.log('terms', await w.page('clexane').meta())
// console.log('terms', await w.page('Natriumchlorid').meta())
// console.log('terms', await w.page('Acetylsalicylsäure').meta())

// console.log('dis ambi?', await w.page('aspirin').isDisambiguation())
// Deno.exit()
// for await (let red of w.page('aspirin').categories()) {
// 	console.log(red)
// }
// console.log(await w.page('aspirin').markdown())
// console.log(await w.page('aspirin').links())

// for await (let red of w.search('aspirin', { limit: 10 })) {
// 	console.log(red)
// }
// for await (let red of w.page('Acetylsalicylsäure').redirects()) {
// 	console.log(red)
// }
// console.log('terms', await w.page('Natriumchlorid').terms())

// for await (let red of w.page('Natriumchlorid').redirects()) {
// 	console.log(red)
// }

// for await (let red of w.page('Natriumchlorid').categories()) {
// 	console.log(red)
// }

// console.log('----------')
// for await (let page of w.search('nacl', { short: true, limit: 7 })) {
// 	console.log(page)
// }
