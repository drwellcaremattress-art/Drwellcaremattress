import fs from 'fs';
import https from 'https';

async function checkCloudinary() {
  const url = 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785240240/file_s88yxb.png';
  https.get(url, (res) => {
    let data = [];
    res.on('data', chunk => data.push(chunk));
    res.on('end', () => {
      const buffer = Buffer.concat(data);
      console.log('file_s88yxb.png size:', buffer.length);
    });
  });
}
checkCloudinary();
