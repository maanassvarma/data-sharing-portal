import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'

// Mock data for things
const mockThings = [
  {
    id: '1',
    name: 'Sample Thing 1',
    status: 'ACTIVE',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sample Thing 2',
    status: 'INACTIVE',
    created_at: '2024-01-16T14:45:00Z',
  },
  {
    id: '3',
    name: 'Sample Thing 3',
    status: 'ACTIVE',
    created_at: '2024-01-17T09:15:00Z',
  },
]

// GraphQL schema definition
const typeDefs = `
  type Thing {
    id: ID!
    name: String!
    status: ThingStatus!
    created_at: String!
  }

  enum ThingStatus {
    ACTIVE
    INACTIVE
    PENDING
  }

  type Query {
    listThings: [Thing!]!
  }

  type Mutation {
    createThing(name: String!): Thing!
  }
`

// Resolvers
const resolvers = {
  Query: {
    listThings: () => mockThings,
  },
  Mutation: {
    createThing: (_: unknown, { name }: { name: string }) => {
      const newThing = {
        id: String(mockThings.length + 1),
        name,
        status: 'ACTIVE' as const,
        created_at: new Date().toISOString(),
      }
      mockThings.push(newThing)
      return newThing
    },
  },
}

// Create executable schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

// Add mocks for any missing resolvers
export const schemaWithMocks = addMocksToSchema({
  schema,
  mocks: {
    ThingStatus: () => 'ACTIVE',
  },
}) 