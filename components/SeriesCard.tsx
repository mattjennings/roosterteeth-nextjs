import Link from 'next/link'
import React from 'react'
import { Series } from 'RT'
import { Box, Progress } from 'theme-ui'
import Flex from './Flex'
import { MotionFlex, MotionFlexProps, MotionImage } from './MotionComponents'
import Text from './Text'

export interface SeriesProps extends MotionFlexProps {
  series: Series
}

export default function SeriesCard({ series, ...props }: SeriesProps) {
  const title = series.attributes.title
  const img = series.included.images[0]
  const link = series.canonical_links.self

  return (
    <Link href={`/series/${link}`}>
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
