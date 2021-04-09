import { useEffect } from 'react'

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
    window.addEventListener(`scroll`, handleScroll)
    return () => window.removeEventListener(`scroll`, handleScroll)
  }, [onLoadMore, enabled])

  function handleScroll() {
    const scrollPosition =
      ((document.documentElement.scrollTop +
        document.documentElement.clientHeight) /
        document.documentElement.scrollHeight) *
      100

    if (!enabled || scrollPosition < scrollPercentage) {
      return
    }
    onLoadMore()
  }
}

export default useInfiniteScroll
