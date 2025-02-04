'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { useGrant } from '@/hooks/use-grant';
import { ACTIVITY_TYPE } from '@/lib/constants';

const ActivityFeed = () => {
  const { activityFeedRecords } = useGrant();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {activityFeedRecords?.map((activity) => (
          <div
            key={activity?.id}
            className="p-1 border-b border-muted-foreground/20 pt-2"
          >
            <div className="flex justify-between">
              <Label className="font-semibold">
                {ACTIVITY_TYPE[activity?.activity_type]}
              </Label>
              <Label className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity?.created_at), {
                  addSuffix: true,
                  locale: enUS, // Usa o formato americano (ex: "3 days ago")
                })}
              </Label>
            </div>
            <Label>{activity?.message}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
