import { makeStyles } from '@material-ui/core/styles'
import { NextPage } from 'next'
import { Typography } from '@material-ui/core'
import React, { ReactElement } from 'react'
import AppBar from '../layouts/moduleViewer/AppBar'

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: theme.spacing(64),
    margin: 'auto'
  },
  padding: {
    padding: theme.spacing(2)
  }
}))

const Home: NextPage = (): ReactElement => {
  const classes = useStyles()

  return (
    <>
      <AppBar title='Project Boilerplate' />
      <Typography color={'textPrimary'} variant={'h4'} className={classes.padding}>
        {'Hello, World!'}
      </Typography>
    </>
  )
}

export default Home
