import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ClipboardList, Users } from "lucide-react";
import type { Roster, School } from "@shared/schema";

const rosterFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  schoolId: z.string().min(1, "School is required"),
  season: z.enum(["spring", "summer", "fall", "winter"]),
  year: z.coerce.number().min(2000).max(2100),
});

type RosterFormData = z.infer<typeof rosterFormSchema>;

const seasonLabels: Record<string, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
};

const seasonColors: Record<string, string> = {
  spring: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  summer: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  fall: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  winter: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export default function RostersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState<Roster | null>(null);
  const { toast } = useToast();

  const { data: rosters, isLoading } = useQuery<Roster[]>({
    queryKey: ["/api/rosters"],
  });

  const { data: schools } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  const currentYear = new Date().getFullYear();

  const form = useForm<RosterFormData>({
    resolver: zodResolver(rosterFormSchema),
    defaultValues: {
      name: "",
      schoolId: "",
      season: "spring",
      year: currentYear,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: RosterFormData) => apiRequest("POST", "/api/rosters", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rosters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Roster created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to create roster", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RosterFormData }) =>
      apiRequest("PATCH", `/api/rosters/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rosters"] });
      toast({ title: "Roster updated successfully" });
      setIsDialogOpen(false);
      setEditingRoster(null);
      form.reset();
    },
    onError: () => {
      toast({ title: "Failed to update roster", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/rosters/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rosters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Roster deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete roster", variant: "destructive" });
    },
  });

  const openEditDialog = (roster: Roster) => {
    setEditingRoster(roster);
    form.reset({
      name: roster.name,
      schoolId: roster.schoolId,
      season: roster.season,
      year: roster.year,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingRoster(null);
    form.reset({
      name: "",
      schoolId: schools?.[0]?.id || "",
      season: "spring",
      year: currentYear,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: RosterFormData) => {
    if (editingRoster) {
      updateMutation.mutate({ id: editingRoster.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getSchoolName = (schoolId: string) => {
    return schools?.find((s) => s.id === schoolId)?.name || "Unknown";
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Rosters</h1>
          <p className="text-muted-foreground mt-1">Manage seasonal rosters for your schools</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} disabled={!schools?.length} data-testid="button-add-roster">
              <Plus className="h-4 w-4 mr-2" />
              Add Roster
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRoster ? "Edit Roster" : "Add New Roster"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ambassadors" {...field} data-testid="input-roster-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-roster-school">
                            <SelectValue placeholder="Select a school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools?.map((school) => (
                            <SelectItem key={school.id} value={school.id}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-roster-season">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="spring">Spring</SelectItem>
                            <SelectItem value="summer">Summer</SelectItem>
                            <SelectItem value="fall">Fall</SelectItem>
                            <SelectItem value="winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year *</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} data-testid="input-roster-year" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-roster"
                  >
                    {editingRoster ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            All Rosters
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : rosters && rosters.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Season</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rosters.map((roster) => (
                  <TableRow key={roster.id} data-testid={`row-roster-${roster.id}`}>
                    <TableCell className="font-medium">{roster.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {getSchoolName(roster.schoolId)}
                    </TableCell>
                    <TableCell>
                      <Badge className={seasonColors[roster.season]}>
                        {seasonLabels[roster.season]}
                      </Badge>
                    </TableCell>
                    <TableCell>{roster.year}</TableCell>
                    <TableCell>
                      <Badge variant={roster.isActive ? "default" : "secondary"}>
                        {roster.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(roster)}
                          data-testid={`button-edit-roster-${roster.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(roster.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-roster-${roster.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium mb-1">No rosters yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {schools?.length ? "Create your first roster" : "Add a school first to create rosters"}
              </p>
              {schools?.length ? (
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Roster
                </Button>
              ) : (
                <Button asChild>
                  <a href="/schools">
                    <Plus className="h-4 w-4 mr-2" />
                    Add School
                  </a>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
