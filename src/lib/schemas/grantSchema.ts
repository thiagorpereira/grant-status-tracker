import { z } from 'zod';

export const GrantSchema = z
  .object({
    daf_name: z.string().min(2, 'DAF Name is required'),
    designation: z.enum([
      'wherever_needed_most',
      'specific_need',
      'research_and_development',
      'infrastructure',
      'education_and_training',
      'other',
    ]),
    notes: z.string().optional(),
    modality: z.enum(['check', 'ach', 'wire']),
    amount_in_cents: z
      .number()
      .min(2, 'Amount must be greater than zero')
      .max(2_147_483_647, 'Amount exceeds the maximum allowed value'),
    Organization: z.object({
      name: z.string().min(2, 'Organization Name is required'),
      ein: z.string().min(2, 'EIN is required'),
      address: z.object({
        street1: z.string().min(1, 'Street 1 is required'),
        street2: z.string().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        zip: z.string().min(1, 'ZIP Code is required'),
      }),
    }),
  })
  .refine(
    (data) => {
      if (
        ['specific_need', 'other'].includes(data.designation) &&
        !data.notes
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Notes required when designation is specific need or other',
      path: ['notes'],
    }
  );
