// server/presign.example.ts
import express from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const app = express()
app.use(express.json())

const s3 = new S3Client({ region: process.env.AWS_REGION })

app.post('/s3/presign', async (req, res) => {
  const { fileName, contentType } = req.body || {}
  if (!fileName || !contentType) return res.status(400).json({ error: 'fileName and contentType required' })
  const key = `collaborators/${fileName}`
  const cmd = new PutObjectCommand({ Bucket: process.env.BUCKET, Key: key, ContentType: contentType })
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 900 })
  res.json({ uploadUrl, fileKey: key, expiresAt: new Date(Date.now() + 900_000).toISOString() })
})

app.listen(4000, () => console.log('presign example on http://localhost:4000'))
