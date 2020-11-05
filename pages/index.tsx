import EpisodeCard from 'components/EpisodeCard'
import { MotionBox, MotionGrid } from 'components/MotionComponents'
import NoSSR from 'components/NoSSR'
import ShowCard from 'components/ShowCard'
import Text from 'components/Text'
import VideoGrid from 'components/VideoGrid'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import useIsoLayoutEffect from 'hooks/useIsoLayoutEffect'
import { getUserCookie } from 'lib/cookies'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Box } from 'theme-ui'

export const getStaticProps: GetStaticProps = async () => {
  const popularShows = await fetcher(
    `${process.env.API_BASE_URL}/shows?order_by=attributes.trending_score&page=1&per_page=8`
  )

  return {
    props: {
      title: `Home`,
      popularShows,
    },
    revalidate: 60 * 60, // regenerate every hour
  }
}

export default function Home({
  popularShows,
}: {
  popularShows: RT.SearchResponse<RT.Show>
}) {
  const { data: incompleteVideos, isFetching } = useQuery<RT.Episode[]>(
    `incomplete-videos`,
    async () => {
      const user = getUserCookie()
      return Promise.all(
        user.incompleteVideos.map((link) =>
          fetcher(`/api/watch/${link}`)
            .then((res) => res.data?.[0])
            .catch((e) => null)
        )
      )
    },
    {
      enabled: getUserCookie().incompleteVideos?.length > 0,
    }
  )

  // if we either have data or we're fetching it, show section
  const showingIncomplete = incompleteVideos?.length || isFetching

  return (
    <Box>
      <Box p={3}>
        <NoSSR>
          <AnimatePresence initial={false} exitBeforeEnter>
            {showingIncomplete && (
              <Box mb={2}>
                <Text fontWeight="medium" fontSize={4} mb={1}>
                  Keep Watching
                </Text>
                <VideoGrid sx={{ minHeight: 400 }}>
                  {incompleteVideos?.map((episode, index) => (
                    <EpisodeCard
                      key={index}
                      episode={episode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ))}
                </VideoGrid>
              </Box>
            )}
          </AnimatePresence>
        </NoSSR>
        <MotionBox mb={2}>
          <Text fontWeight="medium" fontSize={4} mb={1}>
            Popular Series
          </Text>
          <MotionGrid
            columns={[1, 2, 3, 3, 4]}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            {popularShows.data.map((show) => (
              <ShowCard key={show.id} show={show} sx={{ height: 300 }} />
            ))}
          </MotionGrid>
        </MotionBox>
      </Box>
    </Box>
  )
}
