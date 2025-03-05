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
import { formatDate } from '@/lib/utils';
import { sampleService } from '@/services/sampleService';
import CreateSampleDialog from '@/components/samples/CreateSampleDialog';
import UpdateSampleDialog from '@/components/samples/UpdateSampleDialog';
import { Sample } from '@/types/sample';

export default function SamplesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  const { data: samples, isLoading } = useQuery(['samples'], () =>
    sampleService.getAllSamples()
  );

  const handleUpdateClick = (sample: Sample) => {
    setSelectedSample(sample);
    setUpdateDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Samples</h2>
          <p className="text-muted-foreground">
            Manage and track laboratory samples
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Sample
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barcode</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
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
            ) : samples?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No samples found
                </TableCell>
              </TableRow>
            ) : (
              samples?.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell>{sample.barcode}</TableCell>
                  <TableCell>{sample.patientName}</TableCell>
                  <TableCell>{sample.patientId}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sample.status)}>
                      {sample.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sample.createdBy.name}</TableCell>
                  <TableCell>{formatDate(sample.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateClick(sample)}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateSampleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <UpdateSampleDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
        sample={selectedSample}
      />
    </div>
  );
} 