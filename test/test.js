import wiki from '../mod.js';
import test from 'https://js.max.pub/test/raw.js'


async function testATC(name, expected) {
	let result = await wiki('de').page(name).box('Infobox Chemikalie', { camelCaseKeys: true, onlyArrays: true })
	// console.log(result)
	test.equal(name, result.atcCode, expected)
}


await testATC('Amikacin', ["{{ATC|D06|AX12}}", "{{ATC|J01|GB06}}", "{{ATC|S01|AA21}}"])
await testATC('Ampicillin', ["{{ATC|J01|CA01}}", "{{ATC|S01|AA19}}"])
await testATC('Cefoxitin', ["{{ATC|J01|DC01}}", "{{ATC|Q|J01DC01}}"])
await testATC('Cefepim', ["{{ATC|J01|DE01}}"])

