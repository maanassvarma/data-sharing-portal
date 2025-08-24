import { gql } from '@apollo/client'

// --- Datasets (portal-shaped) ---
export const LIST_DATASETS = gql`
  query ListDatasets {
    datasets { id name owner visibility created_at __typename }
  }
`

export const CREATE_DATASET = gql`
  mutation CreateDataset($name: String!) {
    createDataset(name: $name) { id name owner visibility created_at __typename }
  }
`

export const REQUEST_ACCESS = gql`
  mutation RequestAccess($datasetId: ID!) {
    requestAccess(datasetId: $datasetId) { id status requested_at __typename }
  }
`

// --- Back-compat with your current Admin "Things" ---
export const LIST_THINGS = gql`
  query ListThings {
    things { id name status created_at __typename }
  }
`

export const CREATE_THING = gql`
  mutation CreateThing($name: String!) {
    createThing(name: $name) { id name status created_at __typename }
  }
`
