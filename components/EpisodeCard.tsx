import { useResponsiveValue } from '@theme-ui/match-media'
import format from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import { useLocalStorage } from 'hooks/useLocalStorage'
import Link from 'next/link'
import React from 'react'
import { Episode } from 'RT'
import { Box, Progress } from 'theme-ui'
import Flex from './Flex'
import { MotionFlex, MotionFlexProps, MotionImage } from './MotionComponents'
import Text from './Text'

export interface EpisodeProps extends MotionFlexProps {
  episode: Episode
}

export default function EpisodeCard({ episode, ...props }: EpisodeProps) {
  const img = useResponsiveValue(
    [
      episode.included.images[0].attributes.small,
      episode.included.images[0].attributes.small,
      episode.included.images[0].attributes.medium,
    ],
    {
      defaultIndex: 0,
    }
  )
  const title = episode.attributes.title
  const caption = episode.attributes.caption
  const link = episode.canonical_links.self
  const date = new Date(episode.attributes.original_air_date)
  const publicDate = new Date(episode.attributes.public_golive_at)
  const isRTFirst =
    !!episode.attributes.public_golive_at &&
    (isBefore(new Date(), new Date(episode.attributes.public_golive_at)) ||
      episode.attributes.is_sponsors_only)
  const [progress] = useLocalStorage(`video-progress-${link}`, 0)

  return (
    <Link href={link}>
      <MotionFlex
        as="a"
        direction="column"
        sx={{
          borderRadius: `lg`,
          bg: `gray.2`,
          overflow: `hidden`,
          cursor: `pointer`,
        }}
        {...(props as any)}
      >
        <Box
          sx={{
            overflow: `hidden`,
            width: `100%`,
            position: `relative`,
          }}
        >
          <MotionImage
            src={img}
            sx={{
              width: `100%`,
              height: `auto`,
              filter: isRTFirst ? `brightness(30%)` : undefined,
            }}
          />
          <Progress
            sx={{
              position: `absolute`,
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
                position: `absolute`,
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
            {format(isRTFirst ? publicDate : date, `MMM dd / yy`)}
          </Text>
        </Flex>
      </MotionFlex>
    </Link>
  )
}
