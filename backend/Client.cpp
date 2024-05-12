#include <iostream> 
#include <WinSock2.h> 
#include <WS2tcpip.h> 
#include <stdio.h> 
#include <vector> 
#include <fstream> 
#include <string>
#include <conio.h>
#include <Mswsock.h>
#include <cmath>
#include <time.h>
//#include <Ws2def.h>

#pragma comment(lib, "Ws2_32.lib") 

using namespace std;

// Функции хеширования, добавьте сюда ваши функции если они нужны 

int main()
{
    // Инициализация WinSock 
    const char SERVER_IP[] = "192.168.1.49";		    // Enter IPv4 address of Server
    const short PORT_NUM = 1234;				        // Enter Listening port on Server side
    const short BUFF_SIZE = 1024;					    // Maximum size of buffer for exchange info between server and client // не может быть больше определённого числа
    //const int sending_attempts = 100;
    const int SEND_ATT = 100;
    string FILE_NAME;
    cin >> FILE_NAME;
    int start = clock();
    unsigned short packets_num  // количество пакетов
        , №pack,                // номер пакета
        cls_pack;               // закрывающий пакет
    cls_pack = 0;
    for (int i = 0; i < sizeof(cls_pack); i++)
    {
        cls_pack = cls_pack << 8;
        cls_pack = cls_pack | (unsigned char)255;
    }
    //cls_pack--;
    WSADATA wsData;
    int erStat = WSAStartup(MAKEWORD(2, 2), &wsData);
    if (erStat != 0) {
        cout << "WinSock initialization failed: " << WSAGetLastError() << endl;
        _getch();
        return 1;
    }

    // Создание UDP сокета 
    SOCKET ClientSock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
    if (ClientSock == INVALID_SOCKET) {
        cout << "Socket initialization failed: " << WSAGetLastError() << endl;
        closesocket(ClientSock);
        WSACleanup();
        _getch();
        return 1;
    }

    // Адрес сервера 
    sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(PORT_NUM);                  // порт сервера 
    inet_pton(AF_INET, SERVER_IP, &serverAddr.sin_addr);    // IP сервера 

    int size_of_picture = 0;

    // Отправка сообщения 
    //string message = "Hello from client";
    //int sendOk = sendto(ClientSock, message.c_str(), message.size(), 0, (sockaddr*)&serverAddr, sizeof(serverAddr));
    //if (sendOk == SOCKET_ERROR) {
    //    cout << "Sending message failed: " << WSAGetLastError() << endl;
    //    closesocket(ClientSock);
    //    WSACleanup();
    //    return 1;
    //}

    ifstream in(FILE_NAME);

    if (!in)
    {
        cout << "File was not opened: " << FILE_NAME;
        _getch();
        return -1;
    }
    in.seekg(0, std::ios::end);
    long long size = in.tellg();
    if (size > 2147483647 || size - 1 > pow(2, 8 * sizeof(packets_num)) * (BUFF_SIZE - 2)) // заменить pow на побитовый сдвиг /// size-1 т.к. есть закрывающий пакет
    {
        cout << "Photo is too large!";
        closesocket(ClientSock);
        WSACleanup();
        _getch();
        return 1;
    }
    in.close();

    in.open(FILE_NAME, ios_base::binary);
    if (!in)
    {
        cout << "File was not opened: " << FILE_NAME;
        closesocket(ClientSock);
        WSACleanup();
        _getch();
        return -1;
    }

    char* bytes = new char[size];
    in.read(bytes, size);
    in.close();


    int iResult = 0;

    unsigned int bOptVal = 134217728;//2147483647
	int bOptLen = sizeof(bOptVal);

	int iOptVal = 0;
	int iOptLen = sizeof(int);

	iResult = getsockopt(ClientSock, SOL_SOCKET, SO_MAX_MSG_SIZE, (char*)&iOptVal, &iOptLen);
	if (iResult == SOCKET_ERROR) {
		wprintf(L"getsockopt for SO_MAX_MSG_SIZE failed with error: %u\n", WSAGetLastError());
	}
	else
		wprintf(L"SO_MAX_MSG_SIZE Value: %ld\n", iOptVal);

	iResult = getsockopt(ClientSock, SOL_SOCKET, SO_SNDBUF, (char*)&iOptVal, &iOptLen);
	if (iResult == SOCKET_ERROR) {
		wprintf(L"getsockopt for SO_SNDBUF failed with error: %u\n", WSAGetLastError());
	}
	else
		wprintf(L"SO_SNDBUF Value: %ld\n", iOptVal);

    wprintf(L"SO_MAXDG Value: %ld\n", SO_MAXDG); //cout << SO_MAXDG;

    //iResult = getsockopt(ClientSock, SOL_SOCKET, SO_MAXDG, (char*)&iOptVal, &iOptLen);
    //if (iResult == SOCKET_ERROR) {
    //    wprintf(L"getsockopt for SO_MAXDG failed with error: %u\n", WSAGetLastError());
    //}
    //else
    //    wprintf(L"SO_MAXDG Value: %ld\n", iOptVal);

	//1073741824

	//iResult = setsockopt(ClientSock, SOL_SOCKET, SO_SNDBUF, (char*)&bOptVal, bOptLen);
	//if (iResult == SOCKET_ERROR) {
	//	wprintf(L"setsockopt for SO_SNDBUF failed with error: %u\n", WSAGetLastError());
	//}
	//else
	//	wprintf(L"Set SO_SNDBUF: %ld\n", bOptVal);

	//iResult = getsockopt(ClientSock, SOL_SOCKET, SO_SNDBUF, (char*)&iOptVal, &iOptLen);
	//if (iResult == SOCKET_ERROR) {
	//	wprintf(L"getsockopt for SO_SNDBUF failed with error: %u\n", WSAGetLastError());
	//}
	//else
	//	wprintf(L"SO_SNDBUF Value: %ld\n", iOptVal);

    packets_num = size / (BUFF_SIZE - sizeof(packets_num));
    if (size % (BUFF_SIZE - sizeof(packets_num)) != 0) packets_num++;
    if (!packets_num)
    {
        cout << "The file \"" << FILE_NAME << "\" is empty" << endl;
        closesocket(ClientSock);
        WSACleanup();
        _getch();
        return 1;
    }

    cout << "Numbers of packets: " << packets_num << endl;

    // Отправка кол-ва пакетов
    int sendOk = sendto(ClientSock, (char*)&packets_num, sizeof(packets_num), 0, (sockaddr*)&serverAddr, sizeof(serverAddr));
    if (sendOk == SOCKET_ERROR) {
        cout << "Sending a message about the number of packets failed: " << WSAGetLastError() << endl;
        closesocket(ClientSock);
        WSACleanup();
        _getch();
        return 1;
    }

    // Получение ответа 
    char buf[1024];
    int serverSize = sizeof(serverAddr);
    int bytesReceived = recvfrom(ClientSock, buf, 1024, 0, (sockaddr*)&serverAddr, &serverSize);
    if (bytesReceived == SOCKET_ERROR) {
        cout << "Receiving failed: " << WSAGetLastError() << endl;
        closesocket(ClientSock);
        WSACleanup();
        _getch();
        return 1;
    }
    else cout << "Server says: " << string(buf, bytesReceived) << endl;

    
    vector <short> rem_pack(packets_num);     // кол-во оставшихся пакетов
    //for (int &i : rem_pack) cout << i << ' '; cout << endl;
    for (int i = 0; i < rem_pack.size(); i++) rem_pack[i] = i;

    //rem_pack.clear();
    //cout << rem_pack.size() << " " << rem_pack.empty();

    int attamp = SEND_ATT;
    //cout << "numbers of attampts = " << SEND_ATT - attamp << endl;
    while (rem_pack.size() > 0 && attamp-- > 0)
    {
        cout << "Attampt no." << SEND_ATT - attamp << ": ";
        bool BYTE_END = false;
        long №byte;
        №pack = -1;
        //cout << "Numbers of packets: " << packets_num << endl;
        while (++№pack < rem_pack.size())           // сборка + отпррвка покетов 
        {
            №byte = rem_pack[№pack] * (BUFF_SIZE - sizeof(rem_pack[№pack]));
            char* packet = new char[BUFF_SIZE];
            for (int i = 0; i < BUFF_SIZE; i++)         // сборка покета
            {
                if (!i)
                {
                    //cout << "It should be 2: " << sizeof(rem_pack[№pack]) << endl;
                    for (int u = 0; u < sizeof(rem_pack[№pack]); u++) // по чарово записываем в начало массива
                    {
                        //char ch = 0;
                        packet[i++] = (rem_pack[№pack] >> (8 * u));
                        //cout << u << endl;
                    }
                    i--;
                    //i += sizeof(№pack) - 1;
                    //packet[i] = №pack;
                }
                else
                {
                    //char ia = bytes[№byte];
                    if (BYTE_END) packet[i] = 0;
                    else packet[i] = bytes[№byte];

                    if (№byte < size) №byte++;
                    else BYTE_END = true;
                }
            }

            //unsigned short pack = *packet;
            //cout << "cheack no. of package: " << pack << endl;
            unsigned short pack = (((unsigned short)(unsigned char)packet[1]) << 8) | (unsigned short)(unsigned char)packet[0];
            cout << "cheack no. of package v2: " << pack << endl;

            //cout << "Client's char's: " << +(unsigned char)packet[-1] << "  " << +(unsigned char)packet[0] << " " << +(unsigned char)packet[1] << " " << +(unsigned char)packet[2] << " " << +(unsigned char)packet[3] << endl;


            // отправка пакета
            int sendOk = sendto(ClientSock, packet, BUFF_SIZE, 0, (sockaddr*)&serverAddr, sizeof(serverAddr));
            if (sendOk == SOCKET_ERROR) {
                cout << "Sending a packet №" << rem_pack[№pack] << " failed: " << WSAGetLastError() << endl;
                closesocket(ClientSock);
                WSACleanup();
                _getch();
                return 1;
            }

            delete[] packet;
        }
        cout << "I 'm waiting and then I'm sending the closing package..." << endl;
        // отправка закрывающего покета после сна и проверка на ??? на получение? (нужно подключать закрывающиеся сокеты)
        Sleep(200);
        int sendOk = sendto(ClientSock, (char*)&cls_pack, BUFF_SIZE, 0, (sockaddr*)&serverAddr, sizeof(serverAddr));
        if (sendOk == SOCKET_ERROR) {
            cout << "Sending a close packet failed: " << WSAGetLastError() << endl;
            closesocket(ClientSock);
            WSACleanup();
            _getch();
            return 1;
        }


        // получение ответа от сервера 
        char buf[BUFF_SIZE];         // статус из чаров //либо кол-во непришедших
        int serverSize = sizeof(serverAddr);
        int bytesReceived = recvfrom(ClientSock, buf, BUFF_SIZE, 0, (sockaddr*)&serverAddr, &serverSize);
        if (bytesReceived == SOCKET_ERROR) {
            cout << "Receiving of status failed: " << WSAGetLastError() << endl;
            closesocket(ClientSock);
            WSACleanup();
            cout << "here?";
            _getch();
            return 1;
        }
        string st = string(buf, bytesReceived);  //статус из стринга
        cout << "Server says: " << st << endl;
        for (auto& x : st) x = tolower(x);
        if (st != "ok")
        {
            //int wrong = atoi(st.c_str());
            // полчение вектора непришедших данных/пакетов
            int bytesReceived = recvfrom(ClientSock, (char*)rem_pack.data(), sizeof(rem_pack[0]) * rem_pack.size(), 0, (sockaddr*)&serverAddr, &serverSize);
            if (bytesReceived == SOCKET_ERROR) {
                cout << "Receiving of remaining packages failed: " << WSAGetLastError() << endl;
                closesocket(ClientSock);
                WSACleanup();
                _getch();
                return 1;
            }
            cout << "Received bytes: " << bytesReceived / sizeof(rem_pack[0]) << endl;
            rem_pack.erase(rem_pack.begin() + (bytesReceived / sizeof(rem_pack[0])), rem_pack.end());   // переназночение размера или уменьшение вектора до принятых значений
            for (auto& i : rem_pack) cout << i << ' '; cout << endl;
        }
        else rem_pack.clear();


        // повторная отправнка    
    }

    int end = clock();
    //double seconds = (double)(end - start) / CLOCKS_PER_SEC;
    cout << " " << (double)(end - start) / CLOCKS_PER_SEC;

    // Закрытие сокета 
    closesocket(ClientSock);
    WSACleanup();
    delete[] bytes;

    //cin.get();
    _getch();
    return 0;
}