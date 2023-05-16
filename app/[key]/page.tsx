'use client';
import '@root/global.scss';
import { useState, useEffect } from 'react';
import DefaultLayout from '@components/DefaultLayout';

export default function Page({ params }: { params: { key: string } }) {
  const baseURL = 'https://gateway.estuary.tech/gw/ipfs/';
  const [cid, setCid] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    const getCid = async () => {
      const response = await fetch(`/api/${params.key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      setCid(data.Cid);
      setFileName(data.FileName);
      setFileSize(data.FileSize);

      
     

    };
    
    getCid();
  }, []);
  
  
  return <DefaultLayout>
    <div>File Name: {fileName}</div>
    <div>File Size: {fileSize} Bytes</div>
    <div>Your file is available at: <a href={"https://gateway.estuary.tech/gw/ipfs/" + cid}>{"https://gateway.estuary.tech/gw/ipfs/" + cid}</a></div>
    <div>Native file viewing is coming soon...</div>

  </DefaultLayout>;
}
