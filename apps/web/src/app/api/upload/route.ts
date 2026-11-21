import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

    const isVideo = file.type?.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(file.name);

    // 1. Try Cloudinary Upload if credentials exist
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // A) Try Signed Upload (most reliable, avoids unsigned preset limitations)
      if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        try {
          const cloudinaryResult = await new Promise<any>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                resource_type: isVideo ? 'video' : 'auto',
                folder: isVideo ? 'products/videos' : 'products/images',
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            uploadStream.end(buffer);
          });

          if (cloudinaryResult?.secure_url) {
            return NextResponse.json({
              url: cloudinaryResult.secure_url,
              message: `${isVideo ? 'Video' : 'Image'} uploaded to Cloudinary successfully`,
            });
          }
        } catch (signedErr: any) {
          console.warn('Signed Cloudinary upload failed, trying unsigned:', signedErr?.message || signedErr);
        }
      }

      // B) Try Unsigned Upload as secondary attempt
      try {
        const cloudinaryResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.unsigned_upload_stream(
            'ml_default',
            {
              resource_type: isVideo ? 'video' : 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        if (cloudinaryResult?.secure_url) {
          return NextResponse.json({
            url: cloudinaryResult.secure_url,
            message: `${isVideo ? 'Video' : 'Image'} uploaded to Cloudinary successfully`,
          });
        }
      } catch (cloudErr: any) {
        console.warn('Unsigned Cloudinary upload failed, falling back to local storage:', cloudErr?.message || cloudErr);
      }
    }

    // 2. Fallback: Local Storage (Writes to both apps/web/public and root public)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${uniqueSuffix}-${originalName}`;
    const subfolder = isVideo ? 'videos' : 'images';

    // Locate targets
    const candidateDirs = [
      path.join(process.cwd(), 'apps', 'web', 'public', subfolder, 'uploads'),
      path.join(process.cwd(), 'public', subfolder, 'uploads'),
    ];

    for (const dir of candidateDirs) {
      try {
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, filename), buffer);
      } catch (writeErr) {
        // Ignore single target failures
      }
    }

    const publicUrl = `/${subfolder}/uploads/${filename}`;
    return NextResponse.json({
      url: publicUrl,
      message: `${isVideo ? 'Video' : 'File'} uploaded successfully`,
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: error.message || 'Server error during upload' }, { status: 500 });
  }
}
