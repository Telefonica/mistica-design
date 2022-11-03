// function getElement(id) {
//   return document.getElementById(id);
// }

fetch("https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/movistar.json")
.then(res => res.json())
  .then((res) => {
    // STORE CONSTANT NAMES, VALUE AND DESCRIPTION
    const light = res.light;
    const dark = res.dark;
    const mode = [light, dark]

    // STORE PALETTE NAMES & VALUES
    const global = res.global;
    const paletteNames = Object.values(global)[0];
    const paletteValues = Object.values(paletteNames).map(v => v.value);

    const constantName = Object.keys(mode[0]);
    const constantValues = Object.values(mode[0]).map(v => v.value);
    const constantDescription = Object.values(mode[0]).map(v => v.description);

    // console.log(constantValues)
    // console.log(constantDescription)

    // TRANSLATE CONSTANT TO PALETTE COLORS
    // console.log(paletteNames)
    // console.log(paletteValues)

    const color = colorStr.substring(colorStr.indexOf('.') + 1);
    console.log(color)

    // CREATE TABLE : COL 1
    constantValues.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);
      sp1.style.background = (i);
      const sp2 = document.getElementById("consValues");
      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    // CREATE TABLE : COL 2
    constantName.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("consNames");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    // CREATE TABLE : COL 3
    paletteValues.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("paletteValues");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    // CREATE TABLE : COL 4
    constantDescription.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("consDescription");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })


});

