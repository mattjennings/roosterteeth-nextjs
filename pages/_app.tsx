import '../css/tailwind.css'
import '../css/global.css'
import 'focus-visible'
import { MenuIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import SideNav from 'components/SideNav'
import { AnimatePresence, motion } from 'framer-motion'
import useScrollRestoration from 'hooks/useScrollRestoration'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect, useMemo, useState } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Hydrate } from 'react-query/hydration'
import { Transition } from '@headlessui/react'
import { Provider } from 'next-auth/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { fetcher } from 'lib/fetcher'

function App({ Component, pageProps, router }: AppProps) {
  const { nav = true, title } = pageProps
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  useScrollRestoration(router)

  useEffect(() => {
    router.events.on(`routeChangeStart`, () => {
      setSidebarOpen(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {},
        },
      }),
    []
  )

  return (
    <React.StrictMode>
      <Head>
        <title>{title ?? `RT`}</title>
      </Head>
      <Provider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ThemeProvider defaultTheme="system" attribute="class">
              <Transition show={isSidebarOpen}>
                <Transition.Child
                  className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-60"
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  aria-hidden
                  onClick={() => setSidebarOpen(false)}
                />

                <Transition.Child
                  className="fixed transform inset-0 z-50 lg:hidden overflow-hidden w-60"
                  enter="transition-transform ease-out duration-200"
                  leave="transition-transform ease-in duration-200"
                  enterFrom="translate-x-[-50vw]"
                  enterTo="translate-x-0"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-[-50vw]"
                >
                  <SideNav />
                </Transition.Child>
              </Transition>

              <div className="flex">
                {nav && (
                  <SideNav
                    className="hidden lg:block sticky flex-grow-0 top-0 bottom-0"
                    style={{
                      flexBasis: `16rem`,
                    }}
                  />
                )}
                <main className="flex-grow" style={{ flexBasis: 0 }}>
                  {/* wrapper div fixes safari position: sticky bug */}
                  <div>
                    {nav && (
                      <div
                        className={clsx(
                          `flex lg:hidden`,
                          `sticky place-items-center border-b p-2 h-16 top-0 left-0 right-0 z-30`,
                          `bg-background border-background`
                        )}
                      >
                        <div className="lg:hidden">
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
            </ThemeProvider>
            {process.env.NODE_ENV === `development` && (
              <ReactQueryDevtools initialIsOpen />
            )}
          </Hydrate>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  )
}
export default App
