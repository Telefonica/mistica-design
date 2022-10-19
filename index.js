function getElement(id) {
  return document.getElementById(id);
}

fetch("https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/movistar.json")
.then(res => res.json())
.then((res) => {
  const light = res.light;
  getElement('name').innerHTML =  'Name: ' + Object.keys(light)[15];
  getElement('value').innerHTML = 'Value: ' + Object.values(light)[15].value;
  getElement('description').innerHTML = 'Description: ' + Object.values(light)[15].description;
  // do the rest here
});