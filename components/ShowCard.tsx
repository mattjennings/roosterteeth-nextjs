import Link from 'next/link'
import React from 'react'
import { Show } from 'RT'
import { Box, Progress } from 'theme-ui'
import Flex from './Flex'
import { MotionFlex, MotionFlexProps, MotionImage } from './MotionComponents'
import Text from './Text'

export interface ShowProps extends MotionFlexProps {
  show: Show
}

export default function ShowCard({ show, ...props }: ShowProps) {
  const title = show.attributes.title
  const img = show.included.images[0]
  const link = show.canonical_links.self

  return (
    <Link href={link}>
      <MotionFlex
        as="a"
        direction="column"
        wrap="nowrap"
        {...(props as any)}
        sx={{
          borderRadius: `lg`,
          bg: `gray.2`,
          overflow: `hidden`,
          cursor: `pointer`,
          ...(props.sx ?? {}),
        }}
      >
        <Box sx={{ overflow: `hidden`, flexGrow: 1 }}>
          <MotionImage
            src={img.attributes.medium}
            sx={{ height: `100%`, width: `100%`, objectFit: `cover` }}
          />
        </Box>
        <Flex
          p={2}
          direction="column"
          justify="space-between"
          sx={{ flexShrink: 1 }}
        >
          <Text fontSize={2} fontWeight="semibold">
            {title}
          </Text>
        </Flex>
      </MotionFlex>
    </Link>
  )
}