import React, { ReactElement } from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets'

import theme from '../themes/theme'

class MyDocument extends Document {
  render(): ReactElement {
    return (
      <html lang={'en'} dir={'ltr'}>
        <Head>
          <meta charSet={'utf-8'} />
          {/* <meta name={'description'} content={''} /> */}
          <meta name={'theme-color'} content={theme.palette.primary.main} />
          {/* <meta property={'og:title'} content={''} /> */}
          <meta property={'og:type'} content={'website'} />
          {/* <meta property={'og:url'} content={''} /> */}
          {/* <meta property={'og:description'} content={''} /> */}
          {/* <meta property={'og:image'} content={''} /> */}
          {/* <link rel={'icon'} type={'image/x-icon'} href={''} /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

// eslint-disable-next-line
MyDocument.getInitialProps = async (ctx): Promise<any> => {
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  // eslint-disable-next-line
  ctx.renderPage = (): any =>
    originalRenderPage({
      // eslint-disable-next-line
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
    })

  const isProduction = process.env.NODE_ENV === 'production'
  const initialProps = await Document.getInitialProps(ctx)

  return {
    ...initialProps,
    isProduction,
    styles: (
      <>
        {initialProps.styles}
        {sheets.getStyleElement()}
      </>
    )
  }
}

export default MyDocument
