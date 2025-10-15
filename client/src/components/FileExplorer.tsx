import { useState } from "react";
import { ChevronLeft, FolderPlus, Upload, Grid3x3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { FileGrid } from "./FileGrid";
import { UploadZone } from "./UploadZone";
import { CreateFolderModal } from "./CreateFolderModal";
import { ImagePreviewModal } from "./ImagePreviewModal";
import type { S3Object } from "@shared/schema";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface FileExplorerProps {
  bucketName: string;
  objects: S3Object[];
  currentPath: string;
  isLoading: boolean;
  onNavigate: (path: string) => void;
  onBackToBuckets: () => void;
  onUpload: (files: File[]) => void;
  onCreateFolder: (name: string) => void;
  uploads: UploadFile[];
  isUploading: boolean;
}

export function FileExplorer({
  bucketName,
  objects,
  currentPath,
  isLoading,
  onNavigate,
  onBackToBuckets,
  onUpload,
  onCreateFolder,
  uploads,
  isUploading,
}: FileExplorerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [previewImage, setPreviewImage] = useState<S3Object | null>(null);

  const breadcrumbs = currentPath
    ? currentPath.split("/").filter(Boolean)
    : [];

  const filteredObjects = objects.filter((obj) =>
    obj.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-card p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={onBackToBuckets}
                data-testid="button-back-to-buckets"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{bucketName}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="cursor-pointer hover-elevate px-2 py-1 rounded" onClick={() => onNavigate("")}>
                    Home
                  </span>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>/</span>
                      <span
                        className="cursor-pointer hover-elevate px-2 py-1 rounded"
                        onClick={() =>
                          onNavigate(
                            breadcrumbs.slice(0, index + 1).join("/") + "/"
                          )
                        }
                      >
                        {crumb}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showUploadZone ? "default" : "outline"}
                onClick={() => setShowUploadZone(!showUploadZone)}
                data-testid="button-toggle-upload"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateFolder(true)}
                data-testid="button-create-folder"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <ThemeToggle />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-files"
              />
            </div>
            
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
                data-testid="button-view-grid"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-7xl mx-auto space-y-6">
          {showUploadZone && (
            <UploadZone
              onFilesSelected={onUpload}
              uploads={uploads}
              isUploading={isUploading}
            />
          )}

          <FileGrid
            objects={filteredObjects}
            viewMode={viewMode}
            isLoading={isLoading}
            onNavigate={onNavigate}
            onPreviewImage={setPreviewImage}
            currentPath={currentPath}
          />
        </div>
      </main>

      <CreateFolderModal
        open={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onCreateFolder={onCreateFolder}
        currentPath={currentPath}
      />

      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        bucketName={bucketName}
      />
    </div>
  );
}
