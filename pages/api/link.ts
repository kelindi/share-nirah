
import prisma from '@lib/prisma';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      //add unique cid to db. If the cid already exists, return the existing id.
      const { cid } = req.body;
      const existing = await prisma.file.findUnique({
        where: {
          cid: cid,
        },
      });
      if (existing) {
        res.status(200).json(existing);
        return;
      }
      let nanoId = nanoid(5);
      const newLink = await prisma.file.create({
        data: {
          nanoId: nanoId,
          cid: cid,
        },
      });
      res.status(200).json(newLink);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


  

