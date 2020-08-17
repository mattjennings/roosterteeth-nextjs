import Flex from 'components/Flex'
import Text from 'components/Text'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import React from 'react'
import ReactPlayer from 'react-player'
import { Box } from 'theme-ui'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await fetcher(
    `${process.env.API_BASE_URL}/api/v1/watch/${ctx.query.id}/videos`
  )

  const url = data.data?.[0]?.attributes?.url ?? null

  return {
    props: {
      error: data.access === false && data.message,
      url,
    },
  }
}

export default function Watch({ url, error }) {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bg: 'black',
      }}
    >
      {error ? (
        <Flex center sx={{ width: '100%', height: '100%' }}>
          <Text color="white" fontSize={4}>
            {error}
          </Text>
        </Flex>
      ) : (
        <ReactPlayer controls url={url} pip width="100%" height="100%" />
      )}
    </Box>
  )
}
