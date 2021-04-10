import { useEffect, useRef } from 'react'

/**
 * Runs the function when component unmounts
 */
export default function useOnUnmount(cb: () => any) {
  // store callback in ref so it doesn't become stale
  const ref = useRef(cb)

  useEffect(() => {
    ref.current = cb
  }, [cb])

  useEffect(
    () => () => {
      ref.current()
    },
    []
  )
}
