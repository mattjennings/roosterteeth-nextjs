import '../css/tailwind.css'
import './_app.css'
import { Global } from '@emotion/core'
import { useResponsiveValue } from '@theme-ui/match-media'
import clsx from 'clsx'
import MobileOnly from 'components/MobileOnly'
import SideNav from 'components/SideNav'
import { AnimatePresence, motion } from 'framer-motion'
import useScrollRestoration from 'hooks/useScrollRestoration'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { Hydrate } from 'react-query/hydration'
import { MenuButton, ThemeProvider as ThemeUIProvider } from 'theme-ui'
import { theme } from '../theme'
import { ThemeProvider } from 'next-themes'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
function App({ Component, pageProps, router }: AppProps) {
  const { nav = true, title } = pageProps
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const sidebarPosition = useResponsiveValue([`65vw`, `50vw`, `35vw`])
  const [applyTransitionCss, setApplyTransitionCss] = useState(false)

  useScrollRestoration(router)

  useEffect(() => {
    // we want to have a background color transition on all elements,
    // but not on the initial render as it sets your color mode, otherwise you get a FOUC
    setTimeout(() => setApplyTransitionCss(true))

    router.events.on(`routeChangeStart`, () => {
      setSidebarOpen(false)
    })
  }, [])

  return (
    <React.StrictMode>
      <Head>
        <title>{title ?? `RT`}</title>
      </Head>
      {applyTransitionCss && (
        <Global
          styles={{
            '*': {
              transition: `background-color 0.3s ease`,
            },
          }}
        />
      )}
      <ReactQueryCacheProvider>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider defaultTheme="system" attribute="class">
            <ThemeUIProvider theme={theme}>
              <AnimatePresence>
                {isSidebarOpen && (
                  <>
                    <motion.div
                      className="fixed inset-0 z-[99] lg:hidden bg-black"
                      animate={{
                        opacity: 0.35,
                      }}
                      initial={{ opacity: 0 }}
                      exit={{
                        opacity: 0,
                      }}
                      onClick={() => setSidebarOpen(false)}
                    />
                    <motion.div
                      className="fixed inset-0 z-[100] lg:hidden overflow-hidden w-80 sm:w-96"
                      animate={{
                        x: 0,
                      }}
                      initial={{ x: `-${sidebarPosition}` }}
                      exit={{
                        x: `-${sidebarPosition}`,
                      }}
                      transition={{ ease: `easeInOut`, duration: 0.2 }}
                    >
                      <SideNav />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <div className="flex flex-nowrap">
                {nav && (
                  <div className="flex-grow-0 hidden lg:flex w-64">
                    <SideNav />
                  </div>
                )}
                <main className="flex-grow">
                  {/* wrapper div fixes safari position: sticky bug */}
                  <div>
                    {nav && (
                      <div
                        className={clsx(
                          `flex lg:hidden`,
                          `sticky place-items-center border-b p-2 h-16 top-0 left-0 right-0 z-[98]`,
                          `bg-gray-50 border-gray-300 dark:bg-dark-gray-900 dark:border-dark-gray-700`
                        )}
                      >
                        <div className="lg:hidden">
                          {/* <MenuButton onClick={() => setSidebarOpen(true)} /> */}
                          {/* Mobile menu button*/}
                          <button
                            type="button"
                            className={clsx(
                              `w-10 h-10 inline-flex items-center justify-center p-2 rounded-md focus`,
                              `text-gray-700 dark:text-dark-gray-400`
                            )}
                            aria-controls="mobile-menu"
                            aria-expanded={isSidebarOpen}
                            onClick={() => setSidebarOpen(true)}
                          >
                            <span className="sr-only">Open nav menu</span>
                            <MenuIcon />
                          </button>
                        </div>
                        <div />
                      </div>
                    )}
                    <Component {...pageProps} />
                  </div>
                </main>
              </div>
            </ThemeUIProvider>
          </ThemeProvider>
          {process.env.NODE_ENV === `development` && (
            <ReactQueryDevtools initialIsOpen />
          )}
        </Hydrate>
      </ReactQueryCacheProvider>
    </React.StrictMode>
  )
}
export default App
