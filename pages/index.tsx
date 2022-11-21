import { extendTheme, ChakraProvider, Flex, withDefaultColorScheme } from '@chakra-ui/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import React from 'react'
import { Matrix } from 'types'
import useSWR, { SWRConfig } from 'swr'
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

const fetcher = url => fetch(url).then(res => res.json())

export const getStaticProps: GetStaticProps<{ initialMatrix: Matrix, fallback: any }> = async () => {
  //const fetcher = url => fetch(url).then(res => res.json())
  //const { data } = useSWR('/api/pricing', fetcher);
  const res = await fetch('http://localhost:3000/api/pricing')
  const data = await res.json()

  /*return {
    props: {
      initialMatrix: data
    },
  }*/
  return {
    props: {
      initialMatrix: data,
      fallback: {
        '/api/pricing': data
      }
    }
  }
}

function getSavedPricing(): Matrix {
  // `data` will always be available as it's in `fallback`.
  const { data } = useSWR('/api/pricing', fetcher)
  return data
}

export default function Home({ initialMatrix, fallback, ...props }: InferGetStaticPropsType<typeof getStaticProps>) {
  // You can either fetch the pricing here and pass it to MatrixTable
  // or, you can let MatrixTable handle the fetching
  console.log(initialMatrix, 'dataaa')

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Matrix Calculation</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Flex alignContent={'center'} justifyContent={'center'}>
        <SWRConfig value={{ fallback, fetcher }}>
          <MatrixTable initialMatrix={initialMatrix} {...props} />
        </SWRConfig>
      </Flex>
    </ChakraProvider>
  )
}
