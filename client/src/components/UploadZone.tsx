import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@shared/schema";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  uploads: UploadFile[];
  isUploading: boolean;
}

export function UploadZone({ onFilesSelected, uploads, isUploading }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-4 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }
        `}
        data-testid="dropzone-upload"
      >
        <input {...getInputProps()} />
        <Upload
          className={`h-16 w-16 mx-auto mb-4 transition-colors ${
            isDragActive ? "text-primary" : "text-muted-foreground"
          }`}
        />
        <h3 className="text-xl font-semibold mb-2">
          {isDragActive ? "Drop files here" : "Drop files here or click to browse"}
        </h3>
        <p className="text-muted-foreground">
          Upload any file to your current directory
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Uploading Files</h4>
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-4"
              data-testid={`upload-item-${index}`}
            >
              <div className="flex items-start gap-3 mb-2">
                <File className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{upload.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(upload.file.size)}
                  </p>
                </div>
                {upload.status === "success" && (
                  <div className="text-success text-sm font-medium">Complete</div>
                )}
                {upload.status === "error" && (
                  <div className="text-destructive text-sm font-medium">Failed</div>
                )}
              </div>
              
              {upload.status === "uploading" && (
                <Progress value={upload.progress} className="h-2" />
              )}
              
              {upload.error && (
                <p className="text-sm text-destructive mt-2">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
