import axios from 'axios'
import fs from 'fs'
import https from 'https'

const agent = new https.Agent({
  ca: process.env.KUBERNETES_SERVICE_HOST ? fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/ca.crt') : null
})

const getPublicIPAddressKube = async (): Promise<string> => {
  const token = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token')
  const res = await axios({
    method: 'GET',
    url: 'https://kubernetes.default.svc/api/v1/namespaces/wireguard-manager/services/wireguard-manager-vpn/',
    headers: {
      'Authorization': `Bearer ${token.toString()}`
    },
    httpsAgent: agent
  })
  return res?.data?.status?.loadBalancer?.ingress?.[0]?.ip
}

export default getPublicIPAddressKube
