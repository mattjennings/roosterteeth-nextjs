// import App from "next/app";
import type { AppProps } from 'next/app'
import { Box, ThemeProvider } from 'theme-ui'
import { theme } from '../theme'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh' }}>
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  )
}

export default App
