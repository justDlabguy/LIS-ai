import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { sampleService } from '@/services/sampleService';

const createSampleSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientId: z.string().min(1, 'Patient ID is required'),
  barcode: z.string().min(1, 'Barcode is required'),
});

type CreateSampleForm = z.infer<typeof createSampleSchema>;

interface CreateSampleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSampleDialog({
  open,
  onOpenChange,
}: CreateSampleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateSampleForm>({
    resolver: zodResolver(createSampleSchema),
    defaultValues: {
      patientName: '',
      patientId: '',
      barcode: '',
    },
  });

  const createSample = useMutation(
    (data: CreateSampleForm) => sampleService.createSample(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['samples']);
        toast({
          title: 'Success',
          description: 'Sample created successfully',
        });
        form.reset();
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create sample',
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = (data: CreateSampleForm) => {
    createSample.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sample</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter barcode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createSample.isLoading}
              >
                {createSample.isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 