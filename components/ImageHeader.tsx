import clsx from 'clsx'
import { motion, MotionProps } from 'framer-motion'
import React, { HTMLProps } from 'react'

export default function ImageHeader({
  title,
  ...props
}: {
  title: string
} & HTMLProps<HTMLImageElement> &
  MotionProps) {
  return (
    <motion.img
      alt={title}
      {...(props as any)}
      className={clsx(
        `w-full object-cover h-[25vw] sm:h[10vw] xl:h-[5vw]`,
        props.className
      )}
    />
  )
}
