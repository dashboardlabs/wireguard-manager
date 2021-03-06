import React, { ReactElement, useState } from 'react'
import { Button, Collapse, TextField, Typography } from '@material-ui/core'
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import PlusIcon from '@material-ui/icons/AddTwoTone'
import DownloadIcon from '@material-ui/icons/CloudDownloadTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import ModalContainer from '../ModalContainer'
import addMutation from './addMutation'
import deleteMutation from './deleteMutation'
import { useMutation, gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import query from './query'
import adminQuery from './adminQuery'
import { Key } from 'frontend/_types/keys'

import { QRCode } from 'react-qr-svg'

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    body: {
      fontSize: 14
    }
  })
)(TableCell)

const useStyles = makeStyles({
  button: {
    backgroundColor: '#d63031',
    '&:hover': {
      backgroundColor: '#ee5253'
    }
  }
})

const DevicesAddModal = (): ReactElement => {
  const router = useRouter()
  const classes = useStyles()
  const { data } = useQuery(router.asPath === '/admin' ? adminQuery : query)
  const keys: Key[] = data?.keys
  const [name, setName] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [step, setStep] = useState(0)

  const [addDevice, addDeviceStatus] = useMutation(addMutation, {
    update(cache, { data: { keys } }) {
      cache.modify({
        fields: {
          current_user_keys(existingKeys = []) {
            const newKeyRef = cache.writeFragment({
              data: keys,
              fragment: gql`
                fragment NewKey on Key {
                  _id
                  deviceName
                  info {
                    ip
                    time
                  }
                }
              `
            })
            return [...existingKeys, newKeyRef]
          }
        }
      })
    }
  })

  const [deleteDevice, deleteDeviceStatus] = useMutation(deleteMutation, {
    update(cache, { data: { keys } }) {
      cache.modify({
        fields: {
          current_user_keys(existingKeys = []) {
            const newKeyRef = cache.writeFragment({
              data: keys,
              id: cache.identify(keys),
              fragment: gql`
                fragment NewKey on Key {
                  _id
                  deviceName
                  info {
                    ip
                    time
                  }
                }
              `
            })
            return existingKeys?.filter((x: any): boolean => x?.__ref !== newKeyRef?.__ref)
          }
        }
      })
    }
  })

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Device Name</StyledTableCell>
              {router.asPath === '/admin' && (
                <StyledTableCell>Device Owner</StyledTableCell>
              )}
              <StyledTableCell>Last Connected IP Address</StyledTableCell>
              <StyledTableCell>Last Connected Time</StyledTableCell>
              <StyledTableCell align='right'>Delete Device Access</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys?.map((key) => (
              <TableRow key={String(key?._id)}>
                <TableCell>{key?.deviceName}</TableCell>
                {router.asPath === '/admin' && (
                  <StyledTableCell>{key?.user?.name} ({key?.user?.email})</StyledTableCell>
                )}
                <TableCell>{key?.info?.ip}</TableCell>
                <TableCell>{key?.info?.time === 0 ? 'Never' : new Date(key?.info?.time * 1000).toString()}</TableCell>
                <TableCell align='right'>
                  <Button
                    variant='contained'
                    color='secondary'
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    disabled={deleteDeviceStatus?.loading}
                    onClick={() => {
                      deleteDevice({
                        variables: {
                          _id: key?._id
                        }
                      })
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      {router.asPath !== '/admin' && (
        <>
          <Button
            variant='contained'
            color='primary'
            fullWidth
            startIcon={<PlusIcon />}
            onClick={() => {
              setStep(0)
              setOpenModal(true)
            }}
          >
            Add New Device
          </Button>
          <ModalContainer
            title={'Add New Device'}
            maxWidth={'sm'}
            open={openModal}
            onClose={() => {
              setOpenModal(false)
            }}
            content={
              <>
                <Collapse in={step === 0}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      addDevice({
                        variables: {
                          deviceName: name
                        }
                      })
                      setStep(1)
                    }}
                  >
                    <TextField
                      margin={'dense'}
                      fullWidth
                      variant={'outlined'}
                      label={'Device Name'}
                      type={'text'}
                      placeholder={"John's MacBook Pro"}
                      onChange={(e): void => {
                        setName(e.target.value)
                      }}
                      value={name}
                      helperText={name.length === 0 ? 'Device name is required' : null}
                      error={name.length === 0}
                    />
                    <br />
                    <br />
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={name.length === 0}
                      fullWidth
                      startIcon={<PlusIcon />}
                    >
                      Add Device
                    </Button>
                  </form>
                </Collapse>
                <Collapse in={step === 1 && !addDeviceStatus.loading}>
                  <Alert severity='warning'>
                    <AlertTitle>WARNING</AlertTitle>
                    For security reasons, this page will only be showed once.
                  </Alert>
                  <br />
                  <Alert severity='info'>
                    <AlertTitle>Note:</AlertTitle>
                    This WireGuard configuration can only be used on <b>{name}</b> and no other devices. To connect another
                    device, please add another device.
                  </Alert>
                  <br />
                  <Typography color={'textPrimary'} variant={'h6'}>
                    {'For Computers - Download VPN Configuration'}
                  </Typography>
                  <br />
                  Please download this configuration file and import it to the WireGuard application in {name}.
                  <br />
                  <pre>{addDeviceStatus?.data?.keys?.config}</pre>
                  <br />
                  <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      const element = document.createElement('a')
                      const file = new Blob([addDeviceStatus?.data?.keys?.config || ''], { type: 'text/plain' })
                      element.href = URL.createObjectURL(file)
                      element.download = 'vpn.conf'
                      document.body.appendChild(element)
                      element.click()
                    }}
                  >
                    Download WireGuard Configuration
                  </Button>
                  <br />
                  <br />
                  <Typography color={'textPrimary'} variant={'h6'}>
                    {'For Mobile Devices - Scan QR Code'}
                  </Typography>
                  <br />
                  On {name}, please use the WireGuard application to scan this QR Code.
                  <br />
                  <br />
                  <QRCode
                    bgColor='#FFFFFF'
                    fgColor='#222f3e'
                    level='Q'
                    style={{ width: 512 }}
                    value={addDeviceStatus?.data?.keys?.config || ''}
                  />
                </Collapse>
              </>
            }
            secondaryButtonTitle={'Close'}
            secondaryButtonOnClick={() => {
              setOpenModal(false)
            }}
          />
        </>
      )}
    </>
  )
}

export default DevicesAddModal
