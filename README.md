# wiki


### search 
```javascript
await wiki('de').search('aspirin', {min:true}) 
// -> ["Aspirin","Acetylsalicylsäure",...]
```

```javascript
await wiki('de').category('Arzneimittel') // ->   ["Nootropikum","Biopharmazeutikum","Narbencreme",...]
await wiki('de').page('Acetylsalicylsäure').languages() // -> [  hi: "एस्पिरिन", hr: "Acetilsalicilna kiselina", ...]
await wiki('de').page('Acetylsalicylsäure').box('Infobox Chemikalie') // ->  { PubChem: "2244",  DrugBank: "DB00945", ... }
```
