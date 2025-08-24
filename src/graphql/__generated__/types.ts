import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AccessRequest = {
  __typename?: 'AccessRequest';
  id: Scalars['ID']['output'];
  requested_at: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Dataset = {
  __typename?: 'Dataset';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  visibility: Visibility;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDataset: Dataset;
  createThing: Thing;
  requestAccess: AccessRequest;
};


export type MutationCreateDatasetArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateThingArgs = {
  name: Scalars['String']['input'];
};


export type MutationRequestAccessArgs = {
  datasetId: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  datasets: Array<Dataset>;
  things: Array<Thing>;
};

export type Thing = {
  __typename?: 'Thing';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export enum Visibility {
  Private = 'private',
  Public = 'public',
  Shared = 'shared'
}

export type ListDatasetsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListDatasetsQuery = { __typename?: 'Query', datasets: Array<{ __typename: 'Dataset', id: string, name: string, owner: string, visibility: Visibility, created_at: string }> };

export type CreateDatasetMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateDatasetMutation = { __typename?: 'Mutation', createDataset: { __typename: 'Dataset', id: string, name: string, owner: string, visibility: Visibility, created_at: string } };

export type RequestAccessMutationVariables = Exact<{
  datasetId: Scalars['ID']['input'];
}>;


export type RequestAccessMutation = { __typename?: 'Mutation', requestAccess: { __typename: 'AccessRequest', id: string, status: string, requested_at: string } };

export type ListThingsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListThingsQuery = { __typename?: 'Query', things: Array<{ __typename: 'Thing', id: string, name: string, status: string, created_at: string }> };

export type CreateThingMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateThingMutation = { __typename?: 'Mutation', createThing: { __typename: 'Thing', id: string, name: string, status: string, created_at: string } };


export const ListDatasetsDocument = gql`
    query ListDatasets {
  datasets {
    id
    name
    owner
    visibility
    created_at
    __typename
  }
}
    `;

/**
 * __useListDatasetsQuery__
 *
 * To run a query within a React component, call `useListDatasetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListDatasetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListDatasetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListDatasetsQuery(baseOptions?: Apollo.QueryHookOptions<ListDatasetsQuery, ListDatasetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListDatasetsQuery, ListDatasetsQueryVariables>(ListDatasetsDocument, options);
      }
export function useListDatasetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListDatasetsQuery, ListDatasetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListDatasetsQuery, ListDatasetsQueryVariables>(ListDatasetsDocument, options);
        }
export function useListDatasetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListDatasetsQuery, ListDatasetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListDatasetsQuery, ListDatasetsQueryVariables>(ListDatasetsDocument, options);
        }
export type ListDatasetsQueryHookResult = ReturnType<typeof useListDatasetsQuery>;
export type ListDatasetsLazyQueryHookResult = ReturnType<typeof useListDatasetsLazyQuery>;
export type ListDatasetsSuspenseQueryHookResult = ReturnType<typeof useListDatasetsSuspenseQuery>;
export type ListDatasetsQueryResult = Apollo.QueryResult<ListDatasetsQuery, ListDatasetsQueryVariables>;
export const CreateDatasetDocument = gql`
    mutation CreateDataset($name: String!) {
  createDataset(name: $name) {
    id
    name
    owner
    visibility
    created_at
    __typename
  }
}
    `;
export type CreateDatasetMutationFn = Apollo.MutationFunction<CreateDatasetMutation, CreateDatasetMutationVariables>;

/**
 * __useCreateDatasetMutation__
 *
 * To run a mutation, you first call `useCreateDatasetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatasetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatasetMutation, { data, loading, error }] = useCreateDatasetMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateDatasetMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatasetMutation, CreateDatasetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatasetMutation, CreateDatasetMutationVariables>(CreateDatasetDocument, options);
      }
export type CreateDatasetMutationHookResult = ReturnType<typeof useCreateDatasetMutation>;
export type CreateDatasetMutationResult = Apollo.MutationResult<CreateDatasetMutation>;
export type CreateDatasetMutationOptions = Apollo.BaseMutationOptions<CreateDatasetMutation, CreateDatasetMutationVariables>;
export const RequestAccessDocument = gql`
    mutation RequestAccess($datasetId: ID!) {
  requestAccess(datasetId: $datasetId) {
    id
    status
    requested_at
    __typename
  }
}
    `;
export type RequestAccessMutationFn = Apollo.MutationFunction<RequestAccessMutation, RequestAccessMutationVariables>;

/**
 * __useRequestAccessMutation__
 *
 * To run a mutation, you first call `useRequestAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestAccessMutation, { data, loading, error }] = useRequestAccessMutation({
 *   variables: {
 *      datasetId: // value for 'datasetId'
 *   },
 * });
 */
export function useRequestAccessMutation(baseOptions?: Apollo.MutationHookOptions<RequestAccessMutation, RequestAccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestAccessMutation, RequestAccessMutationVariables>(RequestAccessDocument, options);
      }
export type RequestAccessMutationHookResult = ReturnType<typeof useRequestAccessMutation>;
export type RequestAccessMutationResult = Apollo.MutationResult<RequestAccessMutation>;
export type RequestAccessMutationOptions = Apollo.BaseMutationOptions<RequestAccessMutation, RequestAccessMutationVariables>;
export const ListThingsDocument = gql`
    query ListThings {
  things {
    id
    name
    status
    created_at
    __typename
  }
}
    `;

/**
 * __useListThingsQuery__
 *
 * To run a query within a React component, call `useListThingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListThingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListThingsQuery({
 *   variables: {
 *   },
 * });
 */
export function useListThingsQuery(baseOptions?: Apollo.QueryHookOptions<ListThingsQuery, ListThingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListThingsQuery, ListThingsQueryVariables>(ListThingsDocument, options);
      }
export function useListThingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListThingsQuery, ListThingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListThingsQuery, ListThingsQueryVariables>(ListThingsDocument, options);
        }
export function useListThingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListThingsQuery, ListThingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListThingsQuery, ListThingsQueryVariables>(ListThingsDocument, options);
        }
export type ListThingsQueryHookResult = ReturnType<typeof useListThingsQuery>;
export type ListThingsLazyQueryHookResult = ReturnType<typeof useListThingsLazyQuery>;
export type ListThingsSuspenseQueryHookResult = ReturnType<typeof useListThingsSuspenseQuery>;
export type ListThingsQueryResult = Apollo.QueryResult<ListThingsQuery, ListThingsQueryVariables>;
export const CreateThingDocument = gql`
    mutation CreateThing($name: String!) {
  createThing(name: $name) {
    id
    name
    status
    created_at
    __typename
  }
}
    `;
export type CreateThingMutationFn = Apollo.MutationFunction<CreateThingMutation, CreateThingMutationVariables>;

/**
 * __useCreateThingMutation__
 *
 * To run a mutation, you first call `useCreateThingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThingMutation, { data, loading, error }] = useCreateThingMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateThingMutation(baseOptions?: Apollo.MutationHookOptions<CreateThingMutation, CreateThingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThingMutation, CreateThingMutationVariables>(CreateThingDocument, options);
      }
export type CreateThingMutationHookResult = ReturnType<typeof useCreateThingMutation>;
export type CreateThingMutationResult = Apollo.MutationResult<CreateThingMutation>;
export type CreateThingMutationOptions = Apollo.BaseMutationOptions<CreateThingMutation, CreateThingMutationVariables>;