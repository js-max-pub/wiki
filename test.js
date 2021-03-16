import wiki from './mod.js';

let meds = [
    "Amikacin",
    "Amoxicillin",
    "Ampicillin",
    "Azidocillin",
    "Azithromycin",
    "Aztreonam",
    "Bacampicillin",
    "Benzylpenicillin",
    "Benzylpenicillin-Benzathin",
    "Cefacetril",
    "Cefadroxil",
    "Cefalexin",
    "Cefaloridin",
    "Cefalotin",
    "Cefamandol",
    "Cefamandolnafat",
    "Cefapirin",
    "Cefazedon",
    "Cefazolin",
    "Cefepim",
    "Cefiderocol",
    "Cefixim",
    "Cefodizim",
    "Cefotaxim",
    "Cefotiam",
    "Cefoxitin",
    "Cefpodoxim",
    "Cefpodoximproxetil",
    "Cefradin",
    "Cefroxadin",
    "Ceftazidim",
    "Ceftibuten",
    "Ceftiofur",
    "Ceftobiprol",
    "Ceftolozan",
    "Ceftriaxon",
    "Cefuroxim",
    "Chloramphenicol",
    "Chlortetracyclin",
    "Cilastatin",
    "Ciprofloxacin",
    "Clarithromycin",
    "Clavulansäure",
    "Clindamycin",
    "Cloxacillin",
    "Colistin",
    "Cotrimoxazol",
    "Dalbavancin",
    "Daptomycin",
    "Doripenem",
    "Doxycyclin",
    "Enoxacin",
    "Ertapenem",
    "Erythromycin",
    "Faropenem",
    "Fleroxacin",
    "Flucloxacillin",
    "Fosfomycin",
    "Gentamicin",
    "Grepafloxacin",
    "Iclaprim",
    "Imipenem",
    "Josamycin",
    "Kanamycine",
    "Lefamulin",
    "Levofloxacin",
    "Lincomycin",
    "Linezolid",
    "Lomefloxacin",
    "Loracarbef",
    "Meropenem",
    "Methicillin",
    "Metronidazol",
    "Mezlocillin",
    "Minocyclin",
    "Moxifloxacin",
    "Nalidixinsäure",
    "Neomycin",
    "Netilmicin",
    "Nitrofurantoin",
    "Nitroxolin",
    "Norfloxacin",
    "Ofloxacin",
    "Oxacillin",
    "Oxytetracyclin",
    "Phenoxymethylpenicillin",
    "Pipemidsäure",
    "Piperacillin",
    "Pivmecillinam",
    "Pristinamycin",
    "Propicillin",
    "Roxithromycin",
    "Spectinomycin",
    "Spiramycin",
    "Streptomycin",
    "Sulbactam",
    "Sulfadiazin",
    "Sulfadimidin",
    "Sulfamerazin",
    "Sulfamethoxazol",
    "Sulfanilamid",
    "Sultamicillin",
    "Tazobactam",
    "Tebipenempivoxil",
    "Tedizolid",
    "Teicoplanin",
    "Telithromycin",
    "Tetracyclin",
    "Tigecyclin",
    "Trimethoprim",
    "Vancomycin"
  ]

let results = []
for(let med of meds){
    try{
        let pg = await wiki('de').page(med)
        let box = await pg.box('Infobox Chemikalie', { camelCaseKeys: true, onlyArrays:true })
        if(box)
            results.push({name:med,res:box})
        console.log("med "+results.length +" of "+meds.length)
    }catch (ex){

    }
}
for(let res of results){
    console.log(res)
}
 /*
let pg = await wiki('de').page("Neomycin")
let box = await pg.box('Infobox Chemikalie', { camelCaseKeys: true, onlyArrays:true })
let res = JSON.stringify(box,null,4)
console.log(res)
console.log(box)
console.log("done")
 */
