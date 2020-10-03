import Flex from 'components/Flex'
import {
  MotionBox,
  MotionBoxProps,
  MotionFlex,
} from 'components/MotionComponents'
import Text from 'components/Text'
import { AnimatePresence } from 'framer-motion'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { setUserCookie } from 'lib/cookies'
import { getVideoInfo } from 'lib/rt'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useQuery } from 'react-query'
import { Box, Close } from 'theme-ui'

export interface WatchVideoProps extends MotionBoxProps {
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
  onClose,
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
      // add to unfinished
      setUserCookie((prev) => {
        const unfinishedVideos = prev.unfinishedVideos ?? []

        const exists = unfinishedVideos?.indexOf(slug) > -1

        return {
          unfinishedVideos: exists
            ? unfinishedVideos.sort((vid) => (vid === slug ? -1 : 1))
            : [slug, ...unfinishedVideos].slice(0, 5),
        }
      })
    } else {
      // remove from unfinished
      setUserCookie((prev) => ({
        unfinishedVideos:
          prev.unfinishedVideos?.filter((vid) => vid !== slug) ?? [],
      }))
    }
  }

  return (
    <MotionBox
      {...(props as any)}
      sx={{
        width: `100vw`,
        height: `100vh`,
        bg: `black`,
        position: `relative`,
      }}
    >
      {data && (
        <Box
          sx={{ position: `absolute`, top: 0, left: 0, right: 0, bottom: 0 }}
        >
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
              <MotionFlex
                sx={{
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  position: `absolute`,
                  pointerEvents: `none`,
                  p: 4,
                  background: `linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(255,255,255,0) 100%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  sx={{ width: `100%` }}
                >
                  <Text color="white" fontSize={4}>
                    {error ? error : attributes.title}
                  </Text>
                  {onClose && (
                    <Close
                      sx={{
                        width: 8,
                        height: 8,
                        color: `white`,
                        cursor: `pointer`,
                        zIndex: 1000,
                        pointerEvents: `all`,
                      }}
                      onClick={(ev) => {
                        ev.stopPropagation()
                        onClose()
                      }}
                    />
                  )}
                </Flex>
              </MotionFlex>
            )}
          </AnimatePresence>
        </Box>
      )}
    </MotionBox>
  )
}
