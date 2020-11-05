import Link from 'next/link'
import React from 'react'
import { Box } from 'theme-ui'
import Flex from './Flex'
import { MotionFlex, MotionFlexProps } from './MotionComponents'
import RTImage from './RTImage'
import Text from './Text'

export interface ShowProps extends MotionFlexProps {
  show: RT.Show
}

export default function ShowCard({ show, ...props }: ShowProps) {
  const title = show.attributes.title
  const img = show.included.images[6]
  const link = show.canonical_links.self

  return (
    <Link href={link} passHref>
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
          textDecoration: `none`,
          '&:visited': {
            color: `inherit`,
          },
          ...(props.sx ?? {}),
        }}
      >
        <Box sx={{ overflow: `hidden`, flexGrow: 1, bg: `black` }}>
          <RTImage
            img={img}
            sx={{
              height: `100%`,
              width: `100%`,
            }}
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
