import Link from 'next/link'
import React from 'react'
import { MotionBox, MotionFlexProps } from './MotionComponents'
import Image from 'next/image'
import { useResponsiveValue } from '@theme-ui/match-media'

export interface ShowProps extends MotionFlexProps {
  show: RT.Show
}

export default function ShowCard({ show, ...props }: ShowProps) {
  const title = show.attributes.title
  const img =
    show.included.images.find(
      (img) => img.attributes.image_type === `title_card`
    ) ?? show.included.images[0]

  const link = show.canonical_links.self

  const size = 200
  const quality = useResponsiveValue([30, 30, 10])

  return (
    <Link href={link} passHref>
      <MotionBox
        as="a"
        {...(props as any)}
        sx={{
          overflow: `hidden`,
          borderRadius: `lg`,
          bg: `gray.2`,
          cursor: `pointer`,
          textDecoration: `none`,
          color: `inherit`,
          boxShadow: `md`,
          fontSize: 0,
          lineHeight: 0,
          '& img': {
            verticalAlign: `bottom`,
          },
          ...(props.sx ?? {}),
        }}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 1,
        }}
      >
        <Image
          src={img.attributes.medium}
          width={Math.round(size * (16 / 9))}
          height={size}
          layout="responsive"
          alt={title}
          quality={quality}
          loading="eager"
        />
      </MotionBox>
    </Link>
  )
}
