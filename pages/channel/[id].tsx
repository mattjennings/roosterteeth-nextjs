import EpisodeCard from 'components/EpisodeCard'
import ImageHeader from 'components/ImageHeader'
import { MotionGrid } from 'components/MotionComponents'
import NoSSR from 'components/NoSSR'
import Skeleton from 'components/Skeleton'
import { AnimatePresence } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { Box, Input } from 'theme-ui'

const PER_PAGE = 30
const fetchEpisodes = (channel, page = 0, params = {}) =>
  fetcher(
    `/api/episodes?per_page=${PER_PAGE}&channel_id=${channel}&order=desc&page=${page}&${qs.stringify(
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
  }
}

export default function ChannelPage({ channel }: { channel: RT.Channel }) {
  const router = useRouter()
  const [search, setSearch] = useState((router.query.search as string) ?? ``)
  const [debouncedSearch, setDebouncedSearch] = useState(``)

  const {
    data = [],
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
    clear,
  } = useInfiniteQuery(
    `${router.query.id}-episodes`,
    (key, page: number) =>
      fetchEpisodes(channel.attributes.slug, page, { query: debouncedSearch }),
    {
      getFetchMore(prev) {
        const nextPage = prev?.page + 1 ?? 0

        return nextPage < prev.total_pages ? nextPage : false
      },
    }
  )

  // update URL params
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== debouncedSearch) {
        clear()
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
    enabled: canFetchMore && !isFetching && !isFetchingMore,
    onLoadMore: () => {
      fetchMore()
    },
    scrollPercentage: 75,
  })

  const episodes = useMemo<RT.Episode[]>(() => {
    if (data) {
      return data.flatMap(({ data }) => data)
    }
    return []
  }, [data])

  return (
    <Box>
      <Box mb={2}>
        <ImageHeader
          img={channel.included.images[0].attributes.large}
          title={channel.attributes.name}
          initial={{
            backgroundColor: `#${channel.attributes.brand_color}`,
          }}
          animate={{
            backgroundColor: `#${channel.attributes.brand_color}`,
          }}
          sx={{
            objectFit: `contain`,
            py: 3,
          }}
        />
      </Box>
      <Box p={3}>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
          placeholder="Search"
          sx={{ width: `100%` }}
        />
      </Box>
      <AnimatePresence initial={false} exitBeforeEnter>
        <MotionGrid
          columns={[1, 2, 3, 3, 4]}
          p={3}
          key={debouncedSearch}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <NoSSR>
            {isFetching && !data?.length
              ? new Array(10)
                  .fill(null)
                  .map((_, i) => <Skeleton key={i} height={[300, 400, 375]} />)
              : episodes.map((episode) => (
                  <EpisodeCard
                    episode={episode}
                    key={`${debouncedSearch}-${episode.id}`}
                  />
                ))}
          </NoSSR>
        </MotionGrid>
      </AnimatePresence>
    </Box>
  )
}
