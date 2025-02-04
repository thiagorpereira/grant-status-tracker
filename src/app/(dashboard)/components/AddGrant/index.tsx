'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGrant } from '@/hooks/use-grant';
import { toast } from '@/hooks/use-toast';
import { GrantSchema } from '@/lib/schemas/grantSchema';
import { DesignationType, Grant, ModalityType } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type GrantForm = z.infer<typeof GrantSchema>;

const AddGrant = () => {
  const { createGrants } = useGrant();

  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GrantForm>({
    resolver: zodResolver(GrantSchema),
    mode: 'onBlur',
  });

  async function onSubmit(data: GrantForm) {
    try {
      await createGrants([data as Grant]);
      toast({
        title: 'Created with success ✅',
        description: 'Grant created with success',
      });
      setOpenDialog(false);
    } catch (error: unknown) {
      console.log('Error =>', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      setOpenDialog(false);
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Grant
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Add Grant</DialogTitle>
          <DialogDescription className="font-light text-gray-600">
            Create a new grant in the system
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daf_name">DAF Name</Label>
              <Input id="daf_name" type="text" {...register('daf_name')} />
              {errors.daf_name && (
                <Label className="text-red-500 text-xs">
                  {errors.daf_name.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" type="text" {...register('notes')} />
              {errors.notes && (
                <Label className="text-red-500 text-xs">
                  {errors.notes.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select
                {...register('designation')}
                onValueChange={(value) =>
                  setValue('designation', value as DesignationType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wherever_needed_most">
                    Wherever Needed Most
                  </SelectItem>
                  <SelectItem value="specific_need">Specific Need</SelectItem>
                  <SelectItem value="research_and_development">
                    Research and Development
                  </SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="education_and_training">
                    Education and Training
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.designation && (
                <Label className="text-red-500 text-xs">
                  {errors.designation.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modality">Modality</Label>
              <Select
                {...register('modality')}
                onValueChange={(value) =>
                  setValue('modality', value as ModalityType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Modality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="ach">ACH</SelectItem>
                  <SelectItem value="wire">Wire</SelectItem>
                </SelectContent>
              </Select>
              {errors.modality && (
                <Label className="text-red-500 text-xs">
                  {errors.modality.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount_in_cents">Amount (cents)</Label>
              <Input
                id="amount_in_cents"
                type="number"
                {...register('amount_in_cents', { valueAsNumber: true })}
              />
              {errors.amount_in_cents && (
                <Label className="text-red-500 text-xs">
                  {errors.amount_in_cents.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization Name</Label>
              <Input
                id="organization_name"
                type="text"
                {...register('Organization.name')}
              />
              {errors.Organization?.name && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.name.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization_ein">Organization EIN</Label>
              <Input
                id="organization_ein"
                type="text"
                {...register('Organization.ein')}
              />
              {errors.Organization?.ein && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.ein.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street1">Street 1</Label>
              <Input
                id="street1"
                type="text"
                {...register('Organization.address.street1')}
              />
              {errors.Organization?.address?.street1 && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.address?.street1.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street2">Street 2</Label>
              <Input
                id="street2"
                type="text"
                {...register('Organization.address.street2')}
              />
              {errors.Organization?.address?.street2 && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.address?.street2.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                {...register('Organization.address.city')}
              />
              {errors.Organization?.address?.city && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.address?.city.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                {...register('Organization.address.state')}
              />
              {errors.Organization?.address?.state && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.address?.state.message}
                </Label>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                type="text"
                {...register('Organization.address.zip')}
              />
              {errors.Organization?.address?.zip && (
                <Label className="text-red-500 text-xs">
                  {errors.Organization?.address?.zip.message}
                </Label>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGrant;
