function getElement(id) {
  return document.getElementById(id);
}

fetch("https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/movistar.json")
.then(res => res.json())
  .then((res) => {
  const light = res.light;
  const dark = res.dark;
  const mode = [light, dark]
  
  const constantName = Object.keys(mode[0]);
  const constantValues = Object.values(mode[0]).map(v => v.value);
  const constantDescription = Object.values(mode[0]).map(v => v.description);

  console.log(constantValues)
  console.log(constantDescription)

  constantName.forEach((i) => {
    const sp1 = document.createElement('p');
    const newContent = document.createTextNode(i);
    sp1.appendChild(newContent);

    const sp2 = document.getElementById("consNames");

    const parentDiv = sp2.parentNode;
    parentDiv.insertBefore(sp1, sp2);
  })

  constantValues.forEach((i) => {
    const sp1 = document.createElement('p');
    const newContent = document.createTextNode(i);
    sp1.appendChild(newContent);

    const sp2 = document.getElementById("consValues");

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
});

