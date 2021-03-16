import wiki from '../mod.js';
import FS from 'https://js.max.pub/fs/deno.js';

let meds = FS.file('chembox.txt', import.meta).lines;


let results = []
for (let med of meds) {
	// try {
	let page = await wiki('de').page(med)
	let box = await page.box('Infobox Chemikalie', { camelCaseKeys: true, onlyArrays: true })
	if (box?.atcCode) console.log(med, box.atcCode)
	else console.log(med, 'atc not found')

}