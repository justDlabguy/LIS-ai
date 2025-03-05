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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { sampleService } from '@/services/sampleService';
import { Sample, SampleStatus } from '@/types/sample';

const updateSampleSchema = z.object({
  status: z.enum(['REGISTERED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']),
});

type UpdateSampleForm = z.infer<typeof updateSampleSchema>;

interface UpdateSampleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sample: Sample | null;
}

export default function UpdateSampleDialog({
  open,
  onOpenChange,
  sample,
}: UpdateSampleDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateSampleForm>({
    resolver: zodResolver(updateSampleSchema),
    defaultValues: {
      status: sample?.status || 'REGISTERED',
    },
  });

  const updateSample = useMutation(
    (data: UpdateSampleForm) =>
      sampleService.updateSampleStatus(sample?.id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['samples']);
        toast({
          title: 'Success',
          description: 'Sample status updated successfully',
        });
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update sample status',
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = (data: UpdateSampleForm) => {
    updateSample.mutate(data);
  };

  if (!sample) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Sample Status</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="REGISTERED">Registered</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
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
                disabled={updateSample.isLoading}
              >
                {updateSample.isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 