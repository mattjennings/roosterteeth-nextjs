import clsx from 'clsx'
import EpisodeCard from 'components/EpisodeCard'
import NoSSR from 'components/NoSSR'
import ShowCard from 'components/ShowCard'
import Skeleton from 'components/Skeleton'
import VideoGrid from 'components/VideoGrid'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { getUserCookie, setUserCookie } from 'lib/cookies'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import React from 'react'
import { useQuery, useQueryCache } from 'react-query'

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
  const numIncompleteVideos = getUserCookie().incompleteVideos?.length

  return (
    <AnimateSharedLayout>
      <div>
        <div className="p-3">
          <NoSSR>
            <AnimatePresence initial={false} exitBeforeEnter>
              {numIncompleteVideos > 0 && (
                <div className="mb-2">
                  <SectionHeader>Keep Watching</SectionHeader>
                  <VideoGrid>
                    {isFetching && !incompleteVideos?.length
                      ? new Array(numIncompleteVideos)
                          .fill(null)
                          .map((_, i) => (
                            <Skeleton
                              key={i}
                              className="h-[65vw] sm:h-[40vw] md:h-[30vw] lg:h-[23vw] xl:h-[18vw]"
                            />
                          ))
                      : incompleteVideos?.map((episode) => (
                          <EpisodeCard
                            key={episode._id}
                            episode={episode}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            layout
                            showDescription={false}
                          >
                            <div className="absolute right-1 bottom-1">
                              <button
                                className={clsx(
                                  `bg-none py-1 px-3  focus rounded-full font-medium`,
                                  `text-gray-800 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300`
                                )}
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
                              >
                                Remove
                              </button>
                            </div>
                          </EpisodeCard>
                        ))}
                  </VideoGrid>
                </div>
              )}
            </AnimatePresence>
          </NoSSR>
          <motion.div className="mb-2" layout>
            <SectionHeader>Popular Series</SectionHeader>
            <motion.div
              className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              {popularShows.data.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimateSharedLayout>
  )
}

function SectionHeader({ children }) {
  return <h2 className="font-medium text-3xl py-2">{children}</h2>
}
