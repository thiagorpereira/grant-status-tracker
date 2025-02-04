'use client';

import React, { Fragment, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Activity, Grant } from '@/lib/types';
import { GRANT_STATUS } from '@/lib/constants';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Save,
  Search,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  cn,
  formatCentsToDollars,
  formatDateAndTime,
  formatIsoDate,
} from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGrant } from '@/hooks/use-grant';
import AddGrant from '../AddGrant';
import { Input } from '@/components/ui/input';

const GrantsTable = () => {
  const {
    handleSwitchReview,
    handleSelectSatus,
    dirtyGrants,
    createGrants,
    deleteAllGrants,
    changedRows,
    setGrants,
  } = useGrant();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSaveChanges = async () => {
    try {
      await deleteAllGrants();
      await createGrants(dirtyGrants);
      setGrants(dirtyGrants);

      toast({
        title: 'Grants saved ✅',
        description: 'All changes were successfully stored',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      console.log('err', err);
    }
  };

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const STATUS_STYLE: Record<string, string> = {
    pending:
      'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
    sent: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
    delivered:
      'bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-950/60 dark:text-purple-200',
    deposited:
      'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300',
    failed:
      'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300',
  } as const;

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = searchTerm
    ? dirtyGrants.filter((item) => {
        const itemValues = Object.values(item).map((value) =>
          String(value).toLowerCase()
        );
        const organizationValues = Object.values(item.Organization).map(
          (value) => String(value).toLowerCase()
        );

        const allValues = [...itemValues, ...organizationValues];

        return allValues.some((value) =>
          value.includes(searchTerm.toLowerCase())
        );
      })
    : dirtyGrants;

  return (
    <div className="">
      <div className="rounded-xl border pt-4 pr-4 mr-2">
        <div className="flex mb-2 justify-between items-center">
          <Label className="ml-6 font-semibold text-lg">Grants</Label>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-1">
              <Search className="w-5 h-5 mr-1 text-gray-500" />
              <Input
                name="search"
                placeholder="Search"
                value={searchTerm}
                onChange={handleFilterChange}
              />
            </div>
            <AddGrant />
            <Button
              onClick={handleSaveChanges}
              className="bg-emerald-600 hover:bg-emerald-500"
              disabled={changedRows.size === 0}
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[24px]"></TableHead>
              <TableHead className="font-semibold text-foreground">
                DAF Name
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Organization
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Reviewed
              </TableHead>
              <TableHead className="w-[140px] font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Modality
              </TableHead>
              <TableHead className="w-[132px] font-semibold text-foreground">
                Designation
              </TableHead>
              <TableHead className="w-[100px] font-semibold text-foreground">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {filteredData?.map((grant: Grant) => {
              return (
                <React.Fragment key={grant.id}>
                  <TableRow
                    onClick={() => toggleRow(grant.id)}
                    className="cursor-pointer"
                    isModified={changedRows.has(grant.id) ?? false}
                  >
                    <TableCell>
                      {expandedRows.has(grant.id) ? (
                        <ChevronDown className="h-4 w-4 !outline-none" />
                      ) : (
                        <ChevronRight className="h-4 w-4 !outline-none" />
                      )}
                      <span className="sr-only">Detalhes do pedido</span>
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {grant.daf_name}
                    </TableCell>
                    <TableCell className="">
                      {formatCentsToDollars(grant?.amount_in_cents)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {grant?.Organization?.name}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={grant.is_reviewed}
                        onCheckedChange={(checked) =>
                          handleSwitchReview(grant.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={grant.status}
                        onValueChange={(value) =>
                          handleSelectSatus(grant.id, value)
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            'w-[150px] transition-colors',
                            STATUS_STYLE[grant.status]
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem
                            value="pending"
                            disabled={!grant.is_reviewed}
                            className={cn(
                              'rounded-full px-2.5 py-1 my-1',
                              STATUS_STYLE.pending
                            )}
                          >
                            Pending
                          </SelectItem>

                          <SelectItem
                            value="sent"
                            disabled={!grant.is_reviewed}
                            className={cn(
                              'rounded-full px-2.5 py-1 my-1 bg-blu',
                              STATUS_STYLE.sent
                            )}
                          >
                            Sent
                          </SelectItem>

                          <SelectItem
                            value="delivered"
                            disabled={!grant.is_reviewed}
                            className={cn(
                              'rounded-full px-2.5 py-1 my-1',
                              STATUS_STYLE.delivered
                            )}
                          >
                            Delivered
                          </SelectItem>
                          <SelectItem
                            value="deposited"
                            disabled={!grant.is_reviewed}
                            className={cn(
                              'rounded-full px-2.5 py-1 my-1',
                              STATUS_STYLE.deposited
                            )}
                          >
                            Deposited
                          </SelectItem>
                          <SelectItem
                            value="failed"
                            className={cn(
                              'rounded-full px-2.5 py-1 my-1',
                              STATUS_STYLE.failed
                            )}
                          >
                            Failed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{grant.modality}</TableCell>
                    <TableCell>{grant?.designation}</TableCell>
                    <TableCell className="font-medium">
                      {formatIsoDate(grant?.created_at)}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(grant.id) && (
                    <tr>
                      <td colSpan={9} className="p-4">
                        <div className="flex flex-col">
                          <div>
                            <Label className="font-bold mr-1">Modality:</Label>
                            <Label>{grant?.modality}</Label>
                          </div>
                          <div className="flex">
                            <Label className="font-bold mr-1">Address:</Label>
                            <Label className="flex flex-wrap gap-1">
                              <span>{grant?.Organization.address.zip}</span>
                              <span>{grant?.Organization.address.city}</span>
                              <span>{grant?.Organization.address.state}</span>
                              <span>{grant?.Organization.address.street1}</span>
                              <span>{grant?.Organization.address.street2}</span>
                            </Label>
                          </div>
                          <div>
                            <Label className="font-bold mr-1">Notes</Label>
                            <Label>{grant.notes || 'N/A'}</Label>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                          <div className="flex flex-col items-center gap-0.5 p-2 rounded">
                            <CheckCircle2 className="text-green-600" />
                            <Label className="text-xs">Created</Label>
                            <Label className="text-xs">
                              {formatDateAndTime(grant.created_at)}
                            </Label>
                          </div>
                          {grant?.Activities.map(
                            (activity: Activity) =>
                              activity.after_status && (
                                <div
                                  key={activity?.id}
                                  className="flex items-center"
                                >
                                  <div className="bg-green-500 w-20 h-0.5"></div>
                                  <div className="flex flex-col items-center gap-0.5 p-2 rounded">
                                    <CheckCircle2 className="text-green-600" />
                                    <Label className="text-xs">
                                      {GRANT_STATUS[activity.after_status]}
                                    </Label>
                                    <Label className="text-xs">
                                      {formatDateAndTime(activity.created_at)}
                                    </Label>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GrantsTable;
