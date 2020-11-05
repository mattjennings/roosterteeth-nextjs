import EpisodeCard from 'components/EpisodeCard'
import { MotionGrid } from 'components/MotionComponents'
import ShowCard from 'components/ShowCard'
import Text from 'components/Text'
import VideoGrid from 'components/VideoGrid'
import { AnimatePresence } from 'framer-motion'
import useIsoLayoutEffect from 'hooks/useIsoLayoutEffect'
import { getUserCookie } from 'lib/cookies'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Box } from 'theme-ui'

export const getStaticProps: GetStaticProps = async (ctx) => {
  const popularShows = await fetcher(
    `/api/shows?order_by=attributes.trending_score&page=1&per_page=8`
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
  const [hasIncomplete, setHasIncomplete] = useState(false)

  useIsoLayoutEffect(() => {
    const user = getUserCookie()

    setHasIncomplete(user.incompleteVideos?.length > 0)
  }, [])

  const { data } = useQuery<RT.Episode[]>(
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
      enabled: hasIncomplete,
    }
  )

  return (
    <Box>
      <AnimatePresence initial={false} exitBeforeEnter>
        <Box p={3}>
          {hasIncomplete && (
            <Box mb={2}>
              <Text fontWeight="medium" fontSize={4} mb={1}>
                Keep Watching
              </Text>
              <VideoGrid sx={{ minHeight: 400 }}>
                {data?.map((episode, index) => (
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
