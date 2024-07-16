import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { AWS_S3 } from 'src/config-global';

// Configure AWS
const s3Client = new S3Client({
  region: AWS_S3.region as string,
  credentials: {
    accessKeyId: AWS_S3.accessKey as string,
    secretAccessKey: AWS_S3.secretKey as string,
  },
});

export async function s3ImageUploader(imageParams: any) {
  try {
    const uploadDetail = await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_S3.bucket as string,
        ...imageParams,
      })
    );

    console.log(uploadDetail);
    if (uploadDetail.$metadata.httpStatusCode === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error uploading file:', error);
    return false;
  }
}

export async function s3ImageDelete(key: string | undefined) {
  try {
    const deleteImg = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: AWS_S3.bucket as string,
        Key: key,
      })
    );

    console.log(deleteImg);
    return true;
    // if (deleteImg.$metadata.httpStatusCode == 200) {
    //   return true;
    // } else {
    //   return false;
    // }
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
