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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { testResultService } from '@/services/testResultService';
import { TestResult } from '@/types/testResult';
import { JsonEditor } from '@/components/ui/json-editor';

const updateTestResultSchema = z.object({
  rawData: z.record(z.any()),
});

type UpdateTestResultForm = z.infer<typeof updateTestResultSchema>;

interface UpdateTestResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testResult: TestResult | null;
}

export default function UpdateTestResultDialog({
  open,
  onOpenChange,
  testResult,
}: UpdateTestResultDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateTestResultForm>({
    resolver: zodResolver(updateTestResultSchema),
    defaultValues: {
      rawData: testResult?.rawData || {},
    },
  });

  const updateTestResult = useMutation(
    (data: UpdateTestResultForm) =>
      testResultService.updateTestResult(testResult?.id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['test-results']);
        toast({
          title: 'Success',
          description: 'Test result updated successfully',
        });
        onOpenChange(false);
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update test result',
          variant: 'destructive',
        });
      },
    }
  );

  const requestAnalysis = useMutation(
    () => testResultService.requestAIAnalysis(testResult?.id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['test-results']);
        toast({
          title: 'Success',
          description: 'AI analysis requested successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to request AI analysis',
          variant: 'destructive',
        });
      },
    }
  );

  const onSubmit = (data: UpdateTestResultForm) => {
    updateTestResult.mutate(data);
  };

  if (!testResult) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Test Result</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Sample</p>
                <p className="text-sm text-muted-foreground">
                  {testResult.sample.barcode} - {testResult.sample.patientName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Test Type</p>
                <p className="text-sm text-muted-foreground">
                  {testResult.testType}
                </p>
              </div>
            </div>

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
                type="button"
                variant="secondary"
                onClick={() => requestAnalysis.mutate()}
                disabled={requestAnalysis.isLoading}
              >
                {requestAnalysis.isLoading ? 'Requesting...' : 'Request AI Analysis'}
              </Button>
              <Button
                type="submit"
                disabled={updateTestResult.isLoading}
              >
                {updateTestResult.isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 