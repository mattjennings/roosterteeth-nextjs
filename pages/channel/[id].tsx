import EpisodeCard, { Episode } from 'components/EpisodeCard'
import { MotionGrid } from 'components/MotionComponents'
import { isBefore } from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { QueryCache, useInfiniteQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
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

  await queryCache.prefetchQuery('episodes', () =>
    fetchEpisodes(
      ctx.query.id,
      0,
      { query: ctx.query.search },
      ctx
    ).then((res) => [res])
  )

  function channelToTitle(channel) {
    switch (channel) {
      case 'achievement-hunter':
        return 'Achievement Hunter'
      case 'funhaus':
        return 'Funhaus'
    }

    return ''
  }
  return {
    props: {
      title: channelToTitle(ctx.query.id),
      channel: ctx.query.id,
      dehydratedState: dehydrate(queryCache),
    },
  }
}

export default function Channel({ channel }) {
  const router = useRouter()
  const [search, setSearch] = useState((router.query.search as string) ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const {
    data = [],
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
    clear,
  } = useInfiniteQuery(
    `episodes`,
    (key, page: number) =>
      fetchEpisodes(channel, page, { query: debouncedSearch }),
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
          search ? `/?${qs.stringify({ search })}` : '/',
          undefined,
          {
            shallow: true,
          }
        )
      }
    }, 250)

    return () => clearTimeout(timeout)
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
      return data.flatMap(({ data }) =>
        data.map((info) => ({
          id: info.id,
          title: info.attributes.title,
          caption: info.attributes.caption,
          img: info.included.images[0].attributes.medium,
          date: new Date(info.attributes.original_air_date),
          publicDate: new Date(info.attributes.public_golive_at),
          isRTFirst:
            isBefore(new Date(), new Date(info.attributes.public_golive_at)) ||
            info.attributes.is_sponsors_only,
          link: info.canonical_links.self.split('/watch/')[1],
        }))
      )
    }
    return []
  }, [data])

  return (
    <Box>
      <Box p={3}>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
          placeholder="Search"
          sx={{ width: '100%' }}
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
              {...episode}
              key={`${debouncedSearch}-${episode.id}`}
            />
          ))}
        </MotionGrid>
      </AnimatePresence>
    </Box>
  )
}
