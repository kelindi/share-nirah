import prisma from '@lib/prisma';
export default async function handler(req, res) {
    const { id } = req.query;
    
    if (req.method === 'GET') {
        const file = await prisma.file.findUnique({
            where: {
                nanoId: id,
            },
        });
        res.json(file.cid);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}