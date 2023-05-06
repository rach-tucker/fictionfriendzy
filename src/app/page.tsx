"use client"
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Prompt from './prompt/page';
import { Amplify } from 'aws-amplify';
import awsmobile from '../aws-exports';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
Amplify.configure(awsmobile);

const inter = Inter({ subsets: ['latin'] })

const Home: React.FC= () => {
  return (
    <GoogleReCaptchaProvider
    reCaptchaKey='6Le8BGIlAAAAAFMqKJh_Z3_2Oq5SSkjJZDjtXPyN'
    scriptProps={{
      async: false,
      defer: false,
      appendTo: "head",
      nonce: undefined,
    }}
    >
      <main className={styles.main}>
        <h1>Home Page</h1>
        <div className='prompt'>
          <Prompt/>
        </div>
      </main>
    </GoogleReCaptchaProvider>
    
  )
}

export default Home
