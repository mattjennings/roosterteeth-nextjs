import clsx from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'
import { useMediaQuery } from 'hooks/useMediaQuery'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface ShowProps extends HTMLMotionProps<'a'> {
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

  return (
    <Link href={link} passHref>
      <motion.a
        {...props}
        className={clsx(
          props.className,
          `overflow-hidden group rounded-lg cursor-pointer focus-big shadow`,
          `bg-gray-200  dark:bg-dark-gray-800`
        )}
        style={{
          // fix safari clipping outside of border radius on image scale
          transform: `translateZ(0)`,
        }}
      >
        <Image
          className={clsx(
            `transform transition-transform duration-100 ease-linear`,
            `group-hover:scale-105 group-focus:scale-105`,
            `align-bottom`
          )}
          src={img.attributes.medium}
          width={Math.round(size * (16 / 9))}
          height={size}
          layout="responsive"
          alt={title}
          quality={30}
        />
      </motion.a>
    </Link>
  )
}
