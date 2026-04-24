import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Image, Upload, X, Search, Camera } from "lucide-react";
import type { Student, School } from "@shared/schema";

export default function PhotosPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: students, isLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const { data: schools } = useQuery<School[]>({
    queryKey: ["/api/schools"],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ studentId, file }: { studentId: string; file: File }) => {
      const formData = new FormData();
      formData.append("photo", file);
      const response = await fetch(`/api/students/${studentId}/photo`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({ title: "Photo uploaded successfully" });
      setIsUploadOpen(false);
      setSelectedStudent(null);
    },
    onError: () => {
      toast({ title: "Failed to upload photo", variant: "destructive" });
    },
    onSettled: () => {
      setUploading(false);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStudent) {
      setUploading(true);
      uploadMutation.mutate({ studentId: selectedStudent.id, file });
    }
  };

  const openUploadDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsUploadOpen(true);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSchoolName = (schoolId: string) => {
    return schools?.find((s) => s.id === schoolId)?.shortCode || "—";
  };

  const filteredStudents = students?.filter((student) => {
    const matchesSearch = `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSchool = schoolFilter === "all" || student.schoolId === schoolFilter;
    return matchesSearch && matchesSchool;
  });

  const studentsWithPhotos = filteredStudents?.filter((s) => s.photoUrl) || [];
  const studentsWithoutPhotos = filteredStudents?.filter((s) => !s.photoUrl) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Photos</h1>
          <p className="text-muted-foreground mt-1">Manage student photos and profile images</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-photos"
          />
        </div>
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-school-filter">
            <SelectValue placeholder="All Schools" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schools</SelectItem>
            {schools?.map((school) => (
              <SelectItem key={school.id} value={school.id}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-600" />
              With Photos
              <span className="text-muted-foreground font-normal">({studentsWithPhotos.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : studentsWithPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {studentsWithPhotos.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => openUploadDialog(student)}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted hover-elevate transition-all"
                    data-testid={`photo-student-${student.id}`}
                  >
                    <img
                      src={student.photoUrl || ""}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs font-medium truncate">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-white/70 text-xs">{getSchoolName(student.schoolId)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No photos uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Image className="h-5 w-5 text-muted-foreground" />
              Missing Photos
              <span className="text-muted-foreground font-normal">({studentsWithoutPhotos.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : studentsWithoutPhotos.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {studentsWithoutPhotos.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/50"
                    data-testid={`missing-photo-${student.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted-foreground/10">
                          {getInitials(student.firstName, student.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{getSchoolName(student.schoolId)}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUploadDialog(student)}
                      data-testid={`button-upload-photo-${student.id}`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="h-10 w-10 mx-auto text-green-600/50 mb-3" />
                <p className="text-sm text-muted-foreground">All students have photos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Photo</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedStudent.photoUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedStudent.firstName, selectedStudent.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {schools?.find((s) => s.id === selectedStudent.schoolId)?.name}
                  </p>
                </div>
              </div>

              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-photo-file"
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">
                  {uploading ? "Uploading..." : "Click to upload"}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
