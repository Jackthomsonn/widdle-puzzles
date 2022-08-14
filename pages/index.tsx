import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [riddle, setRiddle] = useState(null);
  const { register, handleSubmit } = useForm();
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [submitting, setIsSubmitting] = useState(false);

  const maxAttempts = 5;
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    const { correct } = await fetch('/api/checkAnswer', {
      body: JSON.stringify({
        answer: data.answer,
      }),
      method: 'POST'
    }).then(res => res.json());

    !correct && setAttempts(attempts + 1);

    setResult(correct);
    setIsSubmitting(false);
  }

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/riddle').then(res => res.json()).then(data => {
      setRiddle(data.riddle)
      setIsLoading(false);
    })
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Widdle Puzzles</title>
        <meta name="description" content="Widdle puzzles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {loading && <Image src={'/oval.svg'} alt="Loading..." width={40} height={40} />}
        {
        !result && !loading && (
          <>
            <p style={{color: '#373F51', fontSize: 18, fontWeight: '900'}}>Attempts: {attempts}/{maxAttempts}</p>
            <h1 className={styles.title}>
              { riddle }
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} style={{display: 'flex', flexDirection: 'column'}}>
              <input {...register("answer")} placeholder='Your guess' type="text" style={{border: 'none', padding: 12, color: '#373f51', fontSize: '1.2rem', fontWeight: '700', borderRadius: 4, background: '#F1F1F1', outline: 'none', marginTop: 24}} />

              <div style={{marginTop: 24, padding: 24, height: 40, background: '#FFE66D', borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                { submitting && <Image src={'/oval.svg'} alt="Submitting..." width={40} height={30} /> }
                { !submitting && <input style={{color: '#373F51', background: 'none', fontSize: '1.2rem', fontWeight: '700', border: 'none', cursor: 'pointer'}} type="submit" value={"I'm feeling lucky"} /> }
              </div>
            </form>
            {
              result === null && <p style={{padding: 12}}>a</p>
            }
            {
            result !== null && <p style={{color: result ? '#2FBF71' : '#EF2D56', fontWeight: '900', textAlign: 'center', padding: 12, borderRadius: 4}}>{
              result
              ? `Well done! You got todays riddle in ${attempts + 1} ${attempts + 1 > 1 ? 'attempts' : 'attempt'}`
              : `Incorrect! You have ${maxAttempts - attempts} attempts left`}
              </p>
            }
          </>
        )
        }
        {
          result && <p style={{color: result ? '#2FBF71' : '#EF2D56', fontWeight: '900', textAlign: 'center', padding: 12, borderRadius: 4}}>
            {`Well done! You got todays riddle in ${attempts + 1} ${attempts + 1 > 1 ? 'attempts' : 'attempt'}`}
          </p>
        }
      </main>
    </div>
  )
}

export default Home
