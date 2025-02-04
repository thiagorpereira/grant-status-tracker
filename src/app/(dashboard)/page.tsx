'use client';

import React, { useEffect } from 'react';
import '../globals.css';

import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import GrantsTable from '@/app/(dashboard)/components/Table';
import { useGrant } from '@/hooks/use-grant';

import BarChartStatus from './components/BarChartStatus';
import StatisticCards from './components/StatisticCards';
import ActivityFeed from './components/ActivityFeed';

export default function Home() {
  const { getAllGrants, getAllGrantsActivitiesRecords, loading, error } =
    useGrant();

  useEffect(() => {
    getAllGrants();
    getAllGrantsActivitiesRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="space-y-4 px-4">
        <Skeleton className="h-[50px] w-full dark:bg-slate-600" />
        <Skeleton className="h-[150px] w-full dark:bg-slate-600" />
        <div className="flex space-x-4">
          <Skeleton className="h-[600px] w-[75%] pr-2 dark:bg-slate-600" />
          <div className="w-[25%] space-y-4">
            <Skeleton className="h-[300px] dark:bg-slate-600" />
            <Skeleton className="h-[400px] dark:bg-slate-600" />
          </div>
        </div>
      </div>
    );

  if (error) return <p>Error: Try Again Later</p>;

  return (
    <div className="flex flex-col pb-16">
      <header className="flex items-center justify-between border-b border-muted-foreground/20 pb-2">
        <h1 className="text-xl font-bold leading-tight tracking-tighter pl-4 mt-1">
          Grant Status Tracker
        </h1>
        <div className="pr-4 mt-1">
          <ThemeToggle />
        </div>
      </header>
      <StatisticCards />

      <div className="flex px-4">
        <div className="w-[75%] pr-2">
          <GrantsTable />
        </div>

        <div className="w-[25%] space-y-4">
          <BarChartStatus />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
