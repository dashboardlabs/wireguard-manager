node dist/createConfig.js
wg-quick up wg0
exec /sbin/tini -- node dist/index.js
