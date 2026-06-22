/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { type ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { validateFileFormat, validateFileSize } from '../utils/file.utils'

@Injectable()
export class FileValidationPipe implements PipeTransform {
  public async transform(value: any) {
    if (!value.filename) {
      throw new BadRequestException('File not upload')
    }

    const { filename, createReadStream } = value

    const fileStream = createReadStream()

    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp']
    const isFileFormatValid = validateFileFormat(filename, allowedFormats)

    if (!isFileFormatValid) {
      throw new BadRequestException('Unsupported file format')
    }

    const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)

    if (!isFileSizeValid) {
      throw new BadRequestException('File size more than 10 MB')
    }
    return value
  }
}
