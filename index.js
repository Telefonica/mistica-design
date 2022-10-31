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
    
    const constantName = Object.keys(mode[0]);
    const constantValues = Object.values(mode[0]).map(v => v.value);
    const constantDescription = Object.values(mode[0]).map(v => v.description);

    const global = res.global;
    const paletteNames = Object.values(global)[0];
    const paletteValues = Object.values(paletteNames).map(v => v.value);
    

    // console.log(constantValues)
    // console.log(constantDescription)

    constantValues.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);
      sp1.innerHTML = '<span>'+'text'+'</span>';
      //sp1.innerHTML.style.background = "#fabada";
      const sp2 = document.getElementById("consValues");
      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    constantName.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("consNames");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    paletteValues.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("paletteValues");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    constantDescription.forEach((i) => {
      const sp1 = document.createElement('p');
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("consDescription");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    // TRANSLATE CONSTANT TO PALETTE COLORS
 
    console.log(paletteNames)
    console.log(paletteValues)
});

