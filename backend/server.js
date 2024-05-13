const dgram = require('dgram');
const fs = require('fs');

const PORT_NUM = 1234; // Порт для прослушивания

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);

    // Парсим сообщение
    const message = msg.toString();
    const [packetsNum, photoFormat] = message.split(',');

    console.log(`Number of packets: ${packetsNum}`);
    console.log(`Photo format: ${photoFormat}`);

    // Строим путь и имя файла для сохранения
    const fileName = `received_photo.${photoFormat}`;

    // Создаем поток для записи файла
    const fileStream = fs.createWriteStream(fileName, { flags: 'a' });

    // Слушаем событие приема данных
    server.on('data', (data) => {
        fileStream.write(data);
    });

    // Слушаем событие окончания передачи данных
    server.on('end', () => {
        fileStream.end();
        console.log(`Received photo saved as ${fileName}`);

        // Здесь вы можете выполнить обработку фото и создание CSV файла

        // Отправляем CSV файл обратно клиенту
        const csvFileName = 'road_map.csv'; // Название CSV файла
        fs.readFile(csvFileName, (err, data) => {
            if (err) {
                console.error(`Error reading CSV file: ${err}`);
                return;
            }

            // Отправляем CSV файл обратно клиенту
            server.send(data, rinfo.port, rinfo.address, (err) => {
                if (err) {
                    console.error(`Error sending CSV file: ${err}`);
                    return;
                }
                console.log(`CSV file ${csvFileName} sent to ${rinfo.address}:${rinfo.port}`);
            });
        });
    });
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server listening ${address.address}:${address.port}`);
});

// Начинаем прослушивать порт
server.bind(PORT_NUM);
