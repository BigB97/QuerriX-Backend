const jdenticon = require('jdenticon');
const fs = require('fs');

const icongen = async (str) => {
  const png = await jdenticon.toPng(str, 200);
  return fs.writeFileSync('./uploads/icon.png', png);
};

module.exports = icongen;
