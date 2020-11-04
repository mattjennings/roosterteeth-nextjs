import EpisodeCard from 'components/EpisodeCard'
import { MotionGrid } from 'components/MotionComponents'
import ShowCard from 'components/ShowCard'
import Text from 'components/Text'
import VideoGrid from 'components/VideoGrid'
import { AnimatePresence } from 'framer-motion'
import { getUserCookie } from 'lib/cookies'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import React from 'react'
import { Box } from 'theme-ui'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = getUserCookie(ctx)

  const [popularShows, unfinishedVideos] = await Promise.all([
    fetcher(`/api/shows?order_by=attributes.trending_score&page=1&per_page=8`, {
      ctx,
    }),
    user.unfinishedVideos?.length > 0
      ? Promise.all(
          user.unfinishedVideos.map((link) =>
            fetcher(`/api/watch/${link}`, { ctx }).then((res) => res.data?.[0])
          )
        )
      : Promise.resolve([]),
  ])

  // console.log(unfinishedVideos)
  return {
    props: {
      title: `Home`,
      popularShows,
      unfinishedVideos,
    },
  }
}

export default function Home({
  popularShows,
  unfinishedVideos,
}: {
  popularShows: RT.SearchResponse<RT.Show>
  unfinishedVideos: RT.Episode[]
}) {
  return (
    <Box>
      <AnimatePresence initial={false} exitBeforeEnter>
        <Box p={3}>
          {unfinishedVideos?.length > 0 && (
            <Box mb={2}>
              <Text fontWeight="medium" fontSize={4} mb={1}>
                Keep Watching
              </Text>
              <VideoGrid>
                {unfinishedVideos.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} />
                ))}
              </VideoGrid>
            </Box>
          )}
          <Box mb={2}>
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
          </Box>
        </Box>
      </AnimatePresence>
    </Box>
  )
}
