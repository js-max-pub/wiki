import wiki from './raw.js';
// let search = await wiki('de').search('aspirin', {min:true})
// console.log('search', search)

// let category = await wiki('de').category('ATC-Code')
// let category = await wiki('de').category('Arzneimittel')
// console.log('category', category)


// let languages = await wiki('de').page('Acetylsalicylsäure').languages()
// console.log('languages', languages)


// let box = await wiki('de').page('Acetylsalicylsäure').box('Infobox Chemikalie')
let box = await wiki('de').page('Acetylsalicylsäure').box('Infobox Chemikalie', { camelCaseKeys: true, onlyArrays:true })
console.log('box', box)

