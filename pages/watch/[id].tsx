import WatchVideo from 'components/WatchVideo'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import React from 'react'
import { QueryClient } from 'react-query'
import { dehydrate } from 'react-query/hydration'
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.id

  const queryClient = new QueryClient()

  // prefetch the meta url for video
  await queryClient.prefetchQuery(`/api/watch/${id}`, () =>
    fetcher(`/api/watch/${id}`)
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      nav: false,
      id,
    },
  }
}

export default function Watch({ id }) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <WatchVideo slug={id} />
    </div>
  )
}
