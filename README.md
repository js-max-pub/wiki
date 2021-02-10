# wiki

### import
```js
import wiki from 'https://js.max.pub/wiki/raw.js'
```


### search 
```js
await wiki('de').search('aspirin', {min:true}) 
// -> ["Aspirin","Acetylsalicylsäure",...]
```

### list categories
```js
await wiki('de').category('Arzneimittel') 
// ->   ["Nootropikum","Biopharmazeutikum","Narbencreme",...]
```

### list languages
```js
await wiki('de').page('Acetylsalicylsäure').languages() 
// -> [  hi: "एस्पिरिन", hr: "Acetilsalicilna kiselina", ...]
```

### parse info-boxes
```js
await wiki('de').page('Acetylsalicylsäure').box('Infobox Chemikalie') 
// ->  { PubChem: "2244",  DrugBank: "DB00945", ... }
```
