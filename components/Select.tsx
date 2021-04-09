import clsx from 'clsx'
import { HTMLProps } from 'react'

export type SelectProps = HTMLProps<HTMLSelectElement>

export default function Select(props: SelectProps) {
  return (
    <select
      {...props}
      className={clsx(
        `focus:outline-none border-none text-base sm:text-sm rounded-md cursor-pointer shadow`,
        `focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-opacity-75`,
        `bg-gray-200 dark:bg-dark-gray-700`,
        `text-gray-700 dark:text-gray-300`,
        props.className
      )}
    />
  )
}
