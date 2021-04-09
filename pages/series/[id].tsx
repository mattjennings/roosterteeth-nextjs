import EpisodeCard from 'components/EpisodeCard'
import ImageHeader from 'components/ImageHeader'
import NoSSR from 'components/NoSSR'
import Skeleton from 'components/Skeleton'
import { AnimatePresence, motion } from 'framer-motion'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import { fetcher } from 'lib/fetcher'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import qs from 'qs'
import React, { useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { Select } from 'theme-ui'

const PER_PAGE = 30
const fetchEpisodes = (season, page = 0, params = {}, ctx?: any) => {
  return fetcher(
    `/api/seasons/${season}/episodes?per_page=${PER_PAGE}&order=desc&page=${page}&${qs.stringify(
      params
    )}`
  )
}

export const getStaticPaths = async () => {
  const { data: shows } = await fetcher<RT.SearchResponse<RT.Show>>(
    `${process.env.API_BASE_URL}/shows`
  )

  return {
    paths: shows.map((show) => ({
      params: {
        id: show.attributes.slug,
      },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  // get all seasons for the series
  const [
    {
      data: [show],
    },
    { data: seasonsData },
  ] = await Promise.all([
    fetcher(`${process.env.API_BASE_URL}/shows/${id}`),
    fetcher(`${process.env.API_BASE_URL}/shows/${id}/seasons?order=desc`),
  ])

  const seasons = seasonsData.map((season) => ({
    title: season.attributes.title,
    slug: season.attributes.slug,
  }))

  return {
    props: {
      title: show.attributes.title,
      show,
      seasons,
    },
    revalidate: 1,
  }
}

export default function Series({
  show,
  seasons,
}: {
  show: RT.Show
  seasons: Array<{ title: string; slug: string }>
}) {
  const router = useRouter()
  const [season, setSeason] = useState(() => {
    // need to manually pull search params off router.asPath
    const query = qs.parse(router.asPath.split(`?`)[1])

    return (query.season as string) ?? seasons[0].slug
  })

  const {
    data = [],
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery<RT.SearchResponse<RT.Episode>>(
    `${season}-episodes`,
    (key, page: number) => fetchEpisodes(season, page),
    {
      getFetchMore(prev) {
        const nextPage = prev?.page + 1 ?? 0

        return nextPage < prev.total_pages ? nextPage : false
      },
    }
  )

  // update URL params
  useEffect(() => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        season,
      },
    })
    // eslint-disable-next-line
  }, [season])

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

  const hero = show.included.images.find(
    (img) => img.attributes.image_type === `hero`
  )

  // todo: use this on an overlay somewhere
  const logo = show.included.images.find(
    (img) => img.attributes.image_type === `logo`
  )

  const fallback =
    show.included.images.find(
      (img) => img.attributes.image_type === `title_card`
    ) ?? show.included.images[0]

  const headerImg = hero || fallback

  return (
    <div>
      <div className="mb-2">
        <ImageHeader
          className="object-cover"
          src={headerImg.attributes.large}
          title={show.attributes.title}
        />
      </div>
      <div className="max-w-[1920px] mx-auto">
        <div className="flex my-3 px-3">
          <div className="w-full sm:w-32 mx-auto">
            <label className="inline-block w-full flex-col">
              <span className="font-medium">Season</span>
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
            </label>
          </div>
        </div>
        <AnimatePresence initial={false} exitBeforeEnter>
          <motion.div
            className="p-3 grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <NoSSR>
              {isFetching && !data?.length
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
                      key={episode.id}
                      showDescription
                    />
                  ))}
            </NoSSR>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
