'use client'
import '@root/global.scss';
import DefaultLayout from '@components/DefaultLayout';
import styles from '@styles/Download.module.scss';

export default async function Page({ params }: { params: { key: string } }) {
  const getFileInfo = async () => {
    const response = await fetch(` https://share.nirah.xyz/api/${params.key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    

    return { cid: data.Cid, name: data.FileName, size: data.FileSize };
  };

  const {cid,name,size } = await getFileInfo();

  return (
    <DefaultLayout>
      <div className={styles.infoContainer}>
        <div className={styles.file}>{name}</div>
        <div>{size} Bytes</div>

        <a className={styles.downloadButton} href={'https://gateway.estuary.tech/gw/ipfs/' + cid}>
          <div>Download</div>
        </a>
      </div>
    </DefaultLayout>
  );
}
