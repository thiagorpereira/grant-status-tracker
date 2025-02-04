import { useGrant } from './use-grant';
import { GrantStatus } from '@/lib/constants';

export function useStatistics() {
  const { grants } = useGrant();

  const totalAmountDisbursed = grants.reduce(
    (sum, grant) => sum + grant.amount_in_cents,
    0
  );

  const totalAmountDeposited = grants.reduce((sum, grant) => {
    if (grant.status === GrantStatus.Deposited) {
      return sum + grant.amount_in_cents;
    }
    return sum;
  }, 0);

  const totalAmountPending = grants.reduce((sum, grant) => {
    if (grant.status === GrantStatus.Pending) {
      return sum + grant.amount_in_cents;
    }
    return sum;
  }, 0);

  const totalGrants = grants.length;

  const pendingReview = grants.filter((grant) => !grant.is_reviewed).length;

  const getCurrentMonthGrants = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return grants.filter((grant) => {
      const grantDate = new Date(grant.created_at);
      return (
        grantDate.getMonth() === currentMonth &&
        grantDate.getFullYear() === currentYear
      );
    });
  };

  const currentMonthGrants = getCurrentMonthGrants();
  const totalCurrentMonthGrants = currentMonthGrants.length;
  const totalCurrentMonthAmountInCents = currentMonthGrants.reduce(
    (sum, grant) => sum + grant.amount_in_cents,
    0
  );

  const currentMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date());

  const getGrantsByStatus = () => {
    const statusCount = {
      pending: 0,
      sent: 0,
      delivered: 0,
      deposited: 0,
      failed: 0,
    };

    grants.forEach((grant) => {
      if (statusCount.hasOwnProperty(grant.status as GrantStatus)) {
        statusCount[grant.status as GrantStatus] += 1;
      }
    });

    return statusCount;
  };

  const grantsByStatus = getGrantsByStatus();

  return {
    totalAmountDisbursed,
    totalAmountDeposited,
    totalAmountPending,
    totalCurrentMonthAmountInCents,
    totalGrants,
    totalCurrentMonthGrants,
    pendingReview,
    currentMonthName,
    grantsByStatus,
  };
}
