// index.mjs

// Captura el argumento de la marca pasado al script
const brand = process.argv[2];

// Verifica si se ha pasado un argumento
if (!brand) {
  console.error("Error: No brand provided.");
  process.exit(1);
}

// Muestra un mensaje en la consola con el nombre de la marca
console.log(`Syncing tokens for brand: ${brand}`);
