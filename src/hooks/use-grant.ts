import {
  CREATE_MANY_ACTIVITIES,
  CREATE_MANY_GRANTS,
  CREATE_MANY_ORGANIZATIONS,
  GET_GRANTS,
  GET_GRANTS_ACTIVITIES_RECORD,
  REMOVE_ACTIVITY,
  REMOVE_GRANT,
  REMOVE_ORGANIZATION,
} from '@/lib/graphql/grant';
import { formatCentsToDollars } from '@/lib/utils';
import { useGrantStore } from '@/store/useGrantStore';
import {
  ActivityRecord,
  GetGrantsActivitiesRecordQuery,
  GetGrantsQuery,
  Grant,
  GrantStatus,
} from '@/lib/types';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

export function useGrant() {
  const {
    grants,
    setGrants,
    activityRecords,
    setActivityRecords,
    updateGrantReview,
    updateGrantStatus,
    clearGrants,
    setDirtyGrants,
    dirtyGrants,
    filteredGrants,
    setFilteredGrants,
  } = useGrantStore();

  const [createManyOrganizations] = useMutation(CREATE_MANY_ORGANIZATIONS);
  const [createManyGrants] = useMutation(CREATE_MANY_GRANTS);
  const [createManyActivities] = useMutation(CREATE_MANY_ACTIVITIES);

  const [removeGrant] = useMutation(REMOVE_GRANT);
  const [removeActivity] = useMutation(REMOVE_ACTIVITY);
  const [removeOrganization] = useMutation(REMOVE_ORGANIZATION);

  const [getGrants, { loading: grantsLoading, error: grantsError }] =
    useLazyQuery<GetGrantsQuery>(GET_GRANTS);
  const [
    getGrantsActivitiesRecords,
    { loading: activitiesLoading, error: activitiesError },
  ] = useLazyQuery<GetGrantsActivitiesRecordQuery>(
    GET_GRANTS_ACTIVITIES_RECORD
  );

  const [changedRows, setChangedRows] = useState(new Set());

  const getAllGrants = async () => {
    try {
      const { data } = await getGrants();
      setGrants(data?.allGrants as Grant[]);
      setDirtyGrants(data?.allGrants as Grant[]);
      setFilteredGrants(data?.allGrants as Grant[]);
    } catch (err) {
      console.log('Error', err);
    }
  };

  const getAllGrantsActivitiesRecords = async () => {
    try {
      const { data } = await getGrantsActivitiesRecords();
      setActivityRecords(data?.allActivities as ActivityRecord[]);
    } catch (err) {
      console.log('Error', err);
    }
  };

  const createGrants = async (grants: Grant[]) => {
    const createOneGrant = !grants[0]?.created_at;

    if (createOneGrant) {
      grants[0] = {
        ...grants[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        delivered_at: null,
        deposited_at: null,
        sent_at: null,
        failed_at: null,
        is_reviewed: false,
        status: 'pending',
        Activities: [
          {
            activity_type: 'grant_created',
            created_at: new Date().toISOString(),
            after_status: null,
            before_status: null,
          },
        ],
      };
    }

    try {
      const organizations = grants.map((grant) => ({
        name: grant.Organization.name,
        ein: grant.Organization.ein,
        address: grant.Organization.address,
      }));

      const { data: createdOrganizations } = await createManyOrganizations({
        variables: { data: organizations },
      });

      const grantsWithOrganizationIds = grants.map((grant, index) => ({
        daf_name: grant.daf_name,
        organization_id: createdOrganizations.createManyOrganization[index].id,
        amount_in_cents: grant.amount_in_cents,
        modality: grant.modality,
        designation: grant.designation,
        notes: grant.notes,
        is_reviewed: grant.is_reviewed,
        status: grant.status,
        sent_at: grant.sent_at,
        delivered_at: grant.delivered_at,
        deposited_at: grant.deposited_at,
        failed_at: grant.failed_at,
        created_at: grant.created_at,
        updated_at: grant.updated_at,
      }));

      const { data: createdGrants } = await createManyGrants({
        variables: { data: grantsWithOrganizationIds },
      });

      const activities = grants.flatMap((grant, index) =>
        grant.Activities?.map((activity) => ({
          grant_id: createdGrants.createManyGrant[index].id,
          activity_type: activity.activity_type,
          created_at: activity.created_at,
          before_status: activity.before_status,
          after_status: activity.after_status,
        }))
      );

      const { data: createdActivities } = await createManyActivities({
        variables: { data: activities },
      });

      const created = createdGrants.createManyGrant.map((grant, index) => ({
        ...grant,
        Organization: createdOrganizations.createManyOrganization[index],
        Activities: createdActivities.createManyActivity.filter(
          (activity) => activity.grant_id === grant.id
        ),
      }));

      if (createOneGrant) {
        const recordCreated = {
          id: created[0].Activities[0].id,
          activity_type: created[0].Activities[0].activity_type,
          created_at: created[0].Activities[0].created_at,
          Grant: {
            id: created[0].id,
            daf_name: created[0].daf_name,
            amount_in_cents: created[0].amount_in_cents,
            Organization: {
              id: created[0].Organization.id,
              name: created[0].Organization.name,
              ein: created[0].Organization.ein,
            },
          },
        };
        setActivityRecords([
          recordCreated,
          ...activityRecords,
        ] as ActivityRecord[]);
        setDirtyGrants([...dirtyGrants, created[0]]);
        setGrants([...dirtyGrants, created[0]]);
      }

      setChangedRows(new Set());

      return created;
    } catch (error) {
      console.error('Error creating grants:', error);
      throw error;
    }
  };

  const deleteAllGrants = async () => {
    try {
      const activityIds = grants.flatMap((grant) =>
        grant.Activities?.map((activity) => activity.id)
      );
      await Promise.all(
        activityIds.map((id) =>
          removeActivity({ variables: { id } }).catch((error) => {
            console.error(`Erro ${id}:`, error);
          })
        )
      );

      const grantIds = grants.map((grant) => grant.id);
      await Promise.all(
        grantIds.map((id) =>
          removeGrant({ variables: { id } }).catch((error) => {
            console.error(`Erro ${id}:`, error);
          })
        )
      );

      const organizationIds = grants.map((grant) => grant?.Organization?.id);
      await Promise.all(
        organizationIds.map((id) =>
          removeOrganization({ variables: { id } }).catch((error) => {
            console.error(`Error: ${id}:`, error);
          })
        )
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isValueChanged = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    const originalItem = grants.find((grant) => grant.id === id);
    if (!originalItem) return false;
    return originalItem[field] !== value;
  };

  const handleSwitchReview = (id: string, checked: boolean) => {
    updateGrantReview(id, checked);

    if (isValueChanged(id, 'is_reviewed', checked)) {
      setChangedRows((prev) => new Set(prev).add(id));
    } else {
      setChangedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSelectSatus = (id: string, value: GrantStatus) => {
    updateGrantStatus(id, value);
    if (isValueChanged(id, 'status', value)) {
      setChangedRows((prev) => new Set(prev).add(id));
    } else {
      setChangedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatFeedRecords = () => {
    return [...activityRecords]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((activity) => {
        let message = null;

        if (activity.activity_type === 'grant_created') {
          message = `New grant from ${activity?.Grant?.daf_name}'s DAF for ${formatCentsToDollars(activity?.Grant?.amount_in_cents)} to ${activity.Grant?.Organization?.name} (EIN: ${activity?.Grant?.Organization?.ein}).`;
        } else if (activity.activity_type === 'manual_review') {
          message = `Manually reviewed grant from ${activity?.Grant?.daf_name}'s DAF for ${formatCentsToDollars(activity?.Grant?.amount_in_cents)} to ${activity?.Grant?.Organization?.name} (EIN: ${activity?.Grant?.Organization?.ein}).`;
        } else if (activity.activity_type === 'status_change') {
          message = `Status changed from ${activity?.before_status} to ${activity?.after_status} for grant from ${activity?.Grant?.daf_name}'s DAF for ${formatCentsToDollars(activity?.Grant?.amount_in_cents)} to ${activity?.Grant?.Organization?.name} (EIN: ${activity?.Grant?.Organization?.ein}).`;
        }

        return message
          ? {
              created_at: activity.created_at,
              activity_type: activity.activity_type,
              id: activity.id,
              message,
            }
          : null;
      })
      .filter(Boolean);
  };

  const activityFeedRecords = formatFeedRecords();

  return {
    getAllGrants,
    getAllGrantsActivitiesRecords,
    createGrants,
    deleteAllGrants,
    clearGrants,
    handleSwitchReview,
    handleSelectSatus,
    loading: grantsLoading || activitiesLoading,
    error: grantsError || activitiesError,
    grants,
    setGrants,
    activityRecords,
    setDirtyGrants,
    dirtyGrants,
    activityFeedRecords,
    changedRows,
    filteredGrants,
    setFilteredGrants,
  };
}
