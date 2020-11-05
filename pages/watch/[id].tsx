import WatchVideo from 'components/WatchVideo'
import { fetcher } from 'lib/fetcher'
import React from 'react'

export default function Watch({ id, url, error, attributes }) {
  return <WatchVideo slug={id} initialData={{ url, error, attributes }} />
}

Watch.getInitialProps = async (ctx) => {
  const id = ctx.query.id
  const [watchRes, metaRes] = await Promise.all([
    fetcher(`/api/watch/${id}/videos`),
    fetcher(`/api/watch/${id}`),
  ])

  const attributes = metaRes.data?.[0]?.attributes
  const url = watchRes.data?.[0]?.attributes?.url ?? null

  return {
    nav: false,
    title: attributes.title,
    id,
    url,
    attributes,
    error: watchRes.access === false && watchRes.message,
  }
}
