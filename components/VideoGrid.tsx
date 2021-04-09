import clsx from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'

export default function VideoGrid(props: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      {...props}
      className={clsx(
        props.className,
        `grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4`
      )}
    />
  )
}
