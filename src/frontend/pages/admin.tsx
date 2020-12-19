import { NextPage } from 'next'
import React, { ReactElement } from 'react'
import Typography from '@material-ui/core/Typography'
import authenticated from '../layouts/authenticated'
import { Container } from '@material-ui/core'
import Devices from 'frontend/components/Devices'

const Home: NextPage = (): ReactElement => {
  return (
    <Container>
      <Typography color={'textPrimary'} variant={'h4'}>
        {'Connected Devices'}
      </Typography>
      <Typography color={'textSecondary'} variant={'h6'}>
        Here are all the devices registered on this VPN server.
      </Typography>
      <br />
      <Devices />
    </Container>
  )
}

export default authenticated(Home)
