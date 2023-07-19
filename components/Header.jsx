// Header.js
import Link from 'next/link';
import React from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <nav className={styles.navbar}>
          <Link href="/">
            Home
          </Link>
          <Link href="/print">
            Print
          </Link>
          <Link href="/record">
            Record
          </Link>
    </nav>
  );
}

export default Header;
