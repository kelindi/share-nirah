'use client';
import '@root/global.scss';
import DefaultLayout from '@components/DefaultLayout';
import React, { useState } from 'react';
import axios from 'axios';

export default function Page(props) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [retreivalLink, setRetreivalLink] = useState(null);
  const baseURL = process.env.PUBLIC_URL
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadToEstuary = async (key) => {
    const formData = new FormData();
    formData.append('data', file);

    try {
      const response = await axios.post('https://upload.estuary.tech/content/add', formData, {
        headers: {
          Authorization: 'Bearer ' + key,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      });
      console.log('https://gateway.estuary.tech/gw/ipfs/' + response.data.cid);
      return response.data.cid;
    } catch (error) {
      console.error(error);
    }
  };

  const getKey = async () => {
    try {
      const response = await fetch('/api/upload', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.log(error);
    }
  };

  const createLink = async (cid) => {
    try {
      const response = await fetch('/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: cid
        }),
      });
      const data = await response.json();
      setRetreivalLink(baseURL+ data.nanoId);
      return data
    } catch (error) {
      console.log(error);
    }
  };



  const upload = async () => {
    try {
      let key = await getKey();
      let cid = await uploadToEstuary(key);
      let link = await createLink(cid);

    } catch (error) {
      console.log(error);
    }
  };

  
  return (
    <DefaultLayout>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={() => upload()}>Upload</button>
        <div>Progress: {progress}%</div>
      </div>
      
      {retreivalLink && <div>Your file is retrivable at: <a href={retreivalLink}>{retreivalLink}</a></div>}
    </DefaultLayout>
  );
}
