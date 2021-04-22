import clsx from 'clsx'
import EpisodeCard from 'components/EpisodeCard'
import NoSSR from 'components/NoSSR'
import ShowCard from 'components/ShowCard'
import Skeleton from 'components/Skeleton'
import { useVideoProgress } from 'components/VideoProgressProvider'
import { AnimatePresence, motion } from 'framer-motion'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'

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
  const { videos, removeVideo } = useVideoProgress()

  const queryClient = useQueryClient()
  const { data: keepWatching, isFetching, refetch } = useQuery<RT.Episode[]>(
    `incomplete-videos`,
    async () =>
      Promise.all(
        videos.slice(0, 10).map(({ slug }) =>
          fetcher(`/api/watch/${slug}`)
            .then((res) => ({ ...res.data?.[0], slug }))
            .catch((e) => null)
        )
      ),
    {
      // we only want to refetch when videos changes, which will refetch on focus
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )

  useEffect(() => {
    refetch()
  }, [videos])

  // prevents a drastic animation from Popular Series when keep watching loads in
  const allowLayoutAnimation = keepWatching?.length > 0

  return (
    <div>
      <div className="p-3">
        <NoSSR>
          {videos.length > 0 && (
            <div className="mb-2">
              <SectionHeader>Keep Watching</SectionHeader>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence initial={false}>
                  {isFetching && !keepWatching?.length
                    ? new Array(videos.length)
                        .fill(null)
                        .map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-[65vw] sm:h-[40vw] md:h-[30vw] lg:h-[23vw] xl:h-[18vw]"
                          />
                        ))
                    : keepWatching?.map((episode) => (
                        <EpisodeCard
                          key={episode._id}
                          episode={episode}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          layout="position"
                          showDescription={false}
                        >
                          <div className="absolute right-1 bottom-1">
                            <button
                              className={clsx(
                                `bg-none py-1 px-3 focus rounded-full font-medium text-xs sm:text-sm`,
                                `text-gray-800 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300`
                              )}
                              onClick={(e) => {
                                e.preventDefault()
                                removeVideo(episode.attributes.slug)
                                queryClient.setQueryData<RT.Episode[]>(
                                  `incomplete-videos`,
                                  (prev) =>
                                    prev.filter(
                                      (e) =>
                                        e.attributes.slug !==
                                        episode.attributes.slug
                                    )
                                )
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </EpisodeCard>
                      ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </NoSSR>
        <motion.div className="mb-2" layout={allowLayoutAnimation}>
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
  )
}

function SectionHeader({ children }) {
  return <h2 className="font-medium text-3xl py-2">{children}</h2>
}
