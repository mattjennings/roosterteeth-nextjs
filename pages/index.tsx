import { format, isBefore } from 'date-fns'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { useMemo, useState } from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import { Box, Grid, Image } from 'theme-ui'
import Flex from '../components/Flex'
import Text from '../components/Text'
import Link from 'next/link'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { AnimatePresence } from 'framer-motion'
import { MotionFlex } from 'components/MotionComponents'
import { getHostUrl } from 'lib/config'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await fetcher(
    `${getHostUrl(
      ctx
    )}/api/episodes?per_page=30&channel_id=achievement-hunter&page=1`
  )

  return {
    props: {
      initialData: data,
    },
  }
}

const getPage = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData?.data?.length) {
    return null
  }
  return `/api/episodes?per_page=30&channel_id=achievement-hunter&page=${
    pageIndex + 1
  }`
}

export default function Home({ initialData }) {
  const [loading, setLoading] = useState(false)
  const { data, size, setSize } = useSWRInfinite(getPage, fetcher, {
    initialSize: 1,
    initialData: [initialData],
  })

  const episodes = useMemo(() => {
    if (data) {
      setLoading(false)
      return data.flatMap(({ data }) =>
        data.map((info) => ({
          id: info.id,
          title: info.attributes.title,
          caption: info.attributes.caption,
          img: info.included.images[0].attributes.medium,
          publicDate: new Date(info.attributes.public_golive_at),
          isRTFirst:
            isBefore(new Date(), new Date(info.attributes.public_golive_at)) ||
            info.attributes.is_sponsors_only,
          link: `/watch/${info.canonical_links.self.split('/watch/')[1]}`,
        }))
      )
    }

    return []
  }, [data])

  useInfiniteScroll({
    enabled: !loading,
    onLoadMore: () => {
      setLoading(true)
      setSize(size + 1)
    },
    scrollPercentage: 0.75,
  })

  return (
    <Box>
      <Grid columns={[1, 2, 3, 3, 4]} p={2}>
        <AnimatePresence initial={false}>
          {episodes.map((episode) => (
            <Link key={episode.id} href={episode.link} passHref>
              <MotionFlex
                direction="column"
                sx={{
                  borderRadius: 'lg',
                  bg: 'gray.2',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box
                  sx={{
                    overflow: 'hidden',
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={episode.img}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      filter: episode.isRTFirst ? 'brightness(30%)' : undefined,
                    }}
                  />
                  {episode.isRTFirst && (
                    <Flex
                      center
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Text fontWeight="bold" color="white" fontSize={3}>
                        RT FIRST
                      </Text>
                    </Flex>
                  )}
                </Box>
                <Flex
                  p={2}
                  direction="column"
                  justify="space-between"
                  sx={{ flexGrow: 1 }}
                >
                  <Box>
                    <Text fontSize={2} fontWeight="semibold">
                      {episode.title}
                    </Text>
                    <Text fontSize={0}>{episode.caption}</Text>
                  </Box>
                  <Text fontSize={0} mt={2} color="textMuted">
                    {format(episode.publicDate, 'MMM dd / yy')}
                  </Text>
                </Flex>
              </MotionFlex>
            </Link>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  )
}
