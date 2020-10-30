import React, { ReactElement, KeyboardEvent } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  textInput: {
    marginRight: theme.spacing()
  }
}))

const Search = ({
  searchText,
  setSearchText,
  onBlur,
  helperText,
  onKeyDown,
  onSearch,
  searchButtonDisabled
}: {
  searchText: string
  setSearchText: (string: string) => void
  onBlur?: VoidFunction
  helperText?: string
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  onSearch?: () => void
  searchButtonDisabled?: boolean
}): ReactElement => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <TextField
        fullWidth
        className={classes.textInput}
        variant={'outlined'}
        placeholder={'Search'}
        value={searchText}
        size={'small'}
        helperText={helperText}
        onChange={(e): void => {
          setSearchText(e.target.value)
        }}
        onKeyDown={onKeyDown}
        InputProps={{
          onBlur: onBlur ? onBlur : null,
          onKeyDown: (e): void => {
            if (onBlur && e.keyCode === 13) {
              onBlur()
            }
          },
          startAdornment: (
            <InputAdornment position={'start'}>
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position={'end'}>
              <IconButton
                edge={'end'}
                onClick={(): void => {
                  setSearchText('')
                }}
              >
                <CancelIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      {onSearch && (
        <Button color={'primary'} variant={'contained'} onClick={onSearch} disabled={searchButtonDisabled}>
          {'SUBMIT'}
        </Button>
      )}
    </div>
  )
}

export default Search
