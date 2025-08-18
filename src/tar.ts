import type { Readable } from 'stream'
import { text } from 'stream/consumers'
import * as tar from 'tar-stream'

export function extract(inputStream: Readable, file: string) {
  return new Promise<string>(resolve => {
    const extractStream = tar.extract()
    extractStream.on('entry', async (header, stream, next) => {
      if (header.name === file) {
        resolve(text(stream))
        stream.resume()
      } else {
        next()
      }
    })
    inputStream.pipe(extractStream)
  })
}
