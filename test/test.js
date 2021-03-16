import wiki from '../mod.js';
import test from 'https://js.max.pub/test/raw.js'
import FS from 'https://js.max.pub/fs/deno.js';

function json(str) { try { return JSON.parse(str) } catch { return null } }

async function testATC(name, expected) {
	let result = await wiki('de').page(name).box('Infobox Chemikalie', { camelCaseKeys: true, onlyArrays: true, splitBracketItems: true })
	// console.log(result)
	test.equal(name, expected, result.atcCode)
}

let tests = FS.file('test.txt', import.meta).lines

for (let test of tests) {
	let [name, result] = test.split('\t').map(x => x.trim())
	// console.log('test', name, result)
	await testATC(name, json(result))
}

// await testATC('cefepim',["{{ATC|J01|DE01}}"])

// console.log(await wiki('de').page("cefepim").text())