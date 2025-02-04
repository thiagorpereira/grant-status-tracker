export const GRANT_STATUS: Record<string, string> = {
  pending: 'Pending',
  sent: 'Sent',
  delivered: 'Delivered',
  deposited: 'Deposited',
  failed: 'Failed',
};

export const ACTIVITY_TYPE: Record<string, string> = {
  grant_created: 'Grant Created',
  manual_review: 'Manual Review',
  status_change: 'Status Change',
};

export enum GrantStatus {
  Pending = 'pending',
  Sent = 'sent',
  Delivered = 'delivered',
  Deposited = 'deposited',
  Failed = 'failed',
}
