import { useResponsiveValue } from '@theme-ui/match-media'
import format from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import { useLocalStorage } from 'hooks/useLocalStorage'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Box, Progress } from 'theme-ui'
import Flex from './Flex'
import { MotionFlex, MotionFlexProps, MotionImage } from './MotionComponents'
import NoSSR from './NoSSR'
import Text from './Text'
import ProgressiveImage from 'react-progressive-image'
import Image from 'next/image'

export interface EpisodeProps extends MotionFlexProps {
  episode: RT.Episode
}

export default function EpisodeCard({ episode, ...props }: EpisodeProps) {
  const title = episode.attributes.title
  const caption = episode.attributes.caption
  const link = episode.canonical_links.self
  const date = new Date(episode.attributes.original_air_date)
  const publicDate = new Date(episode.attributes.public_golive_at)
  const isRTFirst =
    !!episode.attributes.public_golive_at &&
    (isBefore(new Date(), new Date(episode.attributes.public_golive_at)) ||
      episode.attributes.is_sponsors_only)

  const [progress] = useLocalStorage(
    `video-progress-${episode.attributes.slug}`,
    0
  )

  const img =
    episode.included.images.find(
      (img) => img.attributes.image_type === `title_card`
    ) ?? episode.included.images[0]

  return (
    <Link href={link} passHref>
      <MotionFlex
        as="a"
        direction="column"
        sx={{
          position: `relative`,
          borderRadius: `lg`,
          bg: `gray.2`,
          overflow: `hidden`,
          cursor: `pointer`,
          color: `inherit`,
          textDecoration: `none`,
          boxShadow: `default`,
          '& img': {
            transition: `0.2s ease transform`,
            filter: isRTFirst ? `brightness(30%)` : undefined,
          },
          '&:hover img': {
            transform: `scale(1.025, 1.025)`,
          },
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
          <Image
            src={img.attributes.medium}
            width={300 * (16 / 9)}
            height={300}
            layout="responsive"
            alt={title}
          />
          <NoSSR>
            {progress > 0 && (
              <Progress
                sx={{
                  position: `absolute`,
                  borderRadius: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                max={1}
                value={progress}
              />
            )}
          </NoSSR>
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
        {props.children}
      </MotionFlex>
    </Link>
  )
}
