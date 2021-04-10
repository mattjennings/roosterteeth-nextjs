import NoSSR from 'components/NoSSR'
import ShowCard from 'components/ShowCard'
import Skeleton from 'components/Skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import slug from 'slug'
import { filterFalsey } from 'util/filter'
import Select from 'components/Select'

const PER_PAGE = 30
const fetchShows = (page = 0, params: any = {}) => {
  return fetcher(
    `/api/shows?per_page=${PER_PAGE}&page=${page}&${qs.stringify(params)}`
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      title: `Series`,
    },
  }
}

type Filter = {
  name: string
  genre?: boolean
  channel?: boolean
  params?: Record<string, any>
}
export default function Series() {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>(() => {
    // need to manually pull search params off router.asPath
    const query = qs.parse(router.asPath.split(`?`)[1])

    return filters.find((f) => f.name === (query.filter as string))
  })

  const [sort, setSort] = useState<string>(() => {
    const query = qs.parse(router.asPath.split(`?`)[1])

    return query.sort as string
  })

  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<RT.SearchResponse<RT.Show>>(
    `shows-${filter?.name}-${sort}`,
    ({ pageParam }) => {
      const sortParams: any = {}
      switch (sort) {
        case `newest`:
          sortParams.order = `desc`
          break
        case `oldest`:
          sortParams.order = `asc`
          break
        case `a-z`:
          sortParams.title_order = `asc`
          break
        case `z-a`:
          sortParams.title_order = `desc`
      }
      if (filter?.channel) {
        return fetchShows(pageParam, {
          channel_id: slug(filter.name),
          ...sortParams,
        })
      }

      if (filter?.genre) {
        return fetchShows(pageParam, { genres: filter.name, ...sortParams })
      }

      if (filter?.params) {
        return fetchShows(pageParam, { ...filter.params, ...sortParams })
      }

      return fetchShows(pageParam)
    },
    {
      getNextPageParam(prev) {
        const nextPage = prev?.page + 1 ?? 0

        return nextPage < prev.total_pages ? nextPage : false
      },
    }
  )

  // update URL params
  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: filterFalsey({
        ...router.query,
        filter: filter?.name,
        sort,
      }),
    })

    // eslint-disable-next-line
  }, [filter, sort])

  useInfiniteScroll({
    enabled: hasNextPage && !isFetching && !isFetchingNextPage,
    onLoadMore: () => {
      fetchNextPage()
    },
    scrollPercentage: 75,
  })

  const shows = useMemo(() => {
    return data?.pages.flatMap(({ data }) => data) ?? []
  }, [data])

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="my-2 p-3 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <label className="inline-flex flex-col">
          <span className="font-medium">Filter</span>
          <Select
            value={filter?.name}
            onChange={(e) => {
              setFilter(
                filters.find((filter) => filter.name === e.currentTarget.value)
              )
            }}
          >
            {filters.map((filter) => (
              <option key={filter.name} value={filter.name}>
                {filter.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="inline-flex flex-col">
          <span className="font-medium">Sort</span>
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.currentTarget.value)
            }}
          >
            <option value="newest">Newest - Oldest</option>
            <option value="oldest">Oldest - Newest</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </Select>
        </label>
      </div>

      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
          className="p-3 grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <NoSSR>
            {isFetching && !data?.pages.length
              ? new Array(PER_PAGE)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton key={i} className="pt-[56.25%] w-full" />
                  ))
              : shows.map((show) => <ShowCard show={show} key={show.id} />)}
          </NoSSR>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

const filters: Filter[] = [
  {
    name: `All`,
  },
  {
    name: `FIRST Exclusive`,
    params: { pay_only: true },
  },
  {
    name: `Rooster Teeth`,
    channel: true,
  },
  {
    name: `Achievement Hunter`,
    channel: true,
  },
  {
    name: `Funhaus`,
    channel: true,
  },
  {
    name: `Animation`,
    channel: true,
  },
  {
    name: `Inside Gaming`,
    channel: true,
  },
  {
    name: `Death Battle`,
    channel: true,
  },

  {
    name: `The Yogscast`,
    channel: true,
  },

  {
    name: `Kinda Funny`,
    channel: true,
  },

  {
    name: `Friends Of RT`,
    channel: true,
  },

  {
    name: `Action Packed`,
    genre: true,
  },

  {
    name: `Full Of Laughs`,
    genre: true,
  },

  {
    name: `Games Reimagined`,
    genre: true,
  },

  {
    name: `Classic Rooster Teeth`,
    genre: true,
  },

  {
    name: `Rooster Teeth Originals`,
    genre: true,
  },

  {
    name: `Quick Fix Animation`,
    genre: true,
  },

  {
    name: `Just Gaming`,
    genre: true,
  },
  {
    name: `Headphone Favorites`,
    genre: true,
  },
  {
    name: `Bingeworthy`,
    genre: true,
  },
  {
    name: `Something Very Different`,
    genre: true,
  },
  {
    name: `Just For FIRST Members`,
    genre: true,
  },
  {
    name: `Premium Series`,
    genre: true,
  },
  {
    name: `Tabletop Games`,
    genre: true,
  },
  {
    name: `Podcasts`,
    genre: true,
  },
  {
    name: `RWBY Series`,
    genre: true,
  },
]
