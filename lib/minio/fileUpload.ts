import { Client } from "minio";
import { getServerSession } from "next-auth";

// MinIO 클라이언트 설정
export const minioClient = new Client({
  endPoint: "your-minio-server", // 예: 'localhost' 또는 내부 IP
  port: 9000,
  useSSL: false,
  accessKey: "your-access-key",
  secretKey: "your-secret-key",
});

// 버킷 생성 함수
export async function createBucket(bucketName: string) {
  const bucketExists = await minioClient.bucketExists(bucketName);
  if (!bucketExists) {
    await minioClient.makeBucket(bucketName, "us-east-1");
  }
  return bucketExists;
}

// 파일 업로드 함수
export async function uploadFile(
  bucketName: string,
  objectName: string,
  file: Buffer | string,
  metadata?: Record<string, string>,
) {
  await minioClient.putObject(bucketName, objectName, file, metadata);
  return `${process.env.MINIO_ENDPOINT}/${bucketName}/${objectName}`;
}

// 파일 조회 함수
export async function getFileUrl(bucketName: string, objectName: string) {
  try {
    // 임시 URL 생성 (24시간 유효)
    const url = await minioClient.presignedGetObject(
      bucketName,
      objectName,
      24 * 60 * 60,
    );
    return url;
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw error;
  }
}

// 파일 목록 조회
export async function listFiles(bucketName: string, prefix?: string) {
  const objects: string[] = [];
  const stream = minioClient.listObjects(bucketName, prefix, true);

  return new Promise((resolve, reject) => {
    stream.on("data", (obj) => {
      if (obj.name) objects.push(obj.name);
    });
    stream.on("end", () => resolve(objects));
    stream.on("error", reject);
  });
}
