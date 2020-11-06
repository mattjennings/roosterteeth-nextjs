import Link from 'next/link'
import React from 'react'
import { MotionBox, MotionFlexProps } from './MotionComponents'
import Image from 'next/image'

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

  const size = 300

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
          src={img.attributes.large}
          width={size * (16 / 9)}
          height={size}
          layout="responsive"
          alt={title}
        />
      </MotionBox>
    </Link>
  )
}
