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
      setCid(data);


    };
    
    getCid();
  }, []);
  
  
  return <DefaultLayout>{cid}
  <img src={"https://gateway.estuary.tech/gw/ipfs/"+cid}></img>
  </DefaultLayout>;
}
