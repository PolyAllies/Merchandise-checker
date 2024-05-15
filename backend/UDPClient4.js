const fs = require('fs');
const readline = require('readline');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const SERVER_IP = '192.168.1.49';
const PORT_NUM = 1234;
const MAX_PACKET_SIZE = 65507 - 2;  // Adjusted for the 2-byte packet number
const MAX_PACKET_NUM = 10917; // theoretically, calculated number
const MAX_PHOTO_SIZE = MAX_PACKET_SIZE * MAX_PACKET_NUM; // theoretically, calculated number in bytes
const rl = readline.createInterface({
    input: process.stdin,    output: process.stdout
});

let allPackets = [];  // Store all packets to possibly resend them

// Ask for the file name
rl.question('Enter the name of the file to send: ', (fileName) => {
    fs.readFile(fileName, (err, data) => {        if (err) {
            console.error('Failed to read file:', err);            
            rl.close();
            return;        
        }

        // Sending the number of packets
        const numPackets = Math.ceil(data.length / MAX_PACKET_SIZE);
        const num_pack_buf = Buffer.alloc(2);            
        num_pack_buf.writeUInt16BE(numPackets);
        //const num_pack_buf = Buffer.concat([packetNumberBuffer, packetData], packetData.length + 2);
        client.send(num_pack_buf, PORT_NUM, SERVER_IP, (err) => {                
            if (err) {
                console.error('Failed to send number of packets:',  err);                    
                client.close();
                rl.close();                    
                return;
            }                
            console.log('Number of packets: ', numPackets);
        });

        // Prepare all packets
        for (let packetNum = 0; packetNum < numPackets; packetNum++) {            
            const start = packetNum * MAX_PACKET_SIZE;
            const end = Math.min(start + MAX_PACKET_SIZE, data.length);            
            const packetData = data.slice(start, end);
            // Create a buffer for the packet number
            const packetNumberBuffer = Buffer.alloc(2);            
            packetNumberBuffer.writeUInt16BE(packetNum);
            // Concatenate packet number with data
            const packet = Buffer.concat([packetNumberBuffer, packetData], packetData.length + 2);            
            allPackets.push(packet);
        }
        // Send all packets initially        
        allPackets.forEach((packet, index) => {
            client.send(packet, 0, packet.length, PORT_NUM, SERVER_IP, (err) => {                
                if (err) {
                    console.error('Failed to send packet:', err);                    
                    client.close();
                    rl.close();                    
                    return;
                }                
                console.log('Initial packet', index + 1, 'of', numPackets, 'sent.');
            });        
        });
        console.log('I wait and then I send the closing package.');
        thend = false;
        function myFunction() {
            if (thend) {
                console.log('All packets sent.');
            } else {
            // your code to run after the timeout
            const lst_pack_buf = Buffer.alloc(2);            
            lst_pack_buf.writeUInt16BE(65535);
            client.send(lst_pack_buf, PORT_NUM, SERVER_IP, (err) => {                
                if (err) {
                    console.error('Failed to send number of packets:',  err);                    
                    client.close();
                    rl.close();                    
                    return;
                }                
                //console.log('Number of packets: ', numPackets);
            });
            thend = true;
            setTimeout(myFunction, 100);
            }
        }
        // stop for sometime if needed
        setTimeout(myFunction, 200);
        rl.close();
    });
});

// client.on('message', (msg, rinfo) => {
//     console.log('Received message from server:', msg.toString());
//     if (msg.toString() == "OK"){
//         function myF() {
//             client.close();
//             return;
//         }
//         setTimeout(myF, 500);
//     } else {
//         const packetsToResend = msg.toString().split(',').map(Number);
//         // Resend requested packets
//         packetsToResend.forEach(packetNum => {        
//             if (packetNum >= 0 && packetNum < allPackets.length) {
//                 const packet = allPackets[packetNum];            
//                 client.send(packet, 0, packet.length, PORT_NUM, SERVER_IP, (err) => {
//                     if (err) {                    
//                         console.error('Failed to resend packet:', err);
//                         return;                
//                     }
//                     console.log('Resent packet number:', packetNum + 1);            
//                 });
//             } else {            
//                 console.error('Invalid packet number:', packetNum);
//             }    
//         });
//         console.log('I wait and then I send the closing package.');
//         thend = false;
//         function myFunction() {
//             if (thend) {
//                 console.log('All packets sent.');
//             } else {
//             // your code to run after the timeout
//             const lst_pack_buf = Buffer.alloc(2);            
//             lst_pack_buf.writeUInt16BE(65535);
//             client.send(lst_pack_buf, PORT_NUM, SERVER_IP, (err) => {                
//                 if (err) {
//                     console.error('Failed to send number of packets:',  err);                    
//                     client.close();                  
//                     return;
//                 }                
//                 //console.log('Number of packets: ', numPackets);
//             });
//             thend = true;
//             setTimeout(myFunction, 500);
//             }
//         }
//         // stop for sometime if needed
//         setTimeout(myFunction, 500);
//     }
// });

client.on('message', (msg, rinfo) => {
    console.log('Received message from server:', msg.toString());
    if (msg.toString() == "OK"){
        function myF() {
            client.close();
            return;
        }
        setTimeout(myF, 500);
    } else {
        const packetsToResend = msg.toString().split(',').map(Number);
        // Function to send packets recursively 
        let packetNum = 0;
        function sendPacket() {            
            if (packetNum >= packetsToResend.length) {
                console.log('I wait and then I send the closing package.');
                thend = false;
                function myFunction() {
                    if (thend) {
                        console.log('All packets sent.');
                    } else {
                    // your code to run after the timeout
                    const lst_pack_buf = Buffer.alloc(2);            
                    lst_pack_buf.writeUInt16BE(65535);
                    client.send(lst_pack_buf, PORT_NUM, SERVER_IP, (err) => {                
                        if (err) {
                            console.error('Failed to send number of packets:',  err);                    
                            client.close();                  
                            return;
                        }                
                        //console.log('Number of packets: ', numPackets);
                    });
                    thend = true;
                    setTimeout(myFunction, 100);
                    }
                }
                // stop for sometime if needed
                setTimeout(myFunction, 300);
                
                // console.log('All packets sent.');                
                // rl.close();
                // client.close();                
                // return;
            } else {
                console.log('I am sending again')
                const packet = allPackets[packetsToResend[packetNum]];            
                client.send(packet, PORT_NUM, SERVER_IP, (err) => {
                    if (err) {                    
                        console.error('Failed to resend packet:', err);
                        return;                
                    }
                    console.log('Resent packet number:', packetsToResend[packetNum]);
                    packetNum++;
                    //if (packetNum == numPackets) setTimeout(sendPacket, 5000);
                    //else sendPacket();
                    sendPacket(); // Recursive call to send next packet
                }); 
            }       
        }
        // console.log('msg[0]:', msg[0]);
        // console.log('msg[1]:', msg[1]);
        // console.log('0:', '0'.charCodeAt(0));
        var c = msg[0];
        if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) {
            sendPacket(); // Initial call to start the recursive packet sending
        }
        else console.log('not a number')
    } 
});


client.on('error', (err) => {    
    console.error('Client error:', err.stack);
    client.close();
});

client.on('close', () => {
    console.log('Client closed');
});

