import { extendTheme, ChakraProvider, Flex, withDefaultColorScheme } from '@chakra-ui/react'
import _ from 'lodash'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import { Matrix } from 'types'
import MatrixTable from '../components/MatrixTable'


const customTheme = {
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'Georgia, serif',
    mono: 'Menlo, monospace',
  },
}

const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: 'teal',
    components: ['Button'],
  }),
  { customTheme }
)

export const getStaticProps: GetStaticProps<{ initialMatrix: Matrix }> = async () => {
  const res = await fetch('http://localhost:3000/api/pricing')
  const data = await res.json()

  return {
    props: {
      initialMatrix: data,
    },
  }
}

export default function Home({ initialMatrix }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(initialMatrix, 'dataaa')

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Matrix Calculation</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Flex alignContent={'center'} justifyContent={'center'}>
        <MatrixTable initialMatrix={initialMatrix} />
      </Flex>
    </ChakraProvider>
  )
}
