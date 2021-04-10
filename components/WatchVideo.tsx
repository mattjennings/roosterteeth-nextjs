import clsx from 'clsx'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import useOnUnmount from 'hooks/useOnUnmount'
import { fetcher } from 'lib/fetcher'
import debounce from 'lodash/debounce'
import Head from 'next/head'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useQuery } from 'react-query'
import NoSSR from './NoSSR'
import { useVideoProgress } from './VideoProgressProvider'
import useHotkeys from '@reecelucas/react-use-hotkeys'
import { useKeyPress } from 'hooks/useKeyPress'
export interface WatchVideoProps extends HTMLMotionProps<'div'> {
  slug: string
  onClose?: () => any
}

export default function WatchVideo({ slug, ...props }: WatchVideoProps) {
  const player = useRef<ReactPlayer>()

  const { videos, setVideoProgress, getVideoProgress } = useVideoProgress()

  const [progress, setProgress] = useState(0)
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

  const meta = metaQuery.data?.data?.[0]
  const video = videoQuery.data?.data?.[0]

  useEffect(() => {
    if (ready && !playing) {
      player.current.seekTo(getVideoProgress(slug))
    }
    // eslint-disable-next-line
  }, [ready, videos])

  const updateProgress = useCallback(
    (
      progress = player.current.getCurrentTime() / player.current.getDuration()
    ) => {
      if (progress > 0.05 && progress < 0.95) {
        setVideoProgress({ slug, progress })
      } else if (progress > 0.95) {
        // mark as complete
        setVideoProgress({ slug, progress: 1 })
      }
    },
    [setVideoProgress, slug]
  )

  useOnUnmount(() => updateProgress(progress))

  useEffect(() => {
    updateProgress(progress)
  }, [updateProgress, progress])

  // skip back 15 seconds
  useKeyPress(`J`, () => {
    if (ready) {
      player.current.seekTo(player.current.getCurrentTime() - 15, `seconds`)
    }
  })

  // skip ahead 15 seconds
  useKeyPress(`L`, () => {
    if (ready) {
      player.current.seekTo(player.current.getCurrentTime() + 15, `seconds`)
    }
  })

  // play/pause
  useKeyPress(`K`, () => {
    if (ready) {
      setPlaying((prev) => !prev)
    }
  })

  return (
    <motion.div
      {...props}
      className={clsx(props.className, `h-screen w-screen bg-black relative`)}
    >
      <Head>
        {meta.attributes.title && <title>{meta.attributes.title}</title>}
      </Head>
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
                progressInterval={30000}
                onPlay={() => {
                  setPlaying(true)
                  setProgress(
                    player.current.getCurrentTime() /
                      player.current.getDuration()
                  )
                }}
                onPause={() => {
                  setPlaying(false)
                }}
                onProgress={({ played }) => {
                  setProgress(played)
                }}
                // onReady fires too soon, so we use onDuration to seek to the
                // last video progress once it's ready
                onDuration={() => {
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
                      {videoQuery.error.message ?? `Something went wrong`}
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
