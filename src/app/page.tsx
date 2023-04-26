"use client"
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Prompt from './prompt/page';
import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports';

Amplify.configure(awsmobile);

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Home Page</h1>
      <div className='prompt'>
        <Prompt/>
      </div>
    </main>
    
  )
}
