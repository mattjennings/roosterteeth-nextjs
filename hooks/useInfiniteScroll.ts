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
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onLoadMore, enabled])

  function handleScroll() {
    const scrollPosition =
      window.innerHeight * 2 -
      window.innerHeight * (scrollPercentage / 100) +
      document.documentElement.scrollTop

    const triggerPoint = document.documentElement.offsetHeight

    if (!enabled || scrollPosition <= triggerPoint) {
      return
    }
    onLoadMore()
  }
}

export default useInfiniteScroll
