import { put } from '@vercel/blob'

export interface StorageProvider {
  upload(
    path: string,
    data: Blob,
    options: { contentType: string; cacheMaxAge?: number }
  ): Promise<string>
}

class VercelBlobProvider implements StorageProvider {
  async upload(
    path: string,
    data: Blob,
    options: { contentType: string; cacheMaxAge?: number }
  ): Promise<string> {
    const blob = await put(path, data, {
      access: 'public',
      contentType: options.contentType,
      cacheControlMaxAge: options.cacheMaxAge ?? 31536000,
    })
    return blob.url
  }
}

// İleride kendi storage sistemine geçmek için bu provider'ı değiştirin
export const storage: StorageProvider = new VercelBlobProvider()
