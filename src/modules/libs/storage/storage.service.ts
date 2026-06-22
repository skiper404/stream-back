import { Injectable } from '@nestjs/common'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
  private readonly client: S3Client
  private readonly bucket: string

  public constructor(private configService: ConfigService) {
    this.client = new S3Client({
      endpoint: configService.getOrThrow('S3_ENDPOINT'),
      region: 'auto',
      credentials: {
        accessKeyId: configService.getOrThrow('S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY')
      }
    })

    this.bucket = this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
  }

  public async upload(buffer: Buffer, key: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: String(key),
      Body: buffer,
      ContentType: mimetype
    })

    try {
      await this.client.send(command)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async remove(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: String(key)
    })

    try {
      await this.client.send(command)
    } catch (error) {
      console.log(error)
    }
  }
}
