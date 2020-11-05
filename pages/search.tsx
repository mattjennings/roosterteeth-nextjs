import {
  MotionBox,
  MotionFlex,
  MotionFlexProps,
  MotionGrid,
  MotionImage,
} from 'components/MotionComponents'
import WatchVideo from 'components/WatchVideo'
import { format, isBefore } from 'date-fns'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { QueryCache, useInfiniteQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import { Box, Grid, Input, Progress } from 'theme-ui'
import Flex from '../components/Flex'
import Text from '../components/Text'
import Link from 'next/link'

const PER_PAGE = 30
const fetchEpisodes = (key, page = 0, params = {}, ctx?: any) =>
  fetcher(
    `/api/episodes?per_page=${PER_PAGE}&channel_id=achievement-hunter&order=desc&page=${page}&${qs.stringify(
      params
    )}`
  )

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryCache = new QueryCache()

  await queryCache.prefetchQuery(`episodes`, () =>
    fetchEpisodes(null, 0, { query: ctx.query.search }, ctx).then((res) => [
      res,
    ])
  )

  return {
    props: {
      dehydratedState: dehydrate(queryCache),
    },
  }
}

type Episode = {
  id: string
  title: string
  caption: string
  img: string
  date: Date
  publicDate: Date
  isRTFirst: boolean
  link: string
}

export default function Home() {
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
    `episodes`,
    (key, page: number) => fetchEpisodes(key, page, { query: debouncedSearch }),
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
  }, [search])

  useInfiniteScroll({
    enabled: canFetchMore && !isFetching && !isFetchingMore,
    onLoadMore: () => {
      fetchMore()
    },
    scrollPercentage: 0.75,
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
          link: info.canonical_links.self.split(`/watch/`)[1],
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
              {...episode}
              key={`${debouncedSearch}-${episode.id}`}
            />
          ))}
        </MotionGrid>
      </AnimatePresence>
    </Box>
  )
}

function EpisodeCard({
  id,
  link,
  img,
  isRTFirst,
  title,
  caption,
  date,
  publicDate,
  ...props
}: Episode & MotionFlexProps) {
  const [progress] = useLocalStorage(`video-progress-${link}`, 0)

  return (
    <Link href={`/watch/[id]`} as={`/watch/${link}`}>
      <MotionFlex
        as="a"
        direction="column"
        sx={{
          borderRadius: `lg`,
          bg: `gray.2`,
          overflow: `hidden`,
          cursor: `pointer`,
        }}
        {...(props as any)}
      >
        <Box
          sx={{
            overflow: `hidden`,
            width: `100%`,
            position: `relative`,
          }}
        >
          <MotionImage
            src={img}
            sx={{
              width: `100%`,
              height: `auto`,
              filter: isRTFirst ? `brightness(30%)` : undefined,
            }}
          />
          <Progress
            sx={{
              position: `absolute`,
              left: 0,
              right: 0,
              bottom: 1,
            }}
            max={1}
            value={progress}
          />
          {isRTFirst && (
            <Flex
              center
              sx={{
                position: `absolute`,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Text fontWeight="bold" color="white" fontSize={3}>
                RT FIRST
              </Text>
            </Flex>
          )}
        </Box>
        <Flex
          p={2}
          direction="column"
          justify="space-between"
          sx={{ flexGrow: 1 }}
        >
          <Box>
            <Text fontSize={2} fontWeight="semibold">
              {title}
            </Text>
            <Text fontSize={0}>{caption}</Text>
          </Box>
          <Text fontSize={0} mt={2} color="textMuted">
            {format(isRTFirst ? publicDate : date, `MMM dd / yy`)}
          </Text>
        </Flex>
      </MotionFlex>
    </Link>
  )
}
