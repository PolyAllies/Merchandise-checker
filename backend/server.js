const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(fileUpload());

app.post('/photo', (req, res) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const photoFile = req.files.photo;
  const uploadPath = `./uploads/${photoFile.name}`;
  const processedPhotoPath = path.resolve(__dirname, './uploads/processed_photo.jpg');

  photoFile.mv(uploadPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    console.log(`File uploaded from IP: ${clientIP}`);

    const pythonScript = spawn('python', [
      '/Users/averichie/Desktop/Career/Merchandise-checker/backend/Bochkari_telegram_bot/main.py',
      uploadPath,
      processedPhotoPath
    ]);

    pythonScript.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonScript.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonScript.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);

      if (code !== 0) {
        return res.status(500).send('Error occurred during image processing');
      }

      res.json({
        message: 'Photo processed successfully',
        processedPhotoUrl: `http://${req.headers.host}/uploads/processed_photo.jpg`
      });
    });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
