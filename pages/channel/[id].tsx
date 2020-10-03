import EpisodeCard from 'components/EpisodeCard'
import { MotionGrid } from 'components/MotionComponents'
import ImageHeader from 'components/ImageHeader'
import { AnimatePresence } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { QueryCache, useInfiniteQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import { Episode, SearchResponse, Channel } from 'RT'
import { Box, Input } from 'theme-ui'

const PER_PAGE = 30
const fetchEpisodes = (channel, page = 0, params = {}, ctx?: any) =>
  fetcher(
    `/api/episodes?per_page=${PER_PAGE}&channel_id=${channel}&order=desc&page=${page}&${qs.stringify(
      params
    )}`,
    { ctx }
  )

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryCache = new QueryCache()

  const [
    {
      data: [channel],
    },
  ] = await Promise.all([
    fetcher<SearchResponse<Channel>>(`/api/channels/${ctx.query.id}`, { ctx }),
    queryCache.prefetchQuery(`${ctx.query.id}-episodes`, () =>
      fetchEpisodes(
        ctx.query.id,
        0,
        { query: ctx.query.search },
        ctx
      ).then((res) => [res])
    ),
  ])

  return {
    props: {
      title: channel.attributes.name ?? ``,
      channel,
      dehydratedState: dehydrate(queryCache),
    },
  }
}

export default function ChannelPage({ channel }: { channel: Channel }) {
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== debouncedSearch) {
        clear()
        setDebouncedSearch(search)

        router.replace(
          search ? `/?${qs.stringify({ search })}` : `/`,
          undefined,
          {
            shallow: true,
          }
        )
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

  const episodes = useMemo<Episode[]>(() => {
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
          {episodes.map((episode) => (
            <EpisodeCard
              episode={episode}
              key={`${debouncedSearch}-${episode.id}`}
            />
          ))}
        </MotionGrid>
      </AnimatePresence>
    </Box>
  )
}
