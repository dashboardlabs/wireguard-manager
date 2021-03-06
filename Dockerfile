FROM node:12-alpine

RUN apk --no-cache add wireguard-tools iptables ip6tables inotify-tools tini
RUN deluser --remove-home node

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN chmod 755 ./server.sh

RUN npm run build
RUN npm prune --production

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 51820/udp 8080
VOLUME "/etc/wireguard"

CMD [ "./server.sh" ]
