import { globalStyles } from '@/styles/global'
import { Container, Header } from '@/styles/pages/app';
import type { AppProps } from 'next/app'
import logoSvg from '../assets/logo.svg'

globalStyles();

import Image from 'next/image'
import Link from 'next/link';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Link href="/">
          <Image src={logoSvg} alt="" />
        </Link>
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}
