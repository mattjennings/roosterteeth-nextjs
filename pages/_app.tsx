import type { AppProps } from 'next/app'
import { Box, ThemeProvider } from 'theme-ui'
import { theme } from '../theme'
import { ReactQueryCacheProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query-devtools'
import { Hydrate } from 'react-query/hydration'
import useScrollRestoration from 'hooks/useScrollRestoration'
import React, { useEffect } from 'react'

function App({ Component, pageProps, router }: AppProps) {
  useScrollRestoration(router)

  return (
    <React.StrictMode>
      <ReactQueryCacheProvider>
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider theme={theme}>
            <Box sx={{ minHeight: '100vh' }}>
              <Component {...pageProps} />
            </Box>
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
