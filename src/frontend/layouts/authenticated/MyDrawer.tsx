import React, { ReactElement, ReactEventHandler } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import Toolbar from '@material-ui/core/Toolbar'

import Content from './Content'
import drawerWidth from './_drawerWidth'
import { User } from '../../_types/user'

const useStyles = makeStyles({
  width: {
    width: drawerWidth,
    zIndex: 100
  }
})

const MyDrawer = ({
  open,
  onClose,
  permanent,
  user
}: {
  open: boolean
  onClose: ReactEventHandler
  permanent?: boolean
  user?: User
}): ReactElement => {
  const classes = useStyles({})

  return (
    <Drawer
      open={open}
      onClose={onClose}
      className={classes.width}
      classes={{
        paper: classes.width
      }}
      variant={permanent ? 'permanent' : 'temporary'}
    >
      {permanent && <Toolbar />}
      <Divider />
      <Content user={user} />
    </Drawer>
  )
}

export default MyDrawer
