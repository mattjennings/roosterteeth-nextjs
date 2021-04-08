import { HomeIcon, MoonIcon, SunIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { HTMLProps, useEffect, useState } from 'react'
import NoSSR from './NoSSR'
import Switch from './Switch'

export default function SideNav(props: HTMLProps<HTMLDivElement>) {
  return (
    <nav
      {...props}
      className={clsx(
        `flex flex-col items-stretch flex-nowrap px-2 pt-2 w-full h-screen overflow-scroll`,
        `border-r bg-background border-background`,
        props.className
      )}
    >
      <div className="flex justify-between items-center p-2">
        <Link href="/">
          <HomeIcon className="w-6 h-6" />
        </Link>
        <NoSSR>
          <ThemeSwitch />
        </NoSSR>
      </div>
      <LinkGroup name="Channels" basePath="/channel">
        <Link sub href="/channel/achievement-hunter">
          Achievement Hunter
        </Link>
        <Link sub href="/channel/funhaus">
          Funhaus
        </Link>
        <Link sub href="/channel/rooster-teeth">
          Rooster Teeth
        </Link>
        <Link sub href="/channel/animation">
          Animation
        </Link>
        <Link sub href="/channel/inside-gaming">
          Inside Gaming
        </Link>
        <Link sub href="/channel/death-battle">
          Death Battle
        </Link>
        <Link sub href="/channel/the-yogscast">
          The Yogscast
        </Link>
        <Link sub href="/channel/kinda-funny">
          Kinda Funny
        </Link>
        <Link sub href="/channel/friends-of-rt">
          Friends of RT
        </Link>
      </LinkGroup>
      <Link href="/series">Series</Link>
    </nav>
  )
}

function LinkGroup({
  name,
  basePath,
  children,
}: {
  name: string
  basePath: string | string[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const paths = Array.isArray(basePath) ? basePath : [basePath]
  const isActive = paths.some((path) => router.pathname.startsWith(path))
  const [isOpen, setOpen] = useState(isActive)

  useEffect(() => {
    setOpen(isActive)
  }, [isActive])

  return (
    <>
      <button
        onClick={() => setOpen(!isOpen)}
        className={clsx(
          `text-left uppercase rounded-md focus`,
          `mx-2 my-1 py-1 px-2`,
          `bg-none text-gray-600 dark:text-dark-gray-300 font-bold`,
          `hover:bg-dark-gray-200 dark:hover:bg-dark-gray-700`
        )}
      >
        {name}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="flex flex-col items-stretch flex-nowrap ml-3 pt-1 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `auto`, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Link({
  href,
  sub,
  ...props
}: HTMLProps<HTMLAnchorElement> & { sub?: boolean }) {
  const { asPath } = useRouter()
  const isActive = asPath === href || asPath === props.as

  return (
    <NextLink href={href} passHref>
      <a
        {...props}
        className={clsx(
          props.className,
          `text-left mx-2 my-1 py-1 px-2 rounded-md focus`,
          `text-gray-600 dark:text-dark-gray-300`,
          !sub && `uppercase`,
          sub ? (isActive ? `font-medium` : `font-normal`) : `font-bold`,
          isActive ? `bg-dark-gray-200 dark:bg-dark-gray-700` : `bg-none`,
          `hover:bg-dark-gray-200 dark:hover:bg-dark-gray-700`
        )}
      />
    </NextLink>
  )
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === `dark` || theme === `system`
  return (
    <div className="flex">
      <div className="relative">
        <button
          className={clsx(
            `px-2 py-1 rounded-md focus`,
            `text-gray-600 dark:text-dark-gray-300`,
            `hover:bg-dark-gray-200 dark:hover:bg-dark-gray-700`
          )}
          onClick={() => setTheme(!isDarkMode ? `dark` : `light`)}
        >
          {isDarkMode ? (
            <MoonIcon className="text-gray-400 w-6 h-6" />
          ) : (
            <SunIcon className="text-yellow-500 w-6 h-6 " />
          )}
        </button>
      </div>
    </div>
  )
}
