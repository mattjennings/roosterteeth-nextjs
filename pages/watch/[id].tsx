import WatchVideo from 'components/WatchVideo'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import React from 'react'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const [watchRes, metaRes] = await Promise.all([
    fetcher(`/api/watch/${ctx.query.id}/videos`, { ctx }),
    fetcher(`/api/watch/${ctx.query.id}`, { ctx }),
  ])

  const attributes = metaRes.data?.[0]?.attributes
  const url = watchRes.data?.[0]?.attributes?.url ?? null

  return {
    props: {
      nav: false,
      title: attributes.title,
      id: ctx.query.id,
      url,
      attributes,
      error: watchRes.access === false && watchRes.message,
    },
  }
}

export default function Watch({ id, url, error, attributes }) {
  return <WatchVideo slug={id} initialData={{ url, error, attributes }} />
}
