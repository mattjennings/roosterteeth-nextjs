import clsx from 'clsx'
import { HTMLMotionProps, motion } from 'framer-motion'
import React, { HTMLProps } from 'react'

export default function Skeleton(props: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      {...props}
      className={clsx(
        props.className,
        `animate-pulse shadow rounded-lg overflow-hidden bg-gray-300 dark:bg-dark-gray-700`
      )}
    />
  )
}
