import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { setUserCookie } from 'lib/cookies'
import { getVideoInfo } from 'lib/rt'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useQuery } from 'react-query'

export interface WatchVideoProps extends HTMLMotionProps<'div'> {
  slug: string
  initialData?: {
    attributes: any
    url: string
    error: string
  }
  onClose?: () => any
}

export default function WatchVideo({
  slug,
  initialData,
  ...props
}: WatchVideoProps) {
  const player = useRef<ReactPlayer>()

  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const { data } = useQuery(slug, () => getVideoInfo(slug), {
    initialData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const [progress, setProgress] = useLocalStorage(`video-progress-${slug}`, 0)
  const { error, url, attributes } = data ?? {}

  useEffect(() => {
    if (ready) {
      player.current.seekTo(progress)
    }
    // eslint-disable-next-line
  }, [ready])

  const getProgress = () =>
    player.current.getCurrentTime() / player.current.getDuration()

  function updateProgress(progress = getProgress()) {
    setProgress(progress)

    if (progress > 0.1 && progress < 0.9) {
      // add to incomplete
      setUserCookie((prev) => {
        const incompleteVideos = prev.incompleteVideos ?? []

        const exists = incompleteVideos?.indexOf(slug) > -1

        return {
          incompleteVideos: exists
            ? incompleteVideos.sort((vid) => (vid === slug ? -1 : 1))
            : [slug, ...incompleteVideos].slice(0, 5),
        }
      })
    } else {
      // remove from incomplete
      setUserCookie((prev) => ({
        incompleteVideos:
          prev.incompleteVideos?.filter((vid) => vid !== slug) ?? [],
      }))
    }
  }

  return (
    <motion.div className="h-screen w-screen bg-black relative" {...props}>
      {data && (
        <div className="absolute inset-0">
          {!error && (
            <ReactPlayer
              ref={player}
              playing={playing}
              controls
              url={url}
              pip
              width="100%"
              height="100%"
              onPlay={() => setPlaying(true)}
              onPause={() => {
                setPlaying(false)
                updateProgress()
              }}
              onProgress={({ played }) => {
                updateProgress(played)
              }}
              onReady={() => {
                setReady(true)
              }}
            />
          )}
          <AnimatePresence initial={false}>
            {(!playing || error) && (
              <motion.div
                className="absolute inset-0 pointer-events-none p-4 bg-gradient-to-b from-black to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-white text-3xl">
                    {error ? error : attributes.title}
                  </h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
