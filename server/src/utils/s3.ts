import AWS from 'aws-sdk'

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || ' ';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || ' ';
const region = process.env.AWS_REGION || ' '
const bucketName = process.env.S3_BUCKET_NAME || ' '

if (!accessKeyId || !secretAccessKey || !region || !bucketName){
    throw new Error('Missing required AWS Config');
}

AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
  });
  
const s3 = new AWS.S3();

export const generatePresignedURL = async(key: string): Promise<string> => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 300 // 5mins
    }

    return s3.getSignedUrlPromise('getObject', params);
}



export default s3;