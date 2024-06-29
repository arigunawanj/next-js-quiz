import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Handle GET request
        res.status(200).json({ message: "Hello, world!" });
    } else if (req.method === 'POST') {
        // Handle POST request
        const { name } = req.body;
        res.status(200).json({ message: `Hello, ${name}!` });
    } else {
       return 'kosong'
    }
}