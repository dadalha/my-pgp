FROM node:10-jessie

# [ -- PROTOBUF -- ] #
WORKDIR /opt
RUN apt-get update
RUN apt-get install -y autoconf automake libtool curl make g++ unzip git
RUN wget https://github.com/google/protobuf/releases/download/v3.0.0/protobuf-cpp-3.0.0.zip
RUN unzip *.zip
WORKDIR /opt/protobuf-3.0.0
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make check
RUN make install
RUN ldconfig

# [ -- POGOSERVER -- ] #
WORKDIR /opt
COPY my-server /opt/POGOserver
WORKDIR /opt/POGOserver
RUN npm install
RUN npm install -g check-dependencies
RUN check-dependencies

ENTRYPOINT [ "/usr/local/bin/npm", "run", "start" ]
CMD [ "|", "tee", "output" ]
