import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = process.env.UPLOAD_DIR || './public/uploads'
fs.mkdirSync(uploadDir, { recursive: true })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  const form = formidable({ multiples: false })
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Upload failed' })
    }
    const file = files.file as formidable.File
    if (!file) return res.status(400).json({ error: 'No file' })
    const ext = path.extname(file.originalFilename || file.newFilename || 'file')
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,9)}${ext}`
    const dest = path.join(uploadDir, fileName)
    const data = fs.readFileSync(file.filepath)
    fs.writeFileSync(dest, data)
    // Return a public URL relative to site root
    const publicUrl = `/uploads/${fileName}`
    return res.json({ url: publicUrl })
  })
}
