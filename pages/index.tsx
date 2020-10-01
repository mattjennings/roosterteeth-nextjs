import EpisodeCard, { Episode } from 'components/EpisodeCard'
import { MotionGrid } from 'components/MotionComponents'
import Text from 'components/Text'
import { isBefore } from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { QueryCache, useInfiniteQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import { Box, Input } from 'theme-ui'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // const [livestreams] = await Promise.all([
  //   fetcher(`/api/livestreams`, { ctx }),
  // ])

  return {
    props: {
      title: `Home`,
    },
  }
}

export default function Home() {
  const router = useRouter()

  const episodes = []
  // const episodes = useMemo<Episode[]>(() => {
  //   if (data) {
  //     return data.flatMap(({ data }) =>
  //       data.map((info) => ({
  //         id: info.id,
  //         title: info.attributes.title,
  //         caption: info.attributes.caption,
  //         img: info.included.images[0].attributes.medium,
  //         date: new Date(info.attributes.original_air_date),
  //         publicDate: new Date(info.attributes.public_golive_at),
  //         isRTFirst:
  //           isBefore(new Date(), new Date(info.attributes.public_golive_at)) ||
  //           info.attributes.is_sponsors_only,
  //         link: info.canonical_links.self.split('/watch/')[1],
  //       }))
  //     )
  //   }
  //   return []
  // }, [data])

  return (
    <Box>
      <AnimatePresence initial={false} exitBeforeEnter>
        <Text>Todo</Text>
        {/* <MotionGrid
          columns={[1, 2, 3, 3, 4]}
          p={3}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} {...episode} />
          ))}
        </MotionGrid> */}
      </AnimatePresence>
    </Box>
  )
}
