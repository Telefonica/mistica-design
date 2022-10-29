function getElement(id) {
  return document.getElementById(id);
}

fetch("https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/movistar.json")
.then(res => res.json())
.then((res) => {
  const light = res.light;
  const constantName = Object.keys(light)
  const constantValues = Object.values(light)[2].value
  const constantDescription = Object.values(light)[2].value

  console.log(constantValues);

  constantName.forEach((i) => {
    const sp1 = document.createElement('p');
    const newContent = document.createTextNode(i);
    sp1.appendChild(newContent);

    const sp2 = document.getElementById("consNames");

    const parentDiv = sp2.parentNode;
    parentDiv.insertBefore(sp1, sp2);
  })

  constantName.forEach((i) => {
    const sp1 = document.createElement('p');
    const newContent = document.createTextNode(i);
    sp1.appendChild(newContent);

    const sp2 = document.getElementById("consValues");

    const parentDiv = sp2.parentNode;
    parentDiv.insertBefore(sp1, sp2);
  })

  constantName.forEach((i) => {
    const sp1 = document.createElement('p');
    const newContent = document.createTextNode(i);
    sp1.appendChild(newContent);

    const sp2 = document.getElementById("consDescription");

    const parentDiv = sp2.parentNode;
    parentDiv.insertBefore(sp1, sp2);
  })
  // getElement('name').innerHTML = 'Name: ' + Object.keys(light));
  // getElement('value').innerHTML = 'Value: ' + Object.values(light)[15].value;
  // getElement('description').innerHTML = 'Description: ' + Object.values(light)[15].description;
  // do the rest here
});

