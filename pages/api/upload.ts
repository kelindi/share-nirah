export default async function handler(req, res) {
  if (req.method === 'GET') {
    console.log(process.env.ESTUARY_KEY)
    try {
      const response = await fetch('https://api.estuary.tech/user/api-keys?expiry=1h', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.ESTUARY_KEY,
          'Content-Type': 'application/json',
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log(data);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


  

