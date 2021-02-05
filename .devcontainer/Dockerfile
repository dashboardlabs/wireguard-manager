FROM node:12-alpine

RUN apk --no-cache add wireguard-tools iptables ip6tables inotify-tools git
RUN npm i -g ts-node

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 51820/udp 3000
VOLUME "/etc/wireguard"
