import React, { ReactElement, FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NextPage } from 'next'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1
  },
  background: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'fixed',
    backgroundImage: 'linear-gradient(transparent, #002365 )',
    opacity: '70%',
    zIndex: -1
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    minHeight: '100vh',
    paddingTop: theme.spacing(4)
  },
  logo: {
    height: theme.spacing(12.5),
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
  tagline: {
    color: 'white',
    marginBottom: theme.spacing(3)
  },
  content: {
    paddingBottom: theme.spacing(8),
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    maxWidth: theme.spacing(64),
    margin: 'auto'
  }
}))

export default (Page: FunctionComponent) => (): FunctionComponent | NextPage | ReactElement => {
  const classes = useStyles({})
  return (
    <>
      <div className={classes.background} />
      <div className={classes.root}>
        <div>
          <img alt={''} src={'/static/logo.svg'} className={classes.logo} />
          <Typography variant={'h4'} align={'center'} style={{ color: '#00B200' }} className={classes.tagline}>
            {'Specimen Submitted Successfully!'}
          </Typography>
          <div className={classes.content}>
            <Page />
          </div>
        </div>
      </div>
    </>
  )
}
