//eslint-disable-next-line
const globalAny: any = global
import { makeStyles } from '@material-ui/core/styles'
import React, { ReactElement, FunctionComponent } from 'react'
import AppBar from './AppBar'
import { NextPage } from 'next'
import classnames from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 'auto',
    marginTop: theme.spacing(4),
    minHeight: process.browser ? window.innerHeight * 0.75 - Number(theme.mixins.toolbar.minHeight) : '75vh'
  },
  narrow: {
    maxWidth: theme.spacing(128)
  },
  wide: {},
  content: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginBottom: theme.spacing(8)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
      marginLeft: theme.spacing(),
      marginBottom: theme.spacing(4)
    }
  }
}))

export default (
  Page: FunctionComponent,
  { title, backRoute, wide }: { title: string; backRoute: string; wide?: boolean }
) => (): FunctionComponent | NextPage | ReactElement => {
  const classes = useStyles({})

  return (
    <>
      <AppBar title={title} backRoute={backRoute} />
      <div className={wide ? classnames(classes.root, classes.wide) : classnames(classes.root, classes.narrow)}>
        <div className={classes.content}>
          <Page />
        </div>
      </div>
    </>
  )
}
