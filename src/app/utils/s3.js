import AWS from "aws-sdk";
import fs from "fs/promises";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file, fileName) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
    };
    await s3.upload(params).promise();
    return `${process.env.AWS_CLOUDFRONT}/${fileName}`;
  } catch (err) {}
};

export const getFileFromS3 = async (fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const result = await s3.getObject(params).promise();
    return result.Body;
  } catch (error) {
    return null;
  }
};
