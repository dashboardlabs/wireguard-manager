# WireGuard VPN Manager

A simple WireGuard VPN Manager to generate, assign, and manage profiles to users.

<img src="https://github.com/dashboardlabs/wireguard-manager/blob/main/docs/img/screen.png?raw=true" /> 

## Requirements

- Cloudflare Access
- NodeJS 14 (LTS)
- MongoDB Database (Does not need to be hosted in same server)
- A WireGuard Server Installation (tested in Ubuntu 20.04 LTS)

## Notes for WireGuard Installation

When configuring your WireGuard Installation, ensure that the `SaveConfig = true` option is enabled in your WireGuard Interface. An example of what your configuration file should look like is as shown:

```conf
[Interface]
PrivateKey = <insert your private key here>
Address = 10.69.0.1/16
SaveConfig = true
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

In addition, this server is configured for 16 subnet bits with a subnet mask of `255.255.0.0`. For a server IP address of `10.69.0.1/16`, your usable IP ranges would be from `10.69.0.2/32` until `10.69.255.254/32` -- allowing up to around 60-thousand devices (theoretically).
