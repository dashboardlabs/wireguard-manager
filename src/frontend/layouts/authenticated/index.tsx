import React, { ReactElement, FunctionComponent, useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { NextPage } from 'next'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MyAppBar from './MyAppBar'
import MyDrawer from './MyDrawer'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import drawerWidth from './_drawerWidth'

// import { useQuery } from '@apollo/client'
import query from './query'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
    minHeight: process.browser ? window.innerHeight * 0.75 - Number(theme.mixins.toolbar.minHeight) : '75vh',
    overflowX: 'hidden'
  },
  narrow: {
    margin: 'auto',
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(8)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(),
      marginBottom: theme.spacing(4)
    },
    maxWidth: theme.spacing(144)
  },
  wide: {
    paddingLeft: theme.spacing(),
    paddingRight: theme.spacing()
  },
  contentHideDrawer: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(),
      marginLeft: theme.spacing(),
      marginRight: theme.spacing(),
      marginBottom: theme.spacing(8)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
      marginLeft: theme.spacing(),
      marginBottom: theme.spacing(4)
    }
  },
  content: {
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(),
      marginRight: theme.spacing(),
      marginLeft: theme.spacing(),
      marginBottom: theme.spacing(8)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(4),
      marginRight: theme.spacing(4),
      marginLeft: drawerWidth + theme.spacing(4),
      marginBottom: theme.spacing(8)
    }
  }
}))

interface Options {
  narrow?: boolean
  wide?: boolean
}

const authenticated = (Page: FunctionComponent, options?: Options) => ():
  | FunctionComponent
  | NextPage
  | ReactElement => {
  const classes = useStyles({})
  const router = useRouter()
  const theme = useTheme()
  const breakpoint = useMediaQuery(theme.breakpoints.up('md'))

  // const { data, loading } = useQuery(query)
  // const user = data?.user

  const [open, setOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [router.pathname])

  let widthClass = classnames(classes.root)

  if (options?.narrow) {
    widthClass = classnames(classes.root, classes.narrow)
  }

  if (options?.wide) {
    widthClass = classnames(classes.root, classes.wide)
  }

  // if (loading || !user) {
  //   return null
  // }

  return (
    <>
      <MyAppBar
        onOpen={(): void => {
          setOpen(true)
        }}
        permanent={!options?.wide && !options?.narrow && breakpoint}
      />
      <div className={widthClass}>
        <div className={options?.wide || options?.narrow ? classes.contentHideDrawer : classes.content}>
          <Page />
        </div>
      </div>
      <MyDrawer
        open={open}
        onClose={(): void => {
          setOpen(false)
        }}
        permanent={!options?.wide && !options?.narrow && breakpoint}
        // user={user}
      />
    </>
  )
}

export default authenticated
