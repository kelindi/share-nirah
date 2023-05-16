import prisma from '@lib/prisma';
export default async function handler(req, res) {
    const { key } = req.query;
    
    if (req.method === 'GET') {
        const file = await prisma.file.findUnique({
            where: {
                Key : key,
            },
        });
        console.log(file);
        res.json(file);
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}