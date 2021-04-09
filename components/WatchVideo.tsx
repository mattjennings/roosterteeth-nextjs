import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { setUserCookie } from 'lib/cookies'
import { fetcher } from 'lib/fetcher'
import { getVideoInfo } from 'lib/rt'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useQuery } from 'react-query'
import NoSSR from './NoSSR'

export interface WatchVideoProps extends HTMLMotionProps<'div'> {
  slug: string
  onClose?: () => any
}

export default function WatchVideo({ slug, ...props }: WatchVideoProps) {
  const player = useRef<ReactPlayer>()

  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  const metaQuery = useQuery<{ data: RT.Episode[] }>(
    `/api/watch/${slug}`,
    () => fetcher(`/api/watch/${slug}`),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )
  const videoQuery = useQuery<{ data: RT.Video[] }>(
    `/api/watch/${slug}/videos`,
    () => fetcher(`/api/watch/${slug}/videos`),
    {
      enabled: process.browser,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )

  const [progress, setProgress] = useLocalStorage(`video-progress-${slug}`, 0)

  const meta = metaQuery.data?.data?.[0]
  const video = videoQuery.data?.data?.[0]

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
    <motion.div
      {...props}
      className={clsx(props.className, `h-screen w-screen bg-black relative`)}
    >
      {meta && (
        <div className="absolute inset-0">
          <NoSSR>
            {video && !videoQuery.error && (
              <ReactPlayer
                ref={player}
                playing={playing}
                controls
                url={video.attributes.url}
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
          </NoSSR>
          <AnimatePresence initial={false}>
            {!playing && (
              <motion.div
                className="absolute inset-0 pointer-events-none p-4 bg-gradient-to-b from-black to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-white text-3xl">
                    {meta.attributes?.title}
                  </h1>
                </div>
                {videoQuery.error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-white text-3xl">
                      {/* @ts-ignore */}
                      {videoQuery.error?.access === false
                        ? `Video unavailable`
                        : `Something went wrong`}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
