import { useVideoProgress } from 'components/VideoProgressProvider'
import WatchVideo from 'components/WatchVideo'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'
import React from 'react'
import { QueryClient } from 'react-query'
import { dehydrate } from 'react-query/hydration'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const slug = ctx.query.id

  const queryClient = new QueryClient()

  async function getStartPosition() {
    if (session) {
      const { progress } = await fetcher(`/api/user/get-video-progress`, {
        method: `POST`,
        body: JSON.stringify({ slug }),
        headers: {
          cookie: ctx.req.headers.cookie,
        },
      })

      return progress
    }
    return 0
  }

  // prefetch the meta url for video
  const [startAt] = await Promise.all([
    getStartPosition(),
    queryClient.prefetchQuery(`/api/watch/${slug}`, () =>
      fetcher(`/api/watch/${slug}`)
    ),
  ])

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      nav: false,
      slug,
      startAt,
      isAuthenticated: !!session,
    },
  }
}

export default function Watch({ slug, startAt, isAuthenticated }) {
  const { getVideoProgress } = useVideoProgress()

  if (!isAuthenticated) {
    // will be retrieved from localstorage
    startAt = getVideoProgress(slug)
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <WatchVideo slug={slug} startAt={startAt} />
    </div>
  )
}
