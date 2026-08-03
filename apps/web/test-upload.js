const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'm1dy2af4'
});

cloudinary.uploader.unsigned_upload('public/images/layers.png', 'ml_default', function(error, result) {
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS URL:', result.secure_url);
  }
});
