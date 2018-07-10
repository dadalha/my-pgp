docker network create pogonet
docker run -tdi -e MYSQL_ALLOW_EMPTY_PASSWORD=1 --net=pogonet --name=mariadb mariadb:10
docker run -tdi --net=pogonet --name=pogo pogo
