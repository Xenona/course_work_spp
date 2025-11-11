export class AssetApi {
  s3: Bun.S3Client

  constructor(s3: Bun.S3Client) {
    this.s3 = s3
  }

  getRoutes() {
    return {
      '/assets/upload': async (req: Bun.BunRequest) => {
        const contentType = req.headers.get('Content-Type')
        let extension
        if (contentType == 'image/png') extension = 'png'
        else if (contentType == 'image/jpeg') extension = 'jpeg'
        else return new Response('Invalid content type', { status: 400 })

        const hasher = new Bun.CryptoHasher('sha256')
        const buf = await req.arrayBuffer()
        hasher.update(buf)

        const fileName = hasher.digest('hex') + '.' + extension

        await this.s3.write(fileName, buf)
        return Response.json({ fileName })
      },
      '/assets/get/:id': async (req: Bun.BunRequest<'/assets/get/:id'>) => {
        return new Response(this.s3.file(req.params.id))
      }
    }
  }
}
