import format from 'date-fns/format'
import { useLocalStorage } from 'hooks/useLocalStorage'
import Link from 'next/link'
import React from 'react'
import { Box, Progress } from 'theme-ui'
import Flex from './Flex'
import { MotionFlex, MotionFlexProps, MotionImage } from './MotionComponents'
import Text from './Text'

export type Episode = {
  id: string
  title: string
  caption: string
  img: string
  date: Date
  publicDate: Date
  isRTFirst: boolean
  link: string
}

export default function EpisodeCard({
  id,
  link,
  img,
  isRTFirst,
  title,
  caption,
  date,
  publicDate,
  ...props
}: Episode & MotionFlexProps) {
  const [progress] = useLocalStorage(`video-progress-${link}`, 0)

  return (
    <Link href={`/watch/[id]`} as={`/watch/${link}`}>
      <MotionFlex
        as="a"
        direction="column"
        sx={{
          borderRadius: 'lg',
          bg: 'gray.2',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        {...(props as any)}
      >
        <Box
          sx={{
            overflow: 'hidden',
            width: '100%',
            position: 'relative',
          }}
        >
          <MotionImage
            src={img}
            sx={{
              width: '100%',
              height: 'auto',
              filter: isRTFirst ? 'brightness(30%)' : undefined,
            }}
          />
          <Progress
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 1,
            }}
            max={1}
            value={progress}
          />
          {isRTFirst && (
            <Flex
              center
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Text fontWeight="bold" color="white" fontSize={3}>
                RT FIRST
              </Text>
            </Flex>
          )}
        </Box>
        <Flex
          p={2}
          direction="column"
          justify="space-between"
          sx={{ flexGrow: 1 }}
        >
          <Box>
            <Text fontSize={2} fontWeight="semibold">
              {title}
            </Text>
            <Text fontSize={0}>{caption}</Text>
          </Box>
          <Text fontSize={0} mt={2} color="textMuted">
            {format(isRTFirst ? publicDate : date, 'MMM dd / yy')}
          </Text>
        </Flex>
      </MotionFlex>
    </Link>
  )
}
