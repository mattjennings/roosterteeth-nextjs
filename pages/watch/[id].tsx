import Flex from 'components/Flex'
import { MotionBox } from 'components/MotionComponents'
import Text from 'components/Text'
import WatchVideo from 'components/WatchVideo'
import { AnimatePresence } from 'framer-motion'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { Box } from 'theme-ui'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const [watchRes, metaRes] = await Promise.all([
    fetcher(`${process.env.API_BASE_URL}/api/v1/watch/${ctx.query.id}/videos`),
    fetcher(`${process.env.API_BASE_URL}/api/v1/watch/${ctx.query.id}`),
  ])

  const attributes = watchRes.data?.[0]?.attributes
  const url = attributes?.url ?? null

  return {
    props: {
      id: ctx.query.id,
      attributes: metaRes.data?.[0]?.attributes,
      url,
      error: watchRes.access === false && watchRes.message,
    },
  }
}

export default function Watch({ id, url, error, attributes }) {
  return <WatchVideo link={id} initialData={{ url, error, attributes }} />
}
