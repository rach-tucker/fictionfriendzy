/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      ID
      firstName
      lastName
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      ID
      firstName
      lastName
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      ID
      firstName
      lastName
      email
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;
export const onCreateStory = /* GraphQL */ `
  subscription OnCreateStory($filter: ModelSubscriptionStoryFilterInput) {
    onCreateStory(filter: $filter) {
      ID
      title
      authors
      genre
      prompt
      content
      createdAt
      lastUpdated
      isComplete
      updatedAt
    }
  }
`;
export const onUpdateStory = /* GraphQL */ `
  subscription OnUpdateStory($filter: ModelSubscriptionStoryFilterInput) {
    onUpdateStory(filter: $filter) {
      ID
      title
      authors
      genre
      prompt
      content
      createdAt
      lastUpdated
      isComplete
      updatedAt
    }
  }
`;
export const onDeleteStory = /* GraphQL */ `
  subscription OnDeleteStory($filter: ModelSubscriptionStoryFilterInput) {
    onDeleteStory(filter: $filter) {
      ID
      title
      authors
      genre
      prompt
      content
      createdAt
      lastUpdated
      isComplete
      updatedAt
    }
  }
`;
