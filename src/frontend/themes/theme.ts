import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import red from '@material-ui/core/colors/red'

export default createMuiTheme({
  palette: {
    primary: { main: '#d22a33' },
    secondary: { main: '#002365' },
    error: red
  }
})
