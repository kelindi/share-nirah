'use client';
import '@root/global.scss';
import DefaultLayout from '@components/DefaultLayout';
import React, { useState,useCallback } from 'react';
import axios from 'axios';
import styles from '@styles/Upload.module.scss';
import { useDropzone, FileWithPath } from 'react-dropzone';

export default function Page(props) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState(null);
  const [Files, setFiles] = useState([])
  const [fileName, setFileName] = useState(null)
  const [fileSize , setFileSize] = useState(null)
  
  const onDrop = useCallback(acceptedFiles => {
    setFiles([...Files, ...acceptedFiles])
    setFileName(acceptedFiles[0].name)
    setFileSize(acceptedFiles[0].size)
  }, [Files])

  const { getRootProps, getInputProps, } = useDropzone({ maxFiles: 1, onDrop, });

  const removeFile = () => {
    setFiles([])
  }

  const baseURL = 'https://share.nirah.xyz/';
  // const baseURL = 'http://localhost:3005/';

  const getUploadKey = async () => {
    try {
      const response = await fetch('/api/uploadkey', {
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

  const uploadToEstuary = async (uploadKey: string) => {
    const formData = new FormData();

    formData.append('data', Files[0]);

    try {
      const response = await axios.post('https://upload.estuary.tech/content/add', formData, {
        headers: {
          Authorization: 'Bearer ' + uploadKey,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          if (progress === 100) {
            setStage(3)
          }
        },
      });
      console.log('https://gateway.estuary.tech/gw/ipfs/' + response.data.cid);
      return response.data.cid;
    } catch (error) {
      console.error(error);
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
          name: fileName,
          size: fileSize,
        }),
      });
      const data = await response.json();
      console.log(data.Key)
      setKey(data.Key);
      setStage(4);
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
      setStage(1)
      let uploadKey = await getUploadKey();
      setStage(2);
      let cid = await uploadToEstuary(uploadKey);
      console.log(cid)
      setStage(3);
      let link = await createLink(cid);
      if (!link) {
        setStage(-1);
      }
        return;
      console.log(link)
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
        
        {(Files.length > 0) && (
          
          <div className={styles.center}>
            <div className={styles.fileCntr}>
              <div className={styles.file}>
                {(Files[0] as FileWithPath).path}
              </div>
              {(stage === 0 || stage === -1) && (
                <button className={styles.removeFile} onClick={() => removeFile()}>X</button>
                )}
            </div>
            {(stage === 0|| stage === -1) && (
            <div className={styles.uploadButtonCntr}>
            <button className={styles.uploadButton} onClick={() => upload()}>
              Upload
                </button>
              </div>
            )}
          
            {stage === 1 && (
              <div>Creating key...</div>
            )}
            {stage === 2 && (
              <div className={styles.progress}>
              <div
                style={{
                  backgroundColor: '#E2FCFC',
                  height: '100%',
                  width: `${progress}%`,
                  transition: 'width 0.1s linear',
                  fontSize: 20,
                }}
                />
                {progress < 100 && (
                  <div>
                  <div className={styles.progressTxt}>{progress}%</div>
                    <div className={styles.progressTxt}> Uploading...</div>
                    </div>
                )
                }
                {progress === 100 && (
                  <div className={styles.progressTxt}><div className={styles.shimmer}>Pinning...</div>
                  </div>)
                }

              
            </div>
            )}
            {stage === 3 && (
              <div>Creating link...</div>
            )}
            {stage === 4 && (
              <div className={styles.keyContainer}>
                <div className={styles.retrieve}>
                  <a href={baseURL+key}>{key}</a>
                </div>
                <div className={styles.copy} onClick={()=>navigator.clipboard.writeText(baseURL+key)} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" height="48" viewBox="0 96 960 960" width="48"><path d="M180 975q-24 0-42-18t-18-42V312h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42V235q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440V235H300v560Zm0 0V235v560Z"/></svg>
                </div>
              </div>
            )}
            
            {stage === -1 && (
              <div>Something went wrong. Please try again later.</div>
            )
            }
          </div>
        )}
      </div>
    
    </DefaultLayout>
  );
}
