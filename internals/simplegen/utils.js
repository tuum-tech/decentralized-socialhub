
const fs = require('fs');
const path = require('path');
const pageComponents = fs.readdirSync(
  path.join(__dirname, '../../src/components'),
);
const pageContainers = fs.readdirSync(
  path.join(__dirname, '../../src/pages'),
);
const components = pageComponents.concat(pageContainers);

function componentExists(comp) {
  return components.indexOf(comp) >= 0;
}

module.exports = componentExists;
