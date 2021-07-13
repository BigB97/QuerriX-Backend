
/* eslint-disable arrow-body-style */
const cloudinary = require('cloudinary');
const streamifier = require('streamifier');

const uploadFromBuffer = (Buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    streamifier.createReadStream(Buffer).pipe(uploadStream);

  });
};

module.exports = uploadFromBuffer;
