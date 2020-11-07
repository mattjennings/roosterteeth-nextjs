import './_app.css'
import { useResponsiveValue } from '@theme-ui/match-media'
import { desktopOnlyBreakpoints } from 'components/DesktopOnly'
import Flex from 'components/Flex'
import MobileOnly, { mobileOnlyBreakpoints } from 'components/MobileOnly'
import { MotionBox } from 'components/MotionComponents'
import SideNav from 'components/SideNav'
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import useScrollRestoration from 'hooks/useScrollRestoration'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { Hydrate } from 'react-query/hydration'
import { Box, MenuButton, ThemeProvider } from 'theme-ui'
import { theme } from '../theme'
import { Global } from '@emotion/core'

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
          <ThemeProvider theme={theme}>
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <MotionBox
                    sx={{
                      position: `fixed`,
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 99,
                      display: mobileOnlyBreakpoints(),
                      bg: `black`,
                    }}
                    animate={{
                      opacity: 0.35,
                    }}
                    initial={{ opacity: 0 }}
                    exit={{
                      opacity: 0,
                    }}
                    onClick={() => setSidebarOpen(false)}
                  />
                  <MotionBox
                    sx={{
                      position: `fixed`,
                      top: 0,
                      left: 0,
                      bottom: 0,
                      zIndex: 100,
                      display: mobileOnlyBreakpoints(`flex`),
                      overflow: `hidden`,
                      width: sidebarPosition,
                    }}
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
                  </MotionBox>
                </>
              )}
            </AnimatePresence>
            <Flex wrap="nowrap">
              {nav && (
                <Box
                  sx={{
                    position: `sticky`,
                    top: 0,
                    flexBasis: `16rem`,
                    flexGrow: 0,
                    display: desktopOnlyBreakpoints(`flex`),
                  }}
                >
                  <SideNav />
                </Box>
              )}
              <Box
                as="main"
                sx={{
                  flexBasis: 0,
                  flexGrow: 1,
                }}
              >
                {/* wrapper div fixes safari position: sticky bug */}
                <div>
                  {nav && (
                    <Flex
                      align="center"
                      p={2}
                      sx={{
                        height: 16,
                        bg: `background`,
                        position: `sticky`,
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 98,
                        borderBottom: `1px solid`,
                        borderColor: `divider`,
                        display: mobileOnlyBreakpoints(),
                      }}
                    >
                      <MobileOnly>
                        <MenuButton onClick={() => setSidebarOpen(true)} />
                      </MobileOnly>
                      <Box />
                    </Flex>
                  )}
                  <Component {...pageProps} />
                </div>
              </Box>
            </Flex>
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
