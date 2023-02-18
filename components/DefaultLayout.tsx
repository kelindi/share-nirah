import styles from '@components/DefaultLayout.module.scss';

import * as React from 'react';
export default function App(props) {
  return <div className={styles.body}>
    <nav className={styles.nav}>
      <a href="/" >
        <img className={styles.logo} src="/logo.svg" alt="Nirah" />
      </a>
    </nav>
    <div className={styles.children}>
    {props.children}
    </div>
    
  </div>;
}
