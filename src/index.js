import Fastify from 'fastify'
import GQL from 'fastify-gql'
import cors from 'fastify-cors'

import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from './schema.gql'
import resolvers from './resolvers/resolvers'
import { db } from './db'

const app = Fastify()
const port = 4000 || process.env.PORT

app.register(cors, {
  origin: true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})

app.register(GQL, {
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  graphiql: 'playground',
  routes: true,
  jit: 1,
  subscription: true,
  context(request, reply) {
    return {
      db
    }
  }
})

app.listen(port, () => console.log('Server running on: http://localhost:4000/playground'))
