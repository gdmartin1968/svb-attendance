import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@shared/schema";

interface RequireRoleProps {
  children: React.ReactNode;
  roles: string[];
  fallbackPath?: string;
}

export function RequireRole({ children, roles, fallbackPath = "/" }: RequireRoleProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  const { data: userRole, isLoading, isError } = useQuery<UserRole | null>({
    queryKey: ["/api/user/role"],
    retry: false,
    staleTime: 30000,
  });

  const hasAccess = userRole && roles.includes(userRole.role);

  useEffect(() => {
    if (!isLoading && !hasAccess && !hasShownToast.current) {
      hasShownToast.current = true;
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      setLocation(fallbackPath);
    }
  }, [hasAccess, isLoading, fallbackPath, setLocation, toast]);

  // Block rendering until we know the user's role
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Handle query errors or missing role by showing nothing and redirecting
  if (isError || !hasAccess) {
    return null;
  }

  return <>{children}</>;
}
