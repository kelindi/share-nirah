import prisma from '@lib/prisma';
import word from "words.json";

let createUrl = async (cid)=> {
  let nouns = word.nouns;
  let adjectives = word.adjectives;

  let randomNoun = nouns[Math.floor(Math.random() * nouns.length)].toLowerCase();
  let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)].toLowerCase();
  let randomNumber = Math.floor(Math.random() * 100);

  let key = randomAdjective + "-" + randomNoun + "-" + randomNumber.toString();

  if (await isKeyInUse(key)) {
    return key = await createUrl(cid);
  }
  return key;
}

let isKeyInUse = async (key: string) => {
  const result = await prisma.file.findUnique({
    where: {
      Key: key,
    },
  });
  if (result) {
    return true;
  } else {
    return false;
  }
}

async function deleteEstuaryKey(key: string) {
  try {
    const response = await fetch('https://api.estuary.tech/user/api-keys/'+key, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + process.env.ESTUARY_KEY,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { cid,name,size } = req.body;
      const key = await createUrl(cid);
      const result = await prisma.file.create({
        data: {
          Key: key,
          Cid: cid,
          FileName: name,
          FileSize: size,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message:  error.message });
    }
  } 
}
