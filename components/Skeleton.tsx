import clsx from 'clsx'
import React, { HTMLProps } from 'react'

export default function Skeleton(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        props.className,
        `animate-pulse rounded-lg overflow-hidden bg-gray-300 dark:bg-dark-gray-700`
      )}
    />
  )
}
