import { gql } from '@apollo/client'

export const LIST_THINGS = gql`
  query ListThings {
    listThings {
      id
      name
      status
      created_at
    }
  }
`

export const CREATE_THING = gql`
  mutation CreateThing($name: String!) {
    createThing(name: $name) {
      id
      name
      status
      created_at
    }
  }
` 