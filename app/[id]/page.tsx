'use client';
import '@root/global.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@components/DefaultLayout';

export default function Page({ params }: { params: { id: string } }) {
  const [cid, setCid] = useState(null);

  useEffect(() => {
    const getCid = async () => {
      const response = await fetch(`/api/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      setCid(data);
      // let metadata = await axios.head(`http://localhost:1313/gw/ipfs/${data}`);
      let metadata = await axios.head(`http://localhost:1313/gw/ipfs/${data}`);
      console.log(metadata.headers['content-type']);

    };
    
    getCid();
  }, []);
  
  
  return <DefaultLayout>
    <div>Your file is available at: <a href={"https://gateway.estuary.tech/gw/ipfs/" + cid}>{"https://gateway.estuary.tech/gw/ipfs/" + cid}</a></div>
    <div>Native file viewing is coming soon...</div>
  </DefaultLayout>;
}
