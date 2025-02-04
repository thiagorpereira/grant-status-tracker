import { gql } from '@apollo/client';

export const GET_GRANTS_ACTIVITIES_RECORD = gql`
  query {
    allActivities {
      id
      activity_type
      created_at
      before_status
      after_status
      Grant {
        daf_name
        amount_in_cents
        Organization {
          name
          ein
        }
      }
    }
  }
`;

export const GET_GRANTS = gql`
  query {
    allGrants {
      id
      daf_name
      organization_id
      amount_in_cents
      modality
      designation
      notes
      is_reviewed
      status
      sent_at
      delivered_at
      deposited_at
      failed_at
      created_at
      updated_at
      Organization {
        id
        name
        ein
        address
      }
      Activities {
        id
        grant_id
        activity_type
        created_at
        before_status
        after_status
      }
    }
  }
`;

export const CREATE_MANY_ORGANIZATIONS = gql`
  mutation CreateManyOrganizations($data: [OrganizationInput]!) {
    createManyOrganization(data: $data) {
      id
      name
      ein
      address
    }
  }
`;

export const CREATE_MANY_GRANTS = gql`
  mutation CreateManyGrants($data: [GrantInput]!) {
    createManyGrant(data: $data) {
      id
      daf_name
      organization_id
      amount_in_cents
      modality
      designation
      notes
      is_reviewed
      status
      sent_at
      delivered_at
      deposited_at
      failed_at
      created_at
      updated_at
    }
  }
`;

export const CREATE_MANY_ACTIVITIES = gql`
  mutation CreateManyActivities($data: [ActivityInput]!) {
    createManyActivity(data: $data) {
      id
      grant_id
      activity_type
      created_at
    }
  }
`;

export const REMOVE_GRANT = gql`
  mutation RemoveGrant($id: ID!) {
    removeGrant(id: $id) {
      id
    }
  }
`;

export const REMOVE_ACTIVITY = gql`
  mutation RemoveActivity($id: ID!) {
    removeActivity(id: $id) {
      id
    }
  }
`;

export const REMOVE_ORGANIZATION = gql`
  mutation RemoveOrganization($id: ID!) {
    removeOrganization(id: $id) {
      id
    }
  }
`;
