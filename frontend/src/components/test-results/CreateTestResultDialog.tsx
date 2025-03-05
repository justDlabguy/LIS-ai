import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { testResultService } from '@/services/testResultService';
import { sampleService } from '@/services/sampleService';
import { TestType } from '@/types/testResult';
import { JsonEditor } from '@/components/ui/json-editor';

const createTestResultSchema = z.object({
  sampleId: z.string().min(1, 'Sample is required'),
  testType: z.enum(['BLOOD_COUNT', 'BIOCHEMISTRY', 'URINALYSIS', 'MICROBIOLOGY']),
  rawData: z.record(z.any()),
});

type CreateTestResultForm = z.infer<typeof createTestResultSchema>;

interface CreateTestResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTestResultDialog({
  open,
  onOpenChange,
}: CreateTestResultDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: samples } = useQuery(['samples'], () =>
    sampleService.getAllSamples()
  );

  const form = useForm<CreateTestResultForm>({
    resolver: zodResolver(createTestResultSchema),
    defaultValues: {
      sampleId: '',
      testType: 'BLOOD_COUNT',
      rawData: {},
    },
  });

  const createTestResult = useMutation(
    (data: CreateTestResultForm) => testResultService.createTestResult(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['test-results']);
        toast({
          title: 'Success',
          description: 'Test result created successfully',
        });
        form.reset();
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create test result',
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = (data: CreateTestResultForm) => {
    createTestResult.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Test Result</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sampleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sample" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {samples?.map((sample) => (
                        <SelectItem key={sample.id} value={sample.id}>
                          {sample.barcode} - {sample.patientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="BLOOD_COUNT">Blood Count</SelectItem>
                      <SelectItem value="BIOCHEMISTRY">Biochemistry</SelectItem>
                      <SelectItem value="URINALYSIS">Urinalysis</SelectItem>
                      <SelectItem value="MICROBIOLOGY">Microbiology</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rawData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Data</FormLabel>
                  <FormControl>
                    <JsonEditor
                      value={field.value}
                      onChange={field.onChange}
                      height="300px"
                    />
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
                disabled={createTestResult.isLoading}
              >
                {createTestResult.isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 