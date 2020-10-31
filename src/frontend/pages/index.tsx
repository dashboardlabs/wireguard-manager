import { NextPage } from 'next'
import React, { ReactElement } from 'react'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import DownloadIcon from '@material-ui/icons/CloudDownloadTwoTone'
import PlusIcon from '@material-ui/icons/AddTwoTone'
import DeleteIcon from '@material-ui/icons/DeleteTwoTone'
import authenticated from '../layouts/authenticated'
import Paper from '@material-ui/core/Paper'
import { withStyles, createStyles, makeStyles } from '@material-ui/styles'
import { Collapse, Container, TextField, Theme } from '@material-ui/core'
import ModalContainer from 'frontend/components/ModalContainer'

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

const Home: NextPage = (): ReactElement => {
  const classes = useStyles()
  const [ openModal, setOpenModal ] = React.useState(false)
  const [ step, setStep ] = React.useState(0)
  const [ name, setName ] = React.useState('')

  return (
    <Container>
      <Typography color={'textPrimary'} variant={'h4'}>
        {'Activate VPN Service'}
      </Typography>
      <Typography color={'textSecondary'} variant={'h6'}>
        To use this VPN service, please add your devices so as to provision them in the network.
      </Typography>
      <br />
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
            <TableRow>
              <TableCell>
                MacBook Pro
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                iPhone
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
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
      <br />
      <br />
      <Typography color={'textPrimary'} variant={'h4'}>
        {'Download VPN Client'}
      </Typography>
      This VPN service makes use of the <b><a href="https://www.wireguard.com/install">WireGuard</a></b> protocol. To connect to this VPN service, please download the official WireGuard Applications on your devices.
      <br />
      <br />
      <a href="https://www.wireguard.com/install">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<DownloadIcon />}
        >
          Download WireGuard
        </Button>
      </a>
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
                fullWidth
                startIcon={<PlusIcon />}
                onClick={() => {
                  setStep(1)
                }}
              >
                Add Device
              </Button>
            </Collapse>
            <Collapse in={step === 1}>
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
    </Container>
  )
}

export default authenticated(Home)
