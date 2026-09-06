import AWS from 'aws-sdk'
import { config } from '../config'

const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp',
  'video/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg',
])

const s3 = config.r2.accountId && config.r2.accessKeyId && config.r2.secretAccessKey
  ? new AWS.S3({
      endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey,
      signatureVersion: 'v4',
    })
  : null

export class StorageService {
  async uploadFile(file: Buffer, key: string, mimeType: string, options: { maxSize?: number; userId: string }): Promise<{ url: string; key: string; size: number }> {
    const maxSize = options.maxSize ?? 100 * 1024 * 1024
    if (file.length > maxSize) throw new Error(`File too large. Max ${maxSize} bytes`)
    if (!ALLOWED_TYPES.has(mimeType)) throw new Error(`Invalid file type: ${mimeType}`)
    if (!s3) throw new Error('R2 storage is not configured')
    if (!config.r2.publicUrl) throw new Error('R2 public URL is not configured')

    await s3.putObject({
      Bucket: config.r2.bucket,
      Key: key,
      Body: file,
      ContentType: mimeType,
      Metadata: { userId: options.userId },
    }).promise()

    return {
      url: `${config.r2.publicUrl.replace(/\/$/, '')}/${key}`,
      key,
      size: file.length,
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!s3) throw new Error('R2 storage is not configured')
    return s3.getSignedUrlPromise('getObject', { Bucket: config.r2.bucket, Key: key, Expires: expiresIn })
  }

  async deleteFile(key: string): Promise<void> {
    if (!s3) throw new Error('R2 storage is not configured')
    await s3.deleteObject({ Bucket: config.r2.bucket, Key: key }).promise()
  }
}

export const storageService = new StorageService()
