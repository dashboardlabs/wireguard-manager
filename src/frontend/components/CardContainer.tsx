import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import LinearProgress from '@material-ui/core/LinearProgress'

import classnames from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing()
  },
  borderSecondary: {
    borderLeft: `${theme.spacing()}px solid ${theme.palette.secondary.main}`
  },
  borderPrimaryTop: {
    borderTop: `${theme.spacing()}px solid ${theme.palette.primary.main}`
  },
  borderSecondaryTop: {
    borderTop: `${theme.spacing()}px solid #9a0026`
  },
  content: {
    overflow: 'scroll'
  }
}))

const CardContainer = ({
  avatar,
  title,
  subheader,
  content,
  children,
  actions,
  headerAction,
  loading = false,
  borderSecondary = false,
  borderPrimaryTop = false,
  borderSecondaryTop = false
}: {
  avatar?: ReactElement
  title?: string
  subheader?: string
  content?: ReactElement
  children?: ReactElement | ReactElement[]
  actions?: ReactElement
  headerAction?: ReactElement
  loading?: boolean
  borderSecondary?: boolean
  borderPrimaryTop?: boolean
  borderSecondaryTop?: boolean
}): ReactElement => {
  const classes = useStyles({})

  return (
    <Card
      className={classnames(
        classes.root,
        borderSecondary ? classes.borderSecondary : '',
        borderPrimaryTop ? classes.borderPrimaryTop : '',
        borderSecondaryTop ? classes.borderSecondaryTop : ''
      )}
      variant={'outlined'}
      elevation={0}
    >
      <Collapse in={loading}>
        <LinearProgress />
      </Collapse>
      {(avatar || title || subheader || headerAction) && (
        <CardHeader avatar={avatar} title={title} subheader={subheader} action={headerAction} />
      )}
      {(content || children) && (
        <CardContent className={classes.content}>
          {content}
          {children}
        </CardContent>
      )}
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  )
}

export default CardContainer
