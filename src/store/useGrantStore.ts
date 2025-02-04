import { ActivityRecord, Grant, GrantStatus } from '@/lib/types';
import { create } from 'zustand';

type GrantState = {
  grants: Grant[];
  setGrants: (grants: Grant[]) => void;
  dirtyGrants: Grant[];
  setDirtyGrants: (dirtyGrants: Grant[]) => void;
  filteredGrants: Grant[];
  setFilteredGrants: (grants: Grant[]) => void;
  clearGrants: () => void;
  activityRecords: ActivityRecord[];
  setActivityRecords: (activityRecords: ActivityRecord[]) => void;
  updateGrantReview: (id: string, checked: boolean) => void;
  updateGrantStatus: (id: string, value: GrantStatus) => void;
};

export const useGrantStore = create<GrantState>((set) => ({
  grants: [],
  setGrants: (data) => set({ grants: data }),
  dirtyGrants: [],
  setDirtyGrants: (data) => set({ dirtyGrants: data }),
  filteredGrants: [],
  setFilteredGrants: (data) => set({ filteredGrants: data }),
  clearGrants: () => set({ grants: [] }),
  activityRecords: [],
  setActivityRecords: (data) => set({ activityRecords: data }),
  updateGrantReview: (id, checked) =>
    set((state) => ({
      dirtyGrants: state.dirtyGrants.map((grant) =>
        grant.id === id
          ? {
              ...grant,
              is_reviewed: checked,
              Activities: [
                ...(grant.Activities ?? []),
                {
                  grant_id: grant.id,
                  activity_type: 'manual_review',
                  created_at: new Date().toISOString(),
                },
              ],
            }
          : grant
      ),
    })),
  updateGrantStatus: (id, value) =>
    set((state) => ({
      dirtyGrants: state.dirtyGrants.map((grant: Grant) =>
        grant.id === id
          ? {
              ...grant,
              status: value,
              Activities: [
                ...(grant.Activities ?? []),
                {
                  grant_id: grant.id,
                  activity_type: 'status_change',
                  created_at: new Date().toISOString(),
                  after_status: value || null,
                  before_status: grant.status || null,
                },
              ],
            }
          : grant
      ),
    })),
}));
