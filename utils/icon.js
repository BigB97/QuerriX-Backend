const jdenticon = require('jdenticon');
const uploadFromBuffer = require('./buffer_converter');

const icongen = async (str) => {
  const img = await jdenticon.toPng(str, 200);
  return uploadFromBuffer(img, 'icons');
};

module.exports = icongen;
