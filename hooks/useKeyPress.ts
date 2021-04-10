import { useEffect, useRef, useState } from 'react'

export function useKeyPress(key: string, cb: () => any) {
  useEffect(() => {
    function _cb(ev) {
      if (ev.key.toLowerCase() === key.toLowerCase()) {
        cb()
      }
    }
    window.addEventListener(`keydown`, _cb)
    return () => {
      window.removeEventListener(`keydown`, _cb)
    }
  }, [cb, key])
}
