export type ActivityType = 'grant_created' | 'manual_review' | 'status_change';
export type GrantStatus =
  | 'pending'
  | 'sent'
  | 'delivered'
  | 'deposited'
  | 'failed';
export type ModalityType = 'check' | 'ach' | 'wire';
export type DesignationType =
  | 'wherever_needed_most'
  | 'specific_need'
  | 'research_and_development'
  | 'infrastructure'
  | 'education_and_training'
  | 'other';

export type Activity = {
  activity_type: ActivityType;
  created_at: string;
  grant_id?: string;
  id?: string;
  before_status?: GrantStatus | null;
  after_status?: GrantStatus | null;
};

export type Grant = {
  amount_in_cents: number;
  created_at?: string;
  daf_name: string;
  delivered_at?: string | null;
  deposited_at?: string | null;
  designation: DesignationType;
  failed_at?: string | null;
  id?: string;
  is_reviewed?: boolean;
  modality: ModalityType;
  notes: string;
  organization_id?: string;
  sent_at?: string | null;
  status?: GrantStatus;
  updated_at?: string;
  Organization: {
    id: string;
    name: string;
    ein: string;
    address: {
      city: string;
      state: string;
      street1: string;
      street2?: string;
      zip: string;
    };
  };
  Activities?: Activity[];
};

export type ActivityRecord = {
  id: string;
  activity_type: ActivityType;
  created_at: string;
  before_status: GrantStatus | null;
  after_status: GrantStatus | null;
  Grant: {
    daf_name: string;
    amount_in_cents: number;
    Organization: {
      name: string;
      ein: string;
    };
  };
};

export type GetGrantsQuery = {
  allGrants: Grant[];
};

export type GetGrantsActivitiesRecordQuery = {
  allActivities: ActivityRecord[];
};
