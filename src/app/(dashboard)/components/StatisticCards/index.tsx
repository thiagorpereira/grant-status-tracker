import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { formatCentsToDollars } from '@/lib/utils';
import { useStatistics } from '@/hooks/use-statistics';

const StatisticCards = () => {
  const {
    totalAmountDisbursed,
    totalAmountDeposited,
    totalAmountPending,
    totalGrants,
    pendingReview,
    totalCurrentMonthAmountInCents,
    totalCurrentMonthGrants,
    currentMonthName,
  } = useStatistics();

  return (
    <div className="w-full p-4 px-8">
      <div className="flex justify-between w-full mb-4 mr-20">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-1">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCentsToDollars(totalAmountDisbursed)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total Amount Disbursed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-1">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCentsToDollars(totalAmountDeposited)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total Amount Deposited
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-1">
              Total Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCentsToDollars(totalAmountPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total Amount Pending
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{pendingReview}</div>
            <p className="text-xs text-muted-foreground">Grants To Review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-1">
              {currentMonthName} Grants
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">
              {formatCentsToDollars(totalCurrentMonthAmountInCents)}
            </p>
            <p className="text-xs text-muted-foreground">
              Total Amount Disbursed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium mr-1">
              {currentMonthName} Grants
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold">{totalCurrentMonthGrants}</p>
            <p className="text-xs text-muted-foreground">
              Current Month Grants
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{totalGrants}</div>
            <p className="text-xs text-muted-foreground">
              All Grants Registered
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticCards;
