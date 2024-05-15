const fs = require('fs');
const readline = require('readline');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const SERVER_IP = '127.0.0.1';
const PORT_NUM = 1234;
const MAX_PACKET_SIZE = 65507 - 2;  // Adjusted for the 2-byte packet number
//const MAX_PACKET_NUM = 10917; // theoretically, calculated number
//const MAX_PHOTO_SIZE = MAX_PACKET_SIZE * MAX_PACKET_NUM; // theoretically, calculated number in bytes
const rl = readline.createInterface({
    input: process.stdin,    output: process.stdout
});

let allPackets = [];  // Store all packets to possibly resend them

// Ask for the file name
rl.question('Enter the name of the file to send: ', (fileName) => {
    fs.readFile(fileName, (err, data) => {        
        if (err) {
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
            console.log('Number of packets:', numPackets);
        });

        // Sending the type of photo
        const splt = fileName.split('.');
        const photo_type = '.' + splt[splt.length - 1];
        client.send(photo_type, PORT_NUM, SERVER_IP, (err) => {                
            if (err) {
                console.error('Failed to send type of photo:',  err);                    
                client.close();
                rl.close();                    
                return;
            }                
            console.log('The type of photo is:', photo_type);
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
            setTimeout(myFunction, 10);
            }
        }
        // stop for sometime if needed
        setTimeout(myFunction, 100);
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
                    setTimeout(myFunction, 10);
                    }
                }
                // stop for sometime if needed
                setTimeout(myFunction, 100);
                
                // console.log('All packets sent.');                
                // rl.close();
                // client.close();                
                // return;
            } else {
                //console.log('I am sending again')
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
        let c = msg[0];
        if (c >= '0'.charCodeAt(0) && c <= '9'.charCodeAt(0)) {
            sendPacket(); // Initial call to start the recursive packet sending
        }
        else {
            console.log('not a number')
            //let newBuf = msg[0, 3];
            let file_type = msg.slice(0, 3).toString();
            //console.log('file is: ', newBuf)
            //console.log('file is: ', newBuf.toString())
            console.log('file is:', file_type)
            //console.log('file is: ', msg.slice(0, 3).toString())
            //console.log('file is: ', msg.slice(0, 10).toString())
            if (file_type == "CSV"){
                // let file = fs.createWriteStream('array.csv');
                // file.on('error', function(err) { 
                //     console.error('Failed to create a csv file:', err);
                //     return; 
                // });
                
                // msg.slice(3, msg.length).forEach(function(v) { 
                //     file.write(v.join(', ') + '\n'); 
                // });

                // for (i = 3; i < msg.length; ++i) {
                //     file.write(msg[i]);
                // }

                //file.end();

                msg = msg.slice(3, msg.length)

                var b = new Buffer.alloc(msg.length);
                //var c = "";
                for (var i = 0; i < msg.length; i++) {
                    b[i] = msg[i];
                    //c = c + " " + msg[i]
                }
                fs.writeFile("test.csv", b,  "binary",function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("The file was saved!");
                    }
                });
            }
        }
    } 
});


client.on('error', (err) => {    
    console.error('Client error:', err.stack);
    client.close();
});

client.on('close', () => {
    console.log('Client closed');
});

//node UDPClient4.js
