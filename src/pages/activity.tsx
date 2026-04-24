import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, User, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { ActivityLog } from "@shared/schema";

const actionColors: Record<string, string> = {
  create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  update: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  login: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const entityIcons: Record<string, string> = {
  school: "school",
  roster: "clipboard-list",
  student: "users",
  photo: "image",
  user: "user",
};

export default function ActivityPage() {
  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity"],
  });

  const getActionColor = (action: string) => {
    const actionType = action.toLowerCase();
    if (actionType.includes("create") || actionType.includes("add")) return actionColors.create;
    if (actionType.includes("update") || actionType.includes("edit")) return actionColors.update;
    if (actionType.includes("delete") || actionType.includes("remove")) return actionColors.delete;
    if (actionType.includes("login")) return actionColors.login;
    return "bg-muted text-muted-foreground";
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    const d = new Date(date);
    return format(d, "MMM d, yyyy h:mm a");
  };

  const formatRelative = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return formatDistanceToNow(d, { addSuffix: true });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Activity Log</h1>
        <p className="text-muted-foreground mt-1">Track all changes and actions in your academy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
            {logs && <Badge variant="secondary">{logs.length} entries</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : logs && logs.length > 0 ? (
            <ScrollArea className="h-[600px] pr-4">
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {logs.map((log, index) => (
                    <div
                      key={log.id}
                      className="relative flex gap-4 pl-12"
                      data-testid={`activity-log-${log.id}`}
                    >
                      <div className="absolute left-0 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={getActionColor(log.action)}>
                              {log.action}
                            </Badge>
                            <Badge variant="outline">{log.entityType}</Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span title={formatDate(log.createdAt)}>
                              {formatRelative(log.createdAt)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mb-1">
                          {log.details || `${log.action} on ${log.entityType}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.userEmail || "System"}
                          {log.ipAddress && ` • ${log.ipAddress}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-1">No activity yet</h3>
              <p className="text-sm text-muted-foreground">
                Actions will be logged here as you use the system
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
