import { Inter } from 'next/font/google'
import styles from '../page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Signup() {
  return (
    <main className={styles.main}>
      <h1>Sign Up Page</h1>
    </main>
  )
}