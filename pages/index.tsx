import EpisodeCard from 'components/EpisodeCard'
import { MotionBox, MotionGrid } from 'components/MotionComponents'
import NoSSR from 'components/NoSSR'
import ShowCard from 'components/ShowCard'
import Text from 'components/Text'
import VideoGrid from 'components/VideoGrid'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import { getUserCookie, setUserCookie } from 'lib/cookies'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import React from 'react'
import { useQuery, useQueryCache } from 'react-query'
import { Box, Button } from 'theme-ui'

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
  const cache = useQueryCache()
  const { data: incompleteVideos, isFetching } = useQuery<
    Array<RT.Episode & { slug: string }>
  >(`incomplete-videos`, async () => {
    const user = getUserCookie()

    if (user.incompleteVideos?.length) {
      return Promise.all(
        user.incompleteVideos.map((link) =>
          fetcher(`/api/watch/${link}`)
            .then((res) => ({ ...res.data?.[0], slug: link }))
            .catch((e) => null)
        )
      )
    }
    return []
  })

  // if we either have data or we're fetching it, show section
  const showingIncomplete = getUserCookie().incompleteVideos?.length > 0

  return (
    <AnimateSharedLayout>
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
                    {incompleteVideos?.map((episode) => (
                      <EpisodeCard
                        key={episode._id}
                        episode={episode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layout
                      >
                        <Box sx={{ position: `absolute`, right: 1, bottom: 1 }}>
                          <Button
                            variant="pill"
                            onClick={(e) => {
                              e.preventDefault()

                              setUserCookie((prev) => {
                                return {
                                  ...prev,
                                  incompleteVideos: prev.incompleteVideos.filter(
                                    (vid) => vid !== episode.slug
                                  ),
                                }
                              })

                              cache.setQueryData(
                                `incomplete-videos`,
                                incompleteVideos.filter(
                                  (vid) => vid.slug !== episode.slug
                                )
                              )
                            }}
                            sx={{
                              py: 1,
                              px: 3,
                              color: `gray.5`,
                              background: `none`,
                              '&:hover': {
                                color: `gray.4`,
                                background: `none`,
                              },
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </EpisodeCard>
                    ))}
                  </VideoGrid>
                </Box>
              )}
            </AnimatePresence>
          </NoSSR>
          <MotionBox mb={2} layout>
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
                <ShowCard key={show.id} show={show} />
              ))}
            </MotionGrid>
          </MotionBox>
        </Box>
      </Box>
    </AnimateSharedLayout>
  )
}
