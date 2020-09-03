import React, { useEffect, useRef } from 'react'

export function useDebouncedEffect(
  callback: React.EffectCallback,
  delay: number,
  deps?: React.DependencyList
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback()
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [delay, ...deps])
}

export default useDebouncedEffect
