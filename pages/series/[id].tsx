import EpisodeCard from 'components/EpisodeCard'
import { MotionGrid } from 'components/MotionComponents'
import { getYear } from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { QueryCache, useInfiniteQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import { Episode, SearchResponse, Show } from 'RT'
import { Box, Image, Input, Label, Select } from 'theme-ui'
import { humanize } from 'util/humanize'
import slug from 'slug'
import Flex from 'components/Flex'
import Text from 'components/Text'
import ImageHeader from 'components/ImageHeader'

const PER_PAGE = 30
const fetchEpisodes = (season, page = 0, params = {}, ctx?: any) => {
  return fetcher(
    `/api/seasons/${season}/episodes?per_page=${PER_PAGE}&order=desc&page=${page}&${qs.stringify(
      params
    )}`,
    { ctx }
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryCache = new QueryCache()

  const series = ctx.query.id

  // get all seasons for the series
  const [
    {
      data: [show],
    },
    { data: seasonsData },
  ] = await Promise.all([
    fetcher(`/api/shows/${series}`, { ctx }),
    fetcher(`/api/shows/${series}/seasons?order=desc`, { ctx }),
  ])

  const seasons = seasonsData.map((season) => ({
    title: season.attributes.title,
    slug: season.attributes.slug,
  }))
  const season = seasons[0].slug

  await queryCache.prefetchQuery(`${season}-episodes`, () =>
    fetchEpisodes(
      ctx.query.id,
      0,
      { query: ctx.query.search },
      ctx
    ).then((res) => [res])
  )

  return {
    props: {
      title: show.attributes.title,
      dehydratedState: dehydrate(queryCache),
      show,
      seasons,
    },
  }
}

export default function Series({
  show,
  seasons,
}: {
  show: Show
  seasons: Array<{ title: string; slug: string }>
}) {
  const [season, setSeason] = useState(seasons[0].slug)

  const {
    data = [],
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery<SearchResponse<Episode>>(
    `${season}-episodes`,
    (key, page: number) => fetchEpisodes(season, page),
    {
      getFetchMore(prev) {
        const nextPage = prev?.page + 1 ?? 0

        return nextPage < prev.total_pages ? nextPage : false
      },
    }
  )

  useInfiniteScroll({
    enabled: canFetchMore && !isFetching && !isFetchingMore,
    onLoadMore: () => {
      fetchMore()
    },
    scrollPercentage: 75,
  })

  const episodes = useMemo(() => {
    if (data) {
      return data.flatMap(({ data }) => data)
    }
    return []
  }, [data])

  return (
    <Box>
      <Box mb={2}>
        <ImageHeader
          img={show.included.images[0].attributes.large}
          title={show.attributes.title}
        />
      </Box>
      <Flex my={2} px={3}>
        <Box sx={{ width: [`100%`, `100%`, `120px`], mx: `auto` }}>
          <Label sx={{ display: `inline-flex`, flexDirection: `column` }}>
            <Text fontWeight="medium">Season</Text>
            <Select
              value={season}
              onChange={(e) => setSeason(e.currentTarget.value)}
            >
              {seasons.map((season) => (
                <option key={season.slug} value={season.slug}>
                  {season.title}
                </option>
              ))}
            </Select>
          </Label>
        </Box>
      </Flex>
      <AnimatePresence initial={false} exitBeforeEnter>
        <MotionGrid
          columns={[1, 2, 3, 3, 4]}
          p={3}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {episodes.map((episode) => (
            <EpisodeCard episode={episode} key={episode.id} />
          ))}
        </MotionGrid>
      </AnimatePresence>
    </Box>
  )
}
