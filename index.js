// function getElement(id) {
//   return document.getElementById(id);
// }

fetch("https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/telefonica.json")
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

    const colorName = constantValues[1].substring(constantValues[1].indexOf('.') + 1, constantValues[1].length - 1);
    const colorValue = res.global.palette[colorName].value;

    // console.log(constantValues)
    // console.log(constantDescription)
    // console.log(colorValue)

    let constantList = [
      {color: colorValue},
      {constant_name: constantName},
      {constant_value: constantValues},
      {constant_description: constantDescription},
    ]

    console.log(constantList)

    let createTable = function (tokenList) {
      for (let constantList of tokenList) {
        let row = "<tr> <td>";
        row += constantList.color;
        row += "</td>";

        row += "<td>";
        row += constantList.constant_name;
        row += "</td>";

        row += "<td>";
        row += constantList.constant_value;
        row += "</td>";

        row += "<td>";
        row += constantList.constant_description;
        row += "</td>";

        row += "</tr>";

        stringTable += row;
        console.log(stringTable)
      }
    }

    createTable(constantList)

    // TRANSLATE CONSTANT TO PALETTE COLORS
    // console.log(paletteNames)
    // console.log(paletteValues)
    
  
    // CREATE TABLE : COL 1
    // constantValues.forEach((item) => {
    //   if (!item.includes('rgba')) { 
    //     const colorName = item.substring(item.indexOf('.') + 1, item.length - 1);
    //     const colorValue = res.global.palette[colorName].value;
      
      
    //     const sp1 = document.createElement('td');
    //     const newContent = document.createTextNode("");

    //     sp1.appendChild(newContent);
    //     sp1.style.background = (colorValue);

    //     const sp2 = document.getElementById("consValues");
    //     const parentDiv = sp2.parentNode;

    //     parentDiv.insertBefore(sp1, sp2);

    //     console.log(colorName + " → " + colorValue)
        
    //   } else {
    //     const sp1 = document.createElement('p');
    //     const newContent = document.createTextNode("⚠️RGBA!!");
    //     sp1.appendChild(newContent);

    //     const sp2 = document.getElementById("consValues");

    //     const parentDiv = sp2.parentNode;
    //     parentDiv.insertBefore(sp1, sp2);
    //   }
    // })

    // CREATE TABLE : COL 2
    constantName.forEach((i) => {
      const sp1 = document.createElement('td');
      sp1.setAttribute("id", "consNames");
      const newContent = document.createTextNode(i);
      sp1.appendChild(newContent);

      const sp2 = document.getElementById("consNames");

      const parentDiv = sp2.parentNode;
      parentDiv.insertBefore(sp1, sp2);
    })

    

    // // CREATE TABLE : COL 4
    // constantDescription.forEach((i) => {
    //   const sp1 = document.createElement('p');
    //   const newContent = document.createTextNode(i);
    //   sp1.appendChild(newContent);

    //   const sp2 = document.getElementById("consDescription");

    //   const parentDiv = sp2.parentNode;
    //   parentDiv.insertBefore(sp1, sp2);
    // })
});

