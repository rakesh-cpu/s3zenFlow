import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import {
  listBuckets,
  listObjects,
  uploadFile,
  createFolder,
} from "./s3";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/buckets", async (req, res) => {
    try {
      const buckets = await listBuckets();
      res.json(buckets);
    } catch (error) {
      console.error("Error listing buckets:", error);
      res.status(500).json({ error: "Failed to list buckets" });
    }
  });

  app.get("/api/objects", async (req, res) => {
    try {
      const { bucket, prefix } = req.query;
      
      if (!bucket || typeof bucket !== "string") {
        return res.status(400).json({ error: "Bucket name is required" });
      }

      const objects = await listObjects(
        bucket,
        typeof prefix === "string" ? prefix : ""
      );
      res.json(objects);
    } catch (error) {
      console.error("Error listing objects:", error);
      res.status(500).json({ error: "Failed to list objects" });
    }
  });


  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      const { bucket, key } = req.body;
      const file = req.file;

      if (!bucket || !key || !file) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await uploadFile(
        bucket,
        key,
        file.buffer,
        file.mimetype
      );

      res.json(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // Create folder
  app.post("/api/folders", async (req, res) => {
    try {
      const { bucket, folderPath } = req.body;

      if (!bucket || !folderPath) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await createFolder(bucket, folderPath);
      res.json(result);
    } catch (error) {
      console.error("Error creating folder:", error);
      res.status(500).json({ error: "Failed to create folder" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
