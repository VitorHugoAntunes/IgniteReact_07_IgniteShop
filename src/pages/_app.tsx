import { globalStyles } from '@/styles/global'
import { Container, Header } from '@/styles/pages/app';
import type { AppProps } from 'next/app'
import logoSvg from '../assets/logo.svg'

globalStyles();

import Image from 'next/image'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <Image src={logoSvg} alt="" />
      </Header>
      <Component {...pageProps} />
    </Container>
  )
}
