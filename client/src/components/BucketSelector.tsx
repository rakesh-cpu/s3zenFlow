import { Search, FolderOpen, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { S3Bucket } from "@shared/schema";

interface BucketSelectorProps {
  buckets: S3Bucket[];
  isLoading: boolean;
  onSelectBucket: (bucket: S3Bucket) => void;
}

export function BucketSelector({ buckets, isLoading, onSelectBucket }: BucketSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuckets = buckets.filter((bucket) =>
    bucket.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-purple to-accent p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="mb-8">
            <Skeleton className="h-12 w-full max-w-md mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple to-accent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Select Your S3 Bucket
          </h1>
          <p className="text-xl text-white/90">
            Choose a bucket to start managing your files
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              type="search"
              placeholder="Search buckets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              data-testid="input-search-buckets"
            />
          </div>
        </div>

        {filteredBuckets.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="h-24 w-24 text-white/40 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              {searchQuery ? "No buckets found" : "No buckets available"}
            </h3>
            <p className="text-white/70">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create a bucket in your AWS console to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuckets.map((bucket) => (
              <Card
                key={bucket.name}
                className="group cursor-pointer bg-white hover-elevate active-elevate-2 transition-all duration-200 hover:-translate-y-1 overflow-visible"
                onClick={() => onSelectBucket(bucket)}
                data-testid={`card-bucket-${bucket.name}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FolderOpen className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground truncate">
                    {bucket.name}
                  </h3>

                  <div className="space-y-2">
                    {bucket.region && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{bucket.region}</span>
                      </div>
                    )}
                    {bucket.creationDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(bucket.creationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
