#include <stdio.h> 
#include <netdb.h> 
#include <netinet/in.h> 
#include <stdlib.h> 
#include <string.h> 
#include <sys/socket.h> 
#include <sys/types.h> 
#include <stdbool.h>
#include <unistd.h>
#define MAX 80 
#define PORT 8080 
#define SA struct sockaddr 
  
void func(int sockfd) 
{ 
    char buff[MAX]; 
    int n; 
    bool done = true;

    while (done) { 
        bzero(buff, MAX); 

        /* Read from client */
        read(sockfd, buff, sizeof(buff)); 
        if (strncmp("auth", buff, 4) == 0) { 
            /* Client is requesting authorization */
            printf("Authorizing...\n"); 
            bzero(buff, MAX); 
            strncpy(buff, "Authorized", 11);
            /* Authorize client */
            write(sockfd, buff, sizeof(buff)); 
        } 
    } 
} 
  
int main() 
{ 
    int sockfd, connfd, len; 
    struct sockaddr_in servaddr, cli; 
    pid_t childpid; /* an int to determine which process is a child process */
    int optval = 1; /* boolean value when we set socket option */

  
    sockfd = socket(AF_INET, SOCK_STREAM, 0); 
    if (sockfd == -1) { 
        printf("socket creation failed...\n"); 
        exit(0); 
    } 
    else
        printf("Socket successfully created..\n"); 
    bzero(&servaddr, sizeof(servaddr)); 
  
    servaddr.sin_family = AF_INET; 
    servaddr.sin_addr.s_addr = htonl(INADDR_ANY); 
    servaddr.sin_port = htons(PORT); 

    /* Allow reuse of port */
	if( setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval)) < 0 ) {
		fprintf(stderr, "Error Setting socket option failed\n");
		exit(EXIT_FAILURE);
	}
  
    if ((bind(sockfd, (SA*)&servaddr, sizeof(servaddr))) != 0) { 
        printf("socket bind failed...\n"); 
        exit(0); 
    } 
    else
        printf("Socket successfully binded..\n"); 
  
    if ((listen(sockfd, 5)) != 0) { 
        printf("Listen failed...\n"); 
        exit(0); 
    } 
    else
        printf("Server listening..\n"); 
        len = sizeof(cli); 
        while(1) {
                connfd = accept(sockfd, (SA*)&cli, &len); 
                if (connfd < 0) { 
                    printf("server acccept failed...\n"); 
                    exit(0); 
                } 
                else{
                    printf("server acccept the client...\n"); 
                    /* For handling multiple clients at once: */
                    /* Fork the process after accepting the client */
                    if((childpid = fork()) == 0) {
                        /* We are the child process */
                        close(sockfd); /* Close the old socket descriptor on the child process */
                        func(connfd); 
                    }
                }
            }
        
        close(connfd); 
} 

