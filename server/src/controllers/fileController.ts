import {Request, Response} from 'express';
import s3, { generatePresignedURL } from '../utils/s3';
import File from '../models/File';


export const uploadFile = async(req: Request, res: Response ) => {

    const bucketName = process.env.S3_BUCKET_NAME!;
    try{
        const file = req.file!;
        const user = req.user!;

        if (!file || !user) {
            res.status(400).json({
                error: 'Missing file or user info'
            })
            return;
        }

        const params = {
            Bucket: bucketName,
            Key: `${user.id}/${Date.now()} - ${file?.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            // ACL: 'public' // we will check
        }

        const uploaded = await s3.upload(params).promise();

        const savedFile = await File.create({
            name: file.originalname,
            s3Key: params.Key,
            s3Url: uploaded.Location,
            owner: user.id,
        })

        res.status(200).json({
            message: "File uploaded", file: savedFile
        })
    }catch(err){
        console.error(err)
        res.status(500).json({
            error: 'Upload Failed'
        })
    }
}

export const getUserFiles = async(req: Request, res: Response) => {
    try{
        const user = req.user!
        
        const files = await File.find({owner: user.id}).sort({createdAt: -1})

        const filesWithURLs = await Promise.all(
            files.map(async (file) => {
                if (!file.s3Key) {
                    throw new Error(`File ${file._id} is missing s3Key`);
                }
                return {
                    _id: file._id,
                    name: file.name,
                    uploadedAt: file.createdAt,
                    downloadUrl: await generatePresignedURL(file.s3Key),
                };
            })
        );
      
        res.status(200).json({
            message: 'Files fetched',
            files: filesWithURLs,
        });
    }catch(err){
        console.error(err);
        res.status(500).json({
            error: "Failed to fetch files"
        })
    }
}

export const deleteFile = async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const fileId = req.params.id;
  
      const file = await File.findById(fileId);
  
      if (!file){
        res.status(404).json({ error: 'File not found' });
        return;
      } 
      
      if (!file.owner)
        {
            res.status(400).json({error: 'File has no owner'})
            return 
        }
      if (file.owner.toString() !== user.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }
  
      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: file.s3Key!,
      };
  
      await s3.deleteObject(params).promise();
      await File.findByIdAndDelete(fileId);
  
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Delete failed' });
    }
  };
  

