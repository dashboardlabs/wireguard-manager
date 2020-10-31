import React, { ReactElement } from 'react'
import { Button, Collapse, TextField, Typography } from '@material-ui/core'
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, createStyles, makeStyles, Theme, withStyles } from '@material-ui/core'
import PlusIcon from '@material-ui/icons/AddTwoTone'
import DownloadIcon from '@material-ui/icons/CloudDownloadTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import ModalContainer from '../ModalContainer'
import mutation from './mutation'
import { useMutation, gql, useQuery } from '@apollo/client'
import query from './query'
import { Key } from 'frontend/_types/keys'

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
  const classes = useStyles()
  const { data } = useQuery(query)
  const keys: Key[] = data?.keys
  console.log(data)
  const [ name, setName ] = React.useState('')
  const [ openModal, setOpenModal ] = React.useState(false)
  const [ step, setStep ] = React.useState(0)

  const [addDevice, { loading }] = useMutation(mutation, {
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
                }
              `
            })
            return [...existingKeys, newKeyRef]
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
              <StyledTableCell>
                  Device Name
              </StyledTableCell>
              <StyledTableCell align="right">
                  Delete Device Access
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys?.map(key => (
              <TableRow key={String(key?._id)}>
                <TableCell>
                  {key?.deviceName}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                    disabled
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
      <Button
        variant="contained"
        color="primary"
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
                  placeholder={'John\'s MacBook Pro'}
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
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={name.length === 0}
                  fullWidth
                  startIcon={<PlusIcon />}
                >
                  Add Device
                </Button>
              </form>
            </Collapse>
            <Collapse in={step === 1 && !loading}>
              <Typography color={'textPrimary'} variant={'h6'}>
                {'For Computers - Download VPN Configuration'}
              </Typography>
              <br />
              Please download this configuration file and import it to the WireGuard application in {name}.
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<DownloadIcon />}
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
              Image goes here.
              <br />
              <br />
              <b>NOTE:</b> this WireGuard configuration can only be used on {name} and no other devices. To connect another device, please add another device.
            </Collapse>
          </>
        }
        secondaryButtonTitle={'Close'}
        secondaryButtonOnClick={() => {
          setOpenModal(false)
        }}
      />
    </>
  )
}

export default DevicesAddModal
