import { SearchIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import React, { HTMLProps } from 'react'

export default function SearchBar(props: HTMLProps<HTMLInputElement>) {
  return (
    <label
      className={clsx(
        `flex flex-nowrap items-center p-2 w-full rounded-lg focus-within group`,
        `focus-within:ring-gray-400 dark:focus-within:ring-gray-500 focus-within:ring-opacity-75`,
        `bg-gray-200 dark:bg-dark-gray-700`
      )}
      aria-label="Search Bar"
    >
      <SearchIcon className="mr-2 w-6 h-6 text-dark-gray-400 dark:text-gray-400" />
      <input
        {...props}
        className={clsx(
          `font-medium w-full text-gray-600 dark:text-gray-300  placeholder-gray-600 dark:placeholder-dark-gray-300 bg-transparent focus:outline-none`,
          props.className
        )}
      />
    </label>
  )
}
