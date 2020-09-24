// import App from "next/app";
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion'
import type { AppProps } from 'next/app'
import { Box, MenuButton, ThemeProvider } from 'theme-ui'
import { theme } from '../theme'
import { ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { Hydrate } from 'react-query/hydration'
import useScrollRestoration from 'hooks/useScrollRestoration'
import React, { useEffect, useState } from 'react'
import SideNav from 'components/SideNav'
import Flex from 'components/Flex'
import { MotionBox } from 'components/MotionComponents'
import Text from 'components/Text'
import Head from 'next/head'
import MobileOnly, { mobileOnlyBreakpoints } from 'components/MobileOnly'
import DesktopOnly, { desktopOnlyBreakpoints } from 'components/DesktopOnly'

function App({ Component, pageProps, router }: AppProps) {
  const { header = true, title } = pageProps
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  useScrollRestoration(router)

  return (
    <React.StrictMode>
      <Head>
        <title>{title ?? 'RT'}</title>
      </Head>
      <ReactQueryCacheProvider>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider theme={theme}>
            <AnimatePresence>
              {isSidebarOpen && (
                <>
                  <MotionBox
                    sx={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 99,
                      display: ['block', 'block', 'none'],
                      bg: 'black',
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
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      zIndex: 100,
                      display: ['flex', 'flex', 'none'],
                      overflow: 'hidden',
                      width: '35vw',
                    }}
                    animate={{
                      x: 0,
                    }}
                    initial={{ x: '-35vw' }}
                    exit={{
                      x: '-35vw',
                    }}
                    transition={{ ease: 'easeInOut', duration: 0.2 }}
                  >
                    <SideNav />
                  </MotionBox>
                </>
              )}
            </AnimatePresence>
            <Flex wrap="nowrap" sx={{ minHeight: '100vh' }}>
              <Box
                sx={{
                  flexBasis: '15rem',
                  flexGrow: 0,
                  display: desktopOnlyBreakpoints('flex'),
                }}
              >
                <SideNav />
              </Box>
              <Box
                as="main"
                sx={{ flexBasis: 0, flexGrow: 1, overflow: 'scroll' }}
              >
                {header && (
                  <Flex
                    align="center"
                    justify="space-between"
                    p={2}
                    sx={{
                      height: 16,
                      bg: 'white',
                      position: 'sticky',
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 98,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <MobileOnly>
                      <MenuButton onClick={() => setSidebarOpen(true)} />
                    </MobileOnly>
                    <DesktopOnly>
                      <Box />
                    </DesktopOnly>
                    <Text fontSize={2} fontWeight="semibold">
                      {title}
                    </Text>
                    <Box />
                  </Flex>
                )}
                <Component {...pageProps} />
              </Box>
            </Flex>
          </ThemeProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen />
          )}
        </Hydrate>
      </ReactQueryCacheProvider>
    </React.StrictMode>
  )
}

export default App
