import { ReadStream } from 'fs'

export function validateFileFormat(filename: string, allowedFileFormats: string[]) {
  const fileParts = filename.split('.') // photo.png => ['photo', 'png']
  const extension = fileParts[fileParts.length - 1] // png

  return allowedFileFormats.includes(extension) // ['png', 'jpeg'].includes(png) => true
}

export async function validateFileSize(fileStream: ReadStream, allowedFileSizeInBytes: number) {
  return new Promise((resolve, reject) => {
    let fileSizeInBytes = 0

    fileStream
      .on('data', (chunk) => {
        fileSizeInBytes += chunk.length // while 'data' +=
      })
      .on('end', () => {
        resolve(fileSizeInBytes <= allowedFileSizeInBytes) // true
      })
      .on('error', (error) => {
        reject(error) // error
      })
  })
}
