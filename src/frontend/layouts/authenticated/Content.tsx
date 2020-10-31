//eslint-disable-next-line
const globalAny: any = global

import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'

import Collapse from '@material-ui/core/Collapse'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import DownloadIcon from '@material-ui/icons/CloudDownloadTwoTone'

import Avatar from '@material-ui/core/Avatar'
import md5 from 'js-md5'

import { User } from '../../_types/users'
// import removeAccessToken from 'frontend/_utils/removeAccessToken'

const useStyles = makeStyles((theme) => ({
  avatar: {
    color: '#ffffff',
    backgroundColor: theme.palette.secondary.dark
  }
}))

const Content = ({ user }: { user: User }): ReactElement => {
  const classes = useStyles({})
  const router = useRouter()

  return (
    <List dense>
      <Collapse in={Boolean(user)}>
        <ListItem
          button
        >
          <ListItemAvatar>
            <Avatar className={classes.avatar} variant={'rounded'} src={`https://www.gravatar.com/avatar/${md5(user?.email?.toLowerCase()?.trim())}?s=128&d=404`}>
              {`${user?.name?.[0] || user?.email?.[0] || '?'}`}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user?.name} secondary={user?.email} />
        </ListItem>
      </Collapse>
      <ListItem
        button
        onClick={(): void => {
          router.push('/')
        }}
      >
        <ListItemIcon>
          <DownloadIcon />
        </ListItemIcon>
        <ListItemText primary={'Activate'} secondary={'Download and Activate VPN Service'} />
      </ListItem>
    </List>
  )
}

export default Content
