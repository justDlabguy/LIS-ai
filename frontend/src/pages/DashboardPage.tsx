import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { dashboardService } from '@/services/dashboardService';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery(
    ['dashboard-stats'],
    () => dashboardService.getStats()
  );

  const { data: recentSamples, isLoading: samplesLoading } = useQuery(
    ['recent-samples'],
    () => dashboardService.getRecentSamples()
  );

  const { data: recentResults, isLoading: resultsLoading } = useQuery(
    ['recent-results'],
    () => dashboardService.getRecentResults()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your laboratory system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Skeleton className="h-8 w-20" /> : stats?.totalSamples}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Skeleton className="h-8 w-20" /> : stats?.pendingTests}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Skeleton className="h-8 w-20" /> : stats?.completedTests}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                `${stats?.successRate}%`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Samples</CardTitle>
          </CardHeader>
          <CardContent>
            {samplesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentSamples?.map((sample) => (
                  <div
                    key={sample.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="font-medium">{sample.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {sample.patientId}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(sample.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {resultsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recentResults?.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="font-medium">{result.testType}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.sample.patientName}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span
                        className={
                          result.status === 'COMPLETED'
                            ? 'text-green-600'
                            : 'text-yellow-600'
                        }
                      >
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 