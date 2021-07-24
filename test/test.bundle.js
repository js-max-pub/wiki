let a = await Deno.emit('../mod.js', { bundle: 'module' })

console.log(a.files['deno:///bundle.js'])