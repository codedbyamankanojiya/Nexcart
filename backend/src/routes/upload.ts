import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

router.post('/image', authenticateToken, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'popkart',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file!.buffer);
    });

    res.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/images', authenticateToken, upload.array('images', 5), async (req: AuthRequest, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(file =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'popkart',
            transformation: [
              { width: 800, height: 600, crop: 'limit' },
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

    const images = results.map((result: any) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    res.json({ images });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/image/:publicId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
