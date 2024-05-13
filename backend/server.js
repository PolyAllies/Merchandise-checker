const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 1234;

// Позволяет парсить тело запроса в формате JSON
app.use(bodyParser.json());

// Обработчик POST запроса для сохранения фотографии
// Обработчик POST запроса для сохранения фотографии
app.post('/photo', (req, res) => {
    // Получаем данные из тела запроса
    const { packetsNum, photoFormat } = req.body;
    const photoData = req.files.photo.data;
  
    console.log(`Received photo data with ${packetsNum} packets and format ${photoFormat}`);
  
    // Строим путь и имя файла для сохранения
    const fileName = `received_photo.${photoFormat}`;
  
    // Пишем данные в файл
    fs.appendFile(fileName, photoData, (err) => {
      if (err) {
        console.error(`Error saving photo: ${err}`);
        res.status(500).send('Error saving photo');
      } else {
        console.log(`Received photo saved as ${fileName}`);
  
        // Если это последний пакет, завершаем запись и отправляем ответ
        if (packetsNum === '0') {
          // Выполните здесь обработку фото и создание CSV файла (если необходимо)
  
          // Отправляем ответ клиенту
          res.status(200).send('Photo received successfully');
        }
      }
    });
  });

// Старт сервера
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
