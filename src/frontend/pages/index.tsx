import { NextPage } from 'next'
import React, { ReactElement } from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DownloadIcon from '@material-ui/icons/CloudDownloadTwoTone'
import authenticated from '../layouts/authenticated'
import { Container } from '@material-ui/core'
import Devices from 'frontend/components/Devices'

const Home: NextPage = (): ReactElement => {
  return (
    <Container>
      <Typography color={'textPrimary'} variant={'h4'}>
        {'Activate VPN Service'}
      </Typography>
      <Typography color={'textSecondary'} variant={'h6'}>
        To use this VPN service, please add your devices so as to provision them in the network.
      </Typography>
      <br />
      <Devices />
      <br />
      <br />
      <Typography color={'textPrimary'} variant={'h4'}>
        {'Download VPN Client'}
      </Typography>
      This VPN service makes use of the <b><a href="https://www.wireguard.com/install">WireGuard</a></b> protocol. To connect to this VPN service, please download the official WireGuard Applications on your devices.
      <br />
      <br />
      <a href="https://www.wireguard.com/install">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<DownloadIcon />}
        >
          Download WireGuard
        </Button>
      </a>
    </Container>
  )
}

export default authenticated(Home)
