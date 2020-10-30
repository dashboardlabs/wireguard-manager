//eslint-disable-next-line
const globalAny: any = global

import React, { ReactElement, ReactEventHandler } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AppBar from '@material-ui/core/AppBar'
import Brightness4Icon from '@material-ui/icons/Brightness3'
import Brightness5Icon from '@material-ui/icons/Brightness4'
import ButtonBase from '@material-ui/core/ButtonBase'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing()
  },
  grow: {
    flexGrow: 1
  },
  title: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'clip'
  }
}))

const MyAppBar = ({ onOpen, permanent }: { onOpen: ReactEventHandler; permanent: boolean }): ReactElement => {
  const classes = useStyles({})
  const router = useRouter()
  const theme = useTheme()

  return (
    <AppBar
      elevation={0}
      position={useMediaQuery(theme.breakpoints.up('md')) ? 'sticky' : 'relative'}
      color={globalAny.darkTheme ? 'default' : 'primary'}
    >
      <Toolbar>
        {!permanent && (
          <IconButton color={'inherit'} onClick={onOpen} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
        )}
        <ButtonBase
          onClick={(): void => {
            router.push('/')
          }}
        >
          <Typography variant={'h6'} className={classes.title}>
            {'VPN Manager'}
          </Typography>
        </ButtonBase>
        <div className={classes.grow} />
      </Toolbar>
    </AppBar>
  )
}

export default MyAppBar
