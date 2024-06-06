import type { Readable } from 'stream'
import getStream from 'get-stream'
import * as tar from 'tar-stream'

export function extract(inputStream: Readable, file: string) {
  return new Promise<string>(resolve => {
    const extractStream = tar.extract()
    extractStream.on('entry', async (header, stream, next) => {
      if (header.name === file) {
        resolve(getStream(stream))
        stream.resume()
      } else {
        next()
      }
    })
    inputStream.pipe(extractStream)
  })
}
