import { X, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatFileSize } from "@shared/schema";
import type { S3Object } from "@shared/schema";

interface ImagePreviewModalProps {
  image: S3Object | null;
  onClose: () => void;
  bucketName: string;
}

export function ImagePreviewModal({ image, onClose, bucketName }: ImagePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    if (!image?.url) return;
    await navigator.clipboard.writeText(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!image) return null;

  const fileName = image.key.split("/").pop() || image.key;

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0" data-testid="modal-image-preview">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClose}
            data-testid="button-close-preview"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="bg-muted/20 p-8">
            <img
              src={image.url}
              alt={fileName}
              className="w-full h-auto max-h-[60vh] object-contain mx-auto rounded-lg"
              data-testid="img-preview"
            />
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{fileName}</h3>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(image.size)} • {bucketName}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">File URL</label>
              <div className="flex gap-2">
                <Input
                  value={image.url || ""}
                  readOnly
                  className="font-mono text-sm"
                  data-testid="input-image-url"
                />
                <Button
                  onClick={handleCopyUrl}
                  className="flex-shrink-0"
                  data-testid="button-copy-image-url"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
