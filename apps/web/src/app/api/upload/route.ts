import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Configure Cloudinary if cloud name exists
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured, use unsigned upload
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      return new Promise<NextResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.unsigned_upload_stream(
          'ml_default',
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              resolve(NextResponse.json({ message: 'Cloudinary upload failed: ' + (error.message || 'Unknown error') }, { status: 500 }));
            } else if (result) {
              resolve(NextResponse.json({ url: result.secure_url, message: 'File uploaded to Cloudinary successfully' }));
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Fallback: Local Upload (if Cloudinary is not configured)
    console.warn('Cloudinary not configured. Falling back to local upload.');
    
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${uniqueSuffix}-${originalName}`;
    
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/images/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl, message: 'File uploaded locally successfully' });
    
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: error.message || 'Server error during upload' }, { status: 500 });
  }
}
