//eslint-disable-next-line
const globalAny: any = global

import React, { ReactElement } from 'react'

import App from 'next/app'
import Head from 'next/head'

import ThemeProvider from '@material-ui/styles/ThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'

import theme from '../themes/theme'

import { ApolloProvider } from '@apollo/client'
import client from '../apollo/client'
import Notification from '../components/Notification'

class MyApp extends App {

  render(): ReactElement {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <title>{'VPN Manager'}</title>
          <meta name={'viewport'} content={'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'} />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApolloProvider client={client}>
            <Component {...pageProps} />
            <Notification />
          </ApolloProvider>
        </ThemeProvider>
      </>
    )
  }
}

export default MyApp
