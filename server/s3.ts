import {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function listBuckets() {
  const command = new ListBucketsCommand({});
  const response = await s3Client.send(command);
  
  return (response.Buckets || []).map((bucket) => ({
    name: bucket.Name || "",
    creationDate: bucket.CreationDate?.toISOString(),
    region: process.env.AWS_REGION,
  }));
}

export async function listObjects(bucket: string, prefix: string = "") {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
    Delimiter: "/",
  });

  const response = await s3Client.send(command);
  const objects = [];

  // Add folders
  if (response.CommonPrefixes) {
    for (const prefixObj of response.CommonPrefixes) {
      objects.push({
        key: prefixObj.Prefix || "",
        isFolder: true,
      });
    }
  }

  // Add files
  if (response.Contents) {
    for (const obj of response.Contents) {
      if (obj.Key && obj.Key !== prefix) {
        const url = await getSignedUrl(
          s3Client,
          new GetObjectCommand({
            Bucket: bucket,
            Key: obj.Key,
          }),
          { expiresIn: 3600 }
        );

        objects.push({
          key: obj.Key,
          size: obj.Size,
          lastModified: obj.LastModified?.toISOString(),
          isFolder: false,
          url,
        });
      }
    }
  }

  return objects;
}

export async function uploadFile(
  bucket: string,
  key: string,
  body: Buffer,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn: 3600 }
  );

  return { key, url };
}

export async function createFolder(bucket: string, folderPath: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: folderPath,
    Body: "",
  });

  await s3Client.send(command);
  return { key: folderPath };
}

export { s3Client };
