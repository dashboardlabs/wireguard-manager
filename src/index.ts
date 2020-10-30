require('dotenv').config()
import 'graphql-import-node'

import { ApolloServer, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'
import { GraphQLFormattedError, GraphQLError } from 'graphql'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import next from 'next'
import { parse } from 'url'

import { resolvers, typeDefs } from './backend/controllers'
import { Context } from './_types/context'
import { verifyJWT } from './backend/_utils/jwt'

const app = express()
app.set('trust proxy', true)
app.use(cors())
app.use(compression())

const dev = process.env.NODE_ENV !== 'production'
const nextJSApp = next({ dir: './src/frontend', dev })
const handle = nextJSApp.getRequestHandler()

const scriptSrc = [
  "'self'",
  'www.gstatic.com',
  '*.googleapis.com',
  'https://www.google-analytics.com/analytics.js',
  'https://www.googletagmanager.com/gtag/js'
]

const styleSrc = ["'self'", "'unsafe-inline'", 'www.gstatic.com', '*.googleapis.com']

if (process.env.NODE_ENV) {
  app.use(helmet())
  app.use(helmet.frameguard({ action: 'deny' }))
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'none'"],
        fontSrc: ["'self'", 'data:', 'https:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        scriptSrc,
        styleSrc
      }
    })
  )
}

nextJSApp.prepare().then(() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, connection }): Promise<Context> => {
      const headers = connection?.context?.headers || req?.headers
      const ip = req.headers['CF-Connecting-IP'] || req.headers['X-Forwarded-For'] || req.ip

      return {
        ip,
        currentUserId: verifyJWT(headers.accesstoken)?.id
      }
    },
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (
        !(
          error.originalError instanceof AuthenticationError ||
          error.originalError instanceof ForbiddenError ||
          error.originalError instanceof UserInputError
        )
      ) {
        console.error(error)
      }
      return error
    }
  })

  server.applyMiddleware({ app, path: '/graphql' })

  app.use((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  app.listen(process.env.PORT || 3000, () => {
    console.log('Server Ready')
  })
})
