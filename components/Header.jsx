// Header.js
import { useRouter } from 'next/router';
import React from 'react';
import styles from '../styles/Header.module.css';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <p className={router.pathname === "/" ? styles.activeLink : ""}>Home</p>
      </Link>
      <Link href="/print">
        <p className={router.pathname === "/print" ? styles.activeLink : ""}>Print</p>
      </Link>
      <Link href="/record">
        <p className={router.pathname === "/record" ? styles.activeLink : ""}>Record</p>
      </Link>
    </nav>
  );
}

export default Header;
