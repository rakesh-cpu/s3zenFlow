import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BucketSelector } from "@/components/BucketSelector";
import { FileExplorer } from "@/components/FileExplorer";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { S3Bucket, S3Object } from "@shared/schema";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export default function S3Manager() {
  const [selectedBucket, setSelectedBucket] = useState<S3Bucket | null>(null);
  const [currentPath, setCurrentPath] = useState("");
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const { toast } = useToast();

  const { data: buckets = [], isLoading: bucketsLoading } = useQuery<S3Bucket[]>({
    queryKey: ["/api/buckets"],
    enabled: !selectedBucket,
    onError: () => {
      toast({
        title: "Error loading buckets",
        description: "Failed to fetch S3 buckets. Please check your AWS credentials.",
        variant: "destructive",
      });
    },
  });

  const { data: objects = [], isLoading: objectsLoading } = useQuery<S3Object[]>({
    queryKey: ["/api/objects", selectedBucket?.name, currentPath],
    queryFn: async () => {
      const params = new URLSearchParams({
        bucket: selectedBucket?.name || "",
        ...(currentPath && { prefix: currentPath }),
      });
      const response = await fetch(`/api/objects?${params}`);
      if (!response.ok) throw new Error("Failed to fetch objects");
      return response.json();
    },
    enabled: !!selectedBucket,
    onError: () => {
      toast({
        title: "Error loading files",
        description: "Failed to fetch bucket contents. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      return apiRequest("POST", "/api/folders", {
        bucket: selectedBucket?.name,
        folderPath: currentPath + folderName + "/",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/objects"] });
      toast({
        title: "Folder created",
        description: "Your folder has been created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    },
  });

  const handleUpload = async (files: File[]) => {
    const newUploads: UploadFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploads(newUploads);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", selectedBucket?.name || "");
      formData.append("key", currentPath + file.name);

      try {
        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i ? { ...u, status: "success" as const, progress: 100 } : u
          )
        );
      } catch (error) {
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === i
              ? {
                  ...u,
                  status: "error" as const,
                  error: "Upload failed",
                }
              : u
          )
        );
      }
    }

    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/objects"] });
      setUploads([]);
      toast({
        title: "Upload complete",
        description: `${files.length} file(s) uploaded successfully`,
      });
    }, 1000);
  };

  if (!selectedBucket) {
    return (
      <BucketSelector
        buckets={buckets}
        isLoading={bucketsLoading}
        onSelectBucket={setSelectedBucket}
      />
    );
  }

  return (
    <FileExplorer
      bucketName={selectedBucket.name}
      objects={objects}
      currentPath={currentPath}
      isLoading={objectsLoading}
      onNavigate={setCurrentPath}
      onBackToBuckets={() => {
        setSelectedBucket(null);
        setCurrentPath("");
      }}
      onUpload={handleUpload}
      onCreateFolder={(name) => createFolderMutation.mutate(name)}
      uploads={uploads}
      isUploading={uploads.some((u) => u.status === "uploading")}
    />
  );
}
