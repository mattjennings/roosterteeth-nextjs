import { useEffect, useLayoutEffect, useState } from 'react'

export function useMounted({ layout }: { layout?: boolean } = {}) {
  const [isMounted, setMounted] = useState(false)

  useEffect(() => {
    if (!layout) {
      setMounted(true)
    }
  }, [])

  useLayoutEffect(() => {
    if (layout) {
      setMounted(true)
    }
  }, [])

  return isMounted
}
