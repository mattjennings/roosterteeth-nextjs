import EpisodeCard from 'components/EpisodeCard'
import ImageHeader from 'components/ImageHeader'
import NoSSR from 'components/NoSSR'
import SearchBar from 'components/SearchBar'
import Skeleton from 'components/Skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'

const PER_PAGE = 30
const fetchEpisodes = (channel, page = 0, params = {}) =>
  fetcher(
    `/api/episodes?per_page=${PER_PAGE}&channel_id=${channel}&order=desc&order_by=attributes.public_golive_at&page=${page}&${qs.stringify(
      params
    )}`
  )

export const getStaticPaths = async () => {
  const { data: channels } = await fetcher<RT.SearchResponse<RT.Channel>>(
    `${process.env.API_BASE_URL}/channels`
  )

  return {
    paths: channels.map((channel) => ({
      params: {
        id: channel.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  const {
    data: [channel],
  } = await fetcher<RT.SearchResponse<RT.Channel>>(
    `${process.env.API_BASE_URL}/channels/${id}`
  )

  return {
    props: {
      title: channel.attributes.name ?? ``,
      channel,
    },
    revalidate: 1,
  }
}

export default function ChannelPage({ channel }: { channel: RT.Channel }) {
  const router = useRouter()
  const [search, setSearch] = useState((router.query.search as string) ?? ``)
  const [debouncedSearch, setDebouncedSearch] = useState(``)

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    remove,
  } = useInfiniteQuery<RT.SearchResponse<RT.Episode>>(
    `${router.query.id}-episodes`,
    ({ pageParam }) =>
      fetchEpisodes(channel.attributes.slug, pageParam, {
        query: debouncedSearch,
      }),
    {
      getNextPageParam(prev) {
        const nextPage = prev?.page + 1 ?? 0

        return nextPage < prev.total_pages ? nextPage : false
      },
    }
  )

  // update URL params
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== debouncedSearch) {
        remove()
        setDebouncedSearch(search)

        const query = { ...router.query, search }

        // remove from URL params if search is empty
        if (!search) {
          delete query.search
        }

        router.replace({
          pathname: router.pathname,
          query,
        })
      }
    }, 250)

    return () => clearTimeout(timeout)

    // eslint-disable-next-line
  }, [search])

  useInfiniteScroll({
    enabled: hasNextPage && !isFetching && !isFetchingNextPage,
    onLoadMore: () => {
      fetchNextPage()
    },
    scrollPercentage: 75,
  })
  const episodes = useMemo(() => {
    if (data) {
      return data.pages.flatMap(({ data }) => data)
    }
    return []
  }, [data])

  return (
    <div>
      <div className="mb-2">
        <ImageHeader
          className="object-contain py-3"
          src={channel.included.images[0].attributes.large}
          title={channel.attributes.name}
          initial={{
            backgroundColor: `#${channel.attributes.brand_color}`,
          }}
          animate={{
            backgroundColor: `#${channel.attributes.brand_color}`,
          }}
        />
      </div>
      <div className="max-w-[1920px] mx-auto">
        <div className="p-3">
          <SearchBar
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value)
            }}
          />
        </div>
        <AnimatePresence initial={false} exitBeforeEnter>
          <motion.div
            className="p-3 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            key={debouncedSearch}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <NoSSR>
              {isFetching && !data?.pages?.length
                ? new Array(10)
                    .fill(null)
                    .map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-[300px] sm:h-[400px] md:h-[375px]"
                      />
                    ))
                : episodes.map((episode) => (
                    <EpisodeCard
                      episode={episode}
                      key={`${debouncedSearch}-${episode.id}`}
                    />
                  ))}
            </NoSSR>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
