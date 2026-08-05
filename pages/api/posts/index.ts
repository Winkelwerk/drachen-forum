import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany({
      include: { media: true },
      orderBy: { createdAt: 'desc' }
    })
    return res.json(posts)
  }

  if (req.method === 'POST') {
    const { title, content, mediaUrl } = req.body
    const post = await prisma.post.create({
      data: {
        title,
        content,
        media: mediaUrl ? { create: { url: mediaUrl } } : undefined
      },
      include: { media: true }
    })
    return res.status(201).json(post)
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end('Method Not Allowed')
}
