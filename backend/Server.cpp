#include <iostream> 
#include <WinSock2.h> 
#include <WS2tcpip.h> 
#include <stdio.h> 
#include <vector> 
#include <fstream>
#include <string> 
#include <algorithm>
#include <cstdlib>
#include <sstream>

#pragma comment(lib, "Ws2_32.lib") 

using namespace std;

vector<int>::iterator lookingfor0(vector<int>::iterator it, vector<int>::iterator it2, short value) {
    while  (it != it2) {
        it++;
        // found nth element..print and break.
        if (*it == value) {
            cout << *it << endl;  // prints d.
            break;
        }
    }
    return it;
}

vector<int>::iterator lookingfor1(vector<int> myvector, short value) {
    vector<int>::iterator it;
    for (it = myvector.begin(); it != myvector.end(); it++) {
        // found nth element..print and break.
        if (*it == value) {
            cout << *it << endl;  // prints d.
            break;
        }
    }
    return it;
}

template <typename T> typename vector<T>::iterator lookingfor(vector<T> myvector, T value) {
    typename vector<T>::iterator it;
    for (it = myvector.begin(); it != myvector.end(); it++) {
        // found nth element..print and break.
        if (*it == value) {
            //cout << *it << endl;  // prints d.
            break;
        }
    }
    return it;
}


// Функции хеширования, добавьте сюда ваши функции если они нужны 


int main()
{
    //system("start C:\\WINDOWS\\system32\\calc.exe");
    //return 0;

    // Инициализация переменных 
    const int port_num = 1234;			// Enter Open working server port // Номер порта 
    const long buff_size = 65507;       // Maximum size of buffer for exchange info between server and client
    const int attempts_send = 100;

    //cout << sizeof(int) << endl;

    WSADATA wsData;
    int erStat = WSAStartup(MAKEWORD(2, 2), &wsData);

    if (erStat != 0) {
        cout << "WinSock initialization failed: " << WSAGetLastError() << endl;
        return 1;
    }

    // Создание сокета UDP 
    SOCKET ServSock = socket(AF_INET, SOCK_DGRAM, 0);
    if (ServSock == INVALID_SOCKET) {
        cout << "Socket initialization failed: " << WSAGetLastError() << endl;
        closesocket(ServSock);
        WSACleanup();
        return 1;
    }

    // Настройка адреса сервера 
    sockaddr_in servInfo;
    ZeroMemory(&servInfo, sizeof(servInfo));
    servInfo.sin_family = AF_INET;
    servInfo.sin_addr.s_addr = htonl(INADDR_ANY); // Принимать со всех адресов 
    servInfo.sin_port = htons(port_num); 

    // Привязка сокета к адресу 
    if (bind(ServSock, (sockaddr*)&servInfo, sizeof(servInfo)) != 0) {
        cout << "Binding failed: " << WSAGetLastError() << endl;
        closesocket(ServSock);
        WSACleanup();
        return 1;
    }

    cout << "Server is ready to receive messages." << endl;

    sockaddr_in clientAddr;
    int clientAddrSize = sizeof(clientAddr);


    int bytesReceived;
    //int size_of_picture = 0;

    int client_number = 0;

    while (true) {
        client_number++;
        char* buffer = new char[buff_size];
        bytesReceived = recvfrom(ServSock, buffer, buff_size, 0, (sockaddr*)&clientAddr, &clientAddrSize);
        if (bytesReceived == SOCKET_ERROR) {
            cout << "Error receiving data: " << WSAGetLastError() << endl;
            delete[] buffer;
            continue;
        }
        else {
            cout << "Client's message is received by chars: " << bytesReceived << endl;
            //string pack(buffer, 2);// = (string)buffer[0] + buffer[1];
            //short pack(buffer, 2); // почему-то выдаёт 2
            //unsigned short pack = *(buffer + 1); // почему-то правильно не работает
            //unsigned short pack = ((*buffer) << 8) | *(buffer + 1);
            //short c = (((short)a) << 8) | b;
            //cout << "Client's no. of package: " << pack << endl;
            //unsigned short pack = (((unsigned short)buffer[1]) << 8) | buffer[0];
            //unsigned short pack = (((unsigned short)buffer[1]) << 8);
            //cout << "Client's no. of package2: " << pack << endl;
            //cout << "package3: " << (unsigned short)(unsigned char)buffer[0] << endl;
            //pack = pack | (unsigned short)(unsigned char)buffer[0];
            //cout << "Client's no. of package3: " << pack << endl;
            //cout << "Client's two char's: " <<  +(unsigned char)buffer[-1] << "  " << +(unsigned char)buffer[0] << " " << +(unsigned char)buffer[1] << " " << +(unsigned char)buffer[2] << endl;
            //pack = (((unsigned short)(unsigned char)buffer[1022]) << 8) | (unsigned short)(unsigned char)buffer[1023];
            //cout << "Client's no. of package2: " << pack << endl;
            //pack = (((unsigned short)(unsigned char)buffer[1023]) << 8) | (unsigned short)(unsigned char)buffer[1022];
            //cout << "Client's no. of package3: " << pack << endl;
            //cout << "Client's char's: " <<  +(unsigned char)buffer[-1] << "  " << +(unsigned char)buffer[0] << " " << +(unsigned char)buffer[1] << " " << +(unsigned char)buffer[2] << " " << +(unsigned char)buffer[3] << "   ...   " << +(unsigned char)buffer[1022] << " " << +(unsigned char)buffer[1023] << "  " << +(unsigned char)buffer[1024] << endl;
            //pack = *buffer;
            //cout << "Client's no. of package2: " << pack << endl;
        }
        unsigned short pack_num2 = (((unsigned short)(unsigned char)buffer[1]) << 8) | (unsigned short)(unsigned char)buffer[0];
        unsigned short pack_num = (((unsigned short)(unsigned char)buffer[0]) << 8) | (unsigned short)(unsigned char)buffer[1];
        cout << "Client's amount of package: " << pack_num << " or " << pack_num2 << endl;
        char** packets = new char* [pack_num]; // скорее всего так будет на сервере

        // Вывод принятых данных 
        //cout << "Received data: " << string(buffer, bytesReceived) << endl;
        
        // получение формата фотографии
        bytesReceived = recvfrom(ServSock, buffer, buff_size, 0, (sockaddr*)&clientAddr, &clientAddrSize);
        if (bytesReceived == SOCKET_ERROR) {
            cout << "Error receiving data: " << WSAGetLastError() << endl;
            delete[] buffer;
            continue;
        }
        string photo_format = string(buffer, bytesReceived);
        delete[] buffer;


        // Обработка данных 

        // Отправка ответа 
        string response = "Data received successfully";
        int sendOk = sendto(ServSock, response.c_str(), response.size(), 0, (sockaddr*)&clientAddr, clientAddrSize);
        if (sendOk == SOCKET_ERROR) {
            cout << "Sending a message about the number of packets failed: " << WSAGetLastError() << endl;
            continue;
        }

        //vector <int> rem_pack(1);      // кол-во оставшихся пакетов
        vector <short> rem_pack(pack_num);     // кол-во оставшихся пакетов
        //for (int &i : rem_pack) cout << i << ' '; cout << endl;
        for (int i = 0; i < rem_pack.size(); i++) rem_pack[i] = i;
        //for (int& i : rem_pack) cout << i << ' '; cout << endl;
        //cout << "rem_pack.size(): " << rem_pack.size() << endl;

        // получение пакетов и повторное получение пакетов
        int attamp = attempts_send;
        //cout << "numbers of attampts = " << attempts_send - attamp << endl;
        while (rem_pack.size() > 0 && attamp-- > 0)
        {
            //if (attamp == attempts_send - 1) rem_pack.clear();
            //cout << "rem_pack.size(): " << rem_pack.size() << endl;
            vector <int> packs;
            int last_pack_size;
            unsigned short №pack = 0, №pack2 = 0, lst_pack = 0; // ноль только для unsigned
            lst_pack--;
            while (№pack != lst_pack)
            {
                buffer = new char[buff_size];
                bytesReceived = recvfrom(ServSock, buffer, buff_size, 0, (sockaddr*)&clientAddr, &clientAddrSize);
                if (bytesReceived == SOCKET_ERROR) {
                    cout << "Error receiving data: " << WSAGetLastError() << endl;
                    //delete[] buffer;
                    //continue;
                }
                №pack2 = (((unsigned short)(unsigned char)buffer[1]) << 8) | (unsigned short)(unsigned char)buffer[0];
                №pack = (((unsigned short)(unsigned char)buffer[0]) << 8) | (unsigned short)(unsigned char)buffer[1];
                cout << "Client's no. of package: " << №pack << " or " << №pack2 << endl;
                if (№pack != lst_pack) {
                    packets[№pack] = buffer;
                    packs.push_back(№pack);
                    //auto it = (rem_pack.begin() + (int)№pack);
                    //cout << *it << endl;
                    //if (lookingfor0(rem_pack.begin(), rem_pack.end(), №pack) == rem_pack.end()) return 111;
                    //vector<int>::iterator it;
                    for (auto it = rem_pack.begin(); it != rem_pack.end(); it++) {
                        // found nth element..print and break.
                        if (*it == №pack) {
                            //cout << *it << endl;  // prints d.
                            rem_pack.erase(it);
                            break;
                        }
                    }
                    //rem_pack.erase(rem_pack.begin() + №pack);
                    //rem_pack.remove(rem_pack.begin() + №pack);
                }
                else delete[] buffer;
            }

            sort(packs.begin(), packs.end());
            cout << "BCE!!!" << endl;

            //for (int i = 0; i < packs.size(); i++) // цикл рабочий
            //{
            //    cout << packs[i] << " ";
            //    cout << packets[packs[i]] << endl;
            //}

            //int num = 0;
            //for (int i = 0; i < pack_num; i++) {
            //    if (packs[num] <= i && packs.size() > num) num++;
            //    else rem_pack.push_back(i);
            //}
            //int num = 0;
            //for (int i = 0; i < pack_num; i++) {
            //    if (num < packs.size() && packs[num] == i) num++;
            //    else rem_pack.push_back(i);
            //}


            cout << "Check packets: total: " << pack_num << ", received = " << packs.size() << ", left =  " << rem_pack.size() << endl;

            //for (int i = 0; i < rem_pack.size(); i++)
            //{
            //    cout << rem_pack[i] << " ";
            //    //cout << packets[packs[i]] << endl;
            //} cout << endl;


            // Отправка ответа 
            if (rem_pack.size() > 0) {
                string response = "notOK";
                sendOk = sendto(ServSock, response.c_str(), response.size(), 0, (sockaddr*)&clientAddr, clientAddrSize);
                if (sendOk == SOCKET_ERROR) {
                    cout << "Sending a message about the status: " << WSAGetLastError() << endl;
                }
                //response = "10";
                //sendOk = sendto(ServSock, response.c_str(), response.size(), 0, (sockaddr*)&clientAddr, clientAddrSize);
                //if (sendOk == SOCKET_ERROR) {
                //    cout << "Sending a message about the status: " << WSAGetLastError() << endl;
                //}
                Sleep(100);
                cout << "I'm sending " << rem_pack.size() << " int..." << endl;
                //sendOk = sendto(ServSock, (char*)rem_pack.data(), rem_pack.size() * sizeof(rem_pack[0]), 0, (sockaddr*)&clientAddr, clientAddrSize);
                //if (sendOk == SOCKET_ERROR) {
                //    cout << "Sending a message of numbers lost packs failed: " << WSAGetLastError() << endl;
                //}
                std::stringstream ss;
                for (size_t i = 0; i < rem_pack.size(); ++i)
                {
                    if (i != 0)
                        ss << ",";
                    ss << rem_pack[i];
                }
                std::string s = ss.str();
                sendOk = sendto(ServSock, s.c_str(), s.size(), 0, (sockaddr*)&clientAddr, clientAddrSize);
                if (sendOk == SOCKET_ERROR) {
                    cout << "Sending a message of numbers lost packs failed: " << WSAGetLastError() << endl;
                }
            }
            else {
                string response = "OK";
                sendOk = sendto(ServSock, response.c_str(), response.size(), 0, (sockaddr*)&clientAddr, clientAddrSize);
                if (sendOk == SOCKET_ERROR) {
                    cout << "Sending a message about the number of packets failed: " << WSAGetLastError() << endl;
                }

                string path = "attampts\\" + to_string(client_number) + photo_format;
                ofstream testout(path, ios_base::binary);
                //buffer = new char[buff_size];
                for (int i = 0; i < pack_num; i++)
                {
                    //char* packet = new char[buff_size - sizeof(pack_num)];
                    //packet = &packets[i][sizeof(pack_num)];
                    //packets[i] = 'a' + i % 26;
                    //if (pack_num - 1) testout.write(packets[i], last_pack_size);
                    //else testout.write(packets[i], buff_size);
                    testout.write(&packets[i][sizeof(pack_num)], buff_size - sizeof(pack_num));
                }


                //testout.write(buffer, buff_size);
                testout.close();

                for (int i = 0; i < pack_num; i++)
                {
                    delete[] packets[i];
                }
                delete[] packets;
                //delete[] buffer;

                // запуск нейронки

                // отправка csv файла
                    // открытие файла и запись в массив чаров
                ifstream in("road_map.csv");
                if (!in)
                {
                    cout << "File was not opened: road_map.csv";
                    closesocket(ServSock);
                    WSACleanup();
                    return -1;
                }

                in.seekg(0, std::ios::end);
                long long size = in.tellg();
                //if (size > 2147483647 || size - 1 > pow(2, 8 * sizeof(packets_num)) * (BUFF_SIZE - 2)) // заменить pow на побитовый сдвиг /// size-1 т.к. есть закрывающий пакет
                //{
                //    cout << "Photo is too large!";
                //    closesocket(ClientSock);
                //    WSACleanup();
                //    _getch();
                //    return 1;
                //}
                in.close();

                in.open("road_map.csv", ios_base::binary);
                if (!in)
                {
                    cout << "File was not opened: road_map.csv";
                    closesocket(ServSock);
                    WSACleanup();
                    //_getch();
                    return -1;
                }

                char* bytes = new char[size];
                in.read(bytes, size);
                in.close();

                //// отправка размера файла
                ////string response = "OK";
                //sendOk = sendto(ServSock, (char*)&size, sizeof(size), 0, (sockaddr*)&clientAddr, clientAddrSize);
                //if (sendOk == SOCKET_ERROR) {
                //    cout << "Sending a message about the number of packets failed: " << WSAGetLastError() << endl;
                //}

                //// биение на пакеты и отправка пакетов
                //short package_number = 0;
                //while (package_number * buff_size) {

                //}

                // отправка байтов
                sendOk = sendto(ServSock, bytes, size, 0, (sockaddr*)&clientAddr, clientAddrSize);
                if (sendOk == SOCKET_ERROR) {
                    cout << "Sending the CSV file failed: " << WSAGetLastError() << endl;
                }
                
            }

            packs.clear(); // впринце больше не нужен
        }
        //rem_pack.clear(); // нет смысла, т.к. он итак должен стать пустым при выходе
        
    }
    
    closesocket(ServSock);
    WSACleanup();
    return 0;
}