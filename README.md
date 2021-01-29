# WireGuard VPN Manager

A simple WireGuard VPN Manager to generate, assign, and manage profiles to users.

[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/dashlabsai/wireguard-manager?style=flat-square)](https://hub.docker.com/r/dashlabsai/wireguard-manager)

<img src="https://github.com/dashboardlabs/wireguard-manager/blob/main/docs/img/screen.png?raw=true" /> 

## Requirements

- Cloudflare Access
- NodeJS 14 (LTS)
- MongoDB Database (Does not need to be hosted in same server)
- One of the following:
  - A WireGuard Server Installation (tested in Ubuntu 20.04 LTS)
  - A Kubernetes Cluster

## Kubernetes Cluster

### Compatibility List:
- ✅ Google Kubernetes Engine (Node Pool must be using an Ubuntu OS)
- ✅ Azure Kubernetes Service
- ⚠️ Amazon Elastic Kubernetes Service (not tested)
- ❌ DigitalOcean Kubernetes Service (No UDP LoadBalancer support)

### Installation Instructions:

1. Edit the `k8s/manifest.yaml` file. Fields that need to be edited will be commented with `TODO: Edit me!!!`.
2. Ensure that your `kubectl` context is set to the correct cluster.
3. If you don't have an nginx ingress installed, please install it using: 

```
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx
```

Use `kubectl get service ingress-nginx-controller` to obtain the External IP of the Nginx Ingress and ensure that your domain points to that IP address.

Note: The Nginx Ingress IP address and the VPN IP address will be different.

Enable Lets Encrypt SSL by running the following commands:
```
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.1/cert-manager.crds.yaml
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager --version v0.14.1 --namespace cert-manager jetstack/cert-manager
```

4. Run the following commands: 

```
kubectl create namespace wireguard-manager
kubectl apply -f k8s/manifest.yaml
```

The Docker Image should automatically generate a wireguard configuration file and should get a external IP address for you.

The DNS Server is set to use the Kubernetes' built-in DNS server so users may connect to services within the Kubernetes Cluster through using the format: `my-svc.my-namespace.svc.cluster.local`

## Running on Docker

```
docker run \
 --cap-add net_admin \
 --cap-add sys_module \
 -p 8080:8080 \
 -p 51820:51820/udp \
 -e CF_ACCESS_URI='https://yourdomain.cloudflareaccess.com' \
 -e DB_URI='mongodb://<your_mongodb_server>' \
 -e WIREGUARD_START_IP='10.69.0.0' \
 -e WIREGUARD_ENDPOINT='your.host:51820' \
 -e ALLOWED_IPS='0.0.0.0/0, ::/0' \
 -v <please specify a folder here to store the WireGuard config>:/etc/wireguard \
 dashlabsai/wireguard-manager
```

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
