import { Folder, File, Image as ImageIcon, Video, FileText, Code, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { formatFileSize, getFileType, isImageFile } from "@shared/schema";
import type { S3Object } from "@shared/schema";

interface FileGridProps {
  objects: S3Object[];
  viewMode: "grid" | "list";
  isLoading: boolean;
  onNavigate: (path: string) => void;
  onPreviewImage: (obj: S3Object) => void;
  currentPath: string;
}

export function FileGrid({
  objects,
  viewMode,
  isLoading,
  onNavigate,
  onPreviewImage,
  currentPath,
}: FileGridProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const getFileIcon = (obj: S3Object) => {
    if (obj.isFolder) {
      return <Folder className="h-8 w-8 text-primary" />;
    }

    const type = getFileType(obj.key);
    switch (type) {
      case "image":
        return <ImageIcon className="h-8 w-8 text-accent" />;
      case "video":
        return <Video className="h-8 w-8 text-purple" />;
      case "document":
        return <FileText className="h-8 w-8 text-muted-foreground" />;
      case "code":
        return <Code className="h-8 w-8 text-warning" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const handleCopyUrl = async (url: string, key: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(key);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const getDisplayName = (obj: S3Object) => {
    const name = obj.key.replace(currentPath, "");
    return name.endsWith("/") ? name.slice(0, -1) : name;
  };

  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-2"}>
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className={viewMode === "grid" ? "h-40" : "h-16"} />
        ))}
      </div>
    );
  }

  if (objects.length === 0) {
    return (
      <div className="text-center py-16">
        <Folder className="h-24 w-24 text-muted-foreground/40 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold mb-2">This folder is empty</h3>
        <p className="text-muted-foreground">
          Upload files or create folders to get started
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {objects.map((obj) => (
          <Card
            key={obj.key}
            className="group cursor-pointer hover-elevate active-elevate-2 transition-all duration-200 overflow-visible"
            onClick={() => {
              if (obj.isFolder) {
                onNavigate(obj.key);
              } else if (isImageFile(obj.key)) {
                onPreviewImage(obj);
              }
            }}
            data-testid={`card-file-${obj.key}`}
          >
            <div className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">{getFileIcon(obj)}</div>
                <p className="font-medium text-sm mb-1 truncate w-full" title={getDisplayName(obj)}>
                  {getDisplayName(obj)}
                </p>
                {!obj.isFolder && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(obj.size)}
                  </p>
                )}
              </div>

              {!obj.isFolder && obj.url && (
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(obj.url!, obj.key);
                    }}
                    data-testid={`button-copy-url-${obj.key}`}
                  >
                    {copiedUrl === obj.key ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-success" />
                        <span className="text-success">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy URL
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {objects.map((obj) => (
        <div
          key={obj.key}
          className="flex items-center gap-4 p-3 rounded-lg hover-elevate cursor-pointer"
          onClick={() => {
            if (obj.isFolder) {
              onNavigate(obj.key);
            } else if (isImageFile(obj.key)) {
              onPreviewImage(obj);
            }
          }}
          data-testid={`row-file-${obj.key}`}
        >
          <div>{getFileIcon(obj)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{getDisplayName(obj)}</p>
            {!obj.isFolder && obj.lastModified && (
              <p className="text-sm text-muted-foreground">
                {new Date(obj.lastModified).toLocaleDateString()}
              </p>
            )}
          </div>
          {!obj.isFolder && (
            <div className="text-sm text-muted-foreground">
              {formatFileSize(obj.size)}
            </div>
          )}
          {!obj.isFolder && obj.url && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl(obj.url!, obj.key);
              }}
              data-testid={`button-copy-url-${obj.key}`}
            >
              {copiedUrl === obj.key ? (
                <>
                  <Check className="h-4 w-4 mr-1 text-success" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy URL
                </>
              )}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
