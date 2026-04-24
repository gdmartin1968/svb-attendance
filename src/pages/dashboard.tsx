import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ClipboardList, School, Activity } from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  activeRosters: number;
  totalSchools: number;
  recentActivity: number;
}

const statCards = [
  { key: "totalStudents", label: "Total Students", icon: Users, color: "text-blue-600 dark:text-blue-400" },
  { key: "activeRosters", label: "Active Rosters", icon: ClipboardList, color: "text-green-600 dark:text-green-400" },
  { key: "totalSchools", label: "Schools", icon: School, color: "text-purple-600 dark:text-purple-400" },
  { key: "recentActivity", label: "Activity Logs", icon: Activity, color: "text-orange-600 dark:text-orange-400" },
] as const;

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your tennis academy operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.key} data-testid={`card-stat-${stat.key}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <div className="text-3xl font-semibold" data-testid={`text-${stat.key}`}>
                  {stats?.[stat.key] ?? 0}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="/students"
                className="flex items-center gap-3 p-4 rounded-md bg-muted/50 hover-elevate transition-colors"
                data-testid="link-add-student"
              >
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Manage Students</p>
                  <p className="text-xs text-muted-foreground">Add or edit student profiles</p>
                </div>
              </a>
              <a
                href="/rosters"
                className="flex items-center gap-3 p-4 rounded-md bg-muted/50 hover-elevate transition-colors"
                data-testid="link-manage-rosters"
              >
                <ClipboardList className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Manage Rosters</p>
                  <p className="text-xs text-muted-foreground">Create and organize rosters</p>
                </div>
              </a>
              <a
                href="/schools"
                className="flex items-center gap-3 p-4 rounded-md bg-muted/50 hover-elevate transition-colors"
                data-testid="link-manage-schools"
              >
                <School className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Manage Schools</p>
                  <p className="text-xs text-muted-foreground">Add locations and schools</p>
                </div>
              </a>
              <a
                href="/photos"
                className="flex items-center gap-3 p-4 rounded-md bg-muted/50 hover-elevate transition-colors"
                data-testid="link-upload-photos"
              >
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">View Activity</p>
                  <p className="text-xs text-muted-foreground">Check recent changes</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Add a School</p>
                  <p className="text-xs text-muted-foreground">Create your first school or location</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Create a Roster</p>
                  <p className="text-xs text-muted-foreground">Set up seasonal rosters for each school</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Add Students</p>
                  <p className="text-xs text-muted-foreground">Register students and assign to rosters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium text-sm">Upload Photos</p>
                  <p className="text-xs text-muted-foreground">Add student photos for easy identification</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
