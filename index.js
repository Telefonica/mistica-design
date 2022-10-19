function getElement(id) {
  return document.getElementById(id);
}

fetch("https://raw.githubusercontent.com/Telefonica/mistica-design/production/tokens/movistar.json")
.then(res => res.json())
.then((res) => {
  const light = res.light;
  getElement('value').innerHTML =  'Value: ' + light.background.value;
  getElement('description').innerHTML = 'Description: ' + light.background.description;
  // do the rest here
});