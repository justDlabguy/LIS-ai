import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDateTime } from '@/lib/utils';
import { TestResult } from '@/types/testResult';

interface ViewTestResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testResult: TestResult | null;
}

export default function ViewTestResultDialog({
  open,
  onOpenChange,
  testResult,
}: ViewTestResultDialogProps) {
  if (!testResult) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>View Test Result</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Test Result Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Sample Information</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Barcode:</span>{' '}
                  {testResult.sample.barcode}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Patient Name:</span>{' '}
                  {testResult.sample.patientName}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Patient ID:</span>{' '}
                  {testResult.sample.patientId}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium">Test Information</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Test Type:</span>{' '}
                  {testResult.testType}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge className={getStatusColor(testResult.status)}>
                    {testResult.status}
                  </Badge>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Created At:</span>{' '}
                  {formatDateTime(testResult.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Raw Data */}
          <div>
            <h3 className="font-medium mb-2">Raw Data</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <pre className="text-sm">
                {JSON.stringify(testResult.rawData, null, 2)}
              </pre>
            </ScrollArea>
          </div>

          {/* AI Analysis */}
          {testResult.aiAnalysis && (
            <div>
              <h3 className="font-medium mb-2">AI Analysis</h3>
              <ScrollArea className="h-[200px] rounded-md border p-4">
                <pre className="text-sm">
                  {JSON.stringify(testResult.aiAnalysis, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 