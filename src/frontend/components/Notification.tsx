//eslint-disable-next-line
const globalAny: any = global

import React, { ReactElement, useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { Color } from '@material-ui/lab/Alert'

const Notification = (): ReactElement => {
  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState('')

  const [type, setType] = useState<Color>('info')

  globalAny.setNotification = (type: Color, message: string): void => {
    setOpen(true)
    setMessage(message)
    setType(type)
  }

  return (
    <Snackbar
      id={'notification'}
      open={open}
      onClose={(): void => {
        setOpen(false)
        setMessage('')
        setType('info')
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
    >
      <MuiAlert elevation={6} variant={'filled'} severity={type}>
        {message}
      </MuiAlert>
    </Snackbar>
  )
}

export default Notification
