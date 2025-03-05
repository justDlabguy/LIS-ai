import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { testResultService } from '@/services/testResultService';
import CreateTestResultDialog from '@/components/test-results/CreateTestResultDialog';
import UpdateTestResultDialog from '@/components/test-results/UpdateTestResultDialog';
import ViewTestResultDialog from '@/components/test-results/ViewTestResultDialog';
import { TestResult } from '@/types/testResult';

export default function TestResultsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  const { data: testResults, isLoading } = useQuery(['test-results'], () =>
    testResultService.getAllTestResults()
  );

  const handleUpdateClick = (result: TestResult) => {
    setSelectedResult(result);
    setUpdateDialogOpen(true);
  };

  const handleViewClick = (result: TestResult) => {
    setSelectedResult(result);
    setViewDialogOpen(true);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test Results</h2>
          <p className="text-muted-foreground">
            Manage and analyze laboratory test results
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Test Result
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Type</TableHead>
              <TableHead>Sample</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>AI Analysis</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : testResults?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No test results found
                </TableCell>
              </TableRow>
            ) : (
              testResults?.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>{result.testType}</TableCell>
                  <TableCell>{result.sample.barcode}</TableCell>
                  <TableCell>{result.sample.patientName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(result.createdAt)}</TableCell>
                  <TableCell>
                    {result.aiAnalysis ? (
                      <Badge variant="outline">Available</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">
                        Not Available
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(result)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateClick(result)}
                      >
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateTestResultDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <UpdateTestResultDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        testResult={selectedResult}
      />

      <ViewTestResultDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        testResult={selectedResult}
      />
    </div>
  );
} 