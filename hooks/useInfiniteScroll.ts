import { useState, useEffect } from 'react'

const useInfiniteScroll = ({
  enabled,
  onLoadMore,
  scrollPercentage = 100,
}: {
  enabled: boolean
  scrollPercentage?: number
  onLoadMore: () => any
}) => {
  useEffect(() => {
    const el = document.querySelector('main')
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [onLoadMore, enabled])

  function handleScroll() {
    const el = document.querySelector('main')

    const isTriggered =
      el.scrollTop + el.clientHeight >
      el.scrollHeight * (scrollPercentage / 100)

    if (enabled && isTriggered) {
      onLoadMore()
    }
  }
}

export default useInfiniteScroll
