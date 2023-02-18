'use client';
import '@root/global.scss';
import DefaultLayout from '@components/DefaultLayout';
import React, { useState,useCallback } from 'react';
import axios from 'axios';
import styles from '@styles/Upload.module.scss';
import { useDropzone,FileWithPath } from 'react-dropzone';

export default function Page(props) {
  const [progress, setProgress] = useState(0);
  const [retreivalLink, setRetreivalLink] = useState(null);

  const [Files, setFiles] = useState([])
  const onDrop = useCallback(acceptedFiles => {
    setFiles([...Files, ...acceptedFiles])
  }, [Files])

  const { acceptedFiles, getRootProps, getInputProps, } = useDropzone({ maxFiles: 1, onDrop, });

  const removeFile = () => {
    const newFiles = [...Files]
    setFiles([])
  }


  const baseURL = 'https://gateway.estuary.tech/gw/ipfs/';


  const uploadToEstuary = async (key: string) => {
    const formData = new FormData();

    formData.append('data', Files[0]);

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

  const createLink = async (cid: string) => {
    try {
      const response = await fetch('/api/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid: cid,
        }),
      });
      const data = await response.json();
      // setRetreivalLink(baseURL + data.nanoId);
      setRetreivalLink(baseURL + cid)
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const upload = async () => {
    try {
      if (Files.length === 0) {
        console.log('No file selected');
        return;
      }
      let key = await getKey();
      let cid = await uploadToEstuary(key);
      setRetreivalLink(baseURL + cid)
      // let link = await createLink(cid);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <DefaultLayout>
      <div className={styles.background}>
        {Files.length === 0 && (
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} />
            <p>Drag and Drop a File</p>
            <em>
              (or <b>Browse</b>)
            </em>
          </div>)}
        
          
  


        {Files.length > 0 && (
          
          <div className={styles.center}>
            <div className={styles.fileCntr}>
              <div className={styles.file}>
                <div>{(Files[0] as FileWithPath).path}</div>
                </div>
              <button  className={styles.removeFile} onClick={() => removeFile()}>X</button>
            </div>
            <div className={styles.uploadButtonCntr}>
            <button className={styles.uploadButton} onClick={() => upload()}>
              Upload
            </button>
            </div>
            <div>Progress: {progress}%</div>
          </div>
        )}
      </div>

      {retreivalLink && (
        <div>
          Your file is retrivable at: <a href={retreivalLink}>{retreivalLink}</a>
        </div>
      )}
    </DefaultLayout>
  );
}
