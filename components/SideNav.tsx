import React from 'react'
import Flex, { FlexProps } from './Flex'
import NextLink from 'next/link'
import { Box, Divider, Link as ThemeLink, LinkProps } from 'theme-ui'

export default function SideNav(props: FlexProps) {
  return (
    <Flex
      as="nav"
      direction="column"
      align="stretch"
      {...(props as any)}
      sx={{
        bg: 'background',
        borderRight: '1px solid',
        borderColor: 'gray.5',
        px: 2,
        pt: [2, 2, 2, '4rem'],
        width: '100%',
        height: '100vh',
        ...(props.sx ?? {}),
      }}
    >
      <Link href="/">Home</Link>
      <Divider />
      <Link href="/channel/achievement-hunter">Achievement Hunter</Link>
      <Link href="/channel/funhaus">Funhaus</Link>
    </Flex>
  )
}

function Link({ href, ...props }: LinkProps) {
  return (
    <NextLink href={href}>
      <ThemeLink
        {...props}
        mx={2}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 'default',
          color: 'gray.9',
          fontWeight: 'medium',
          fontSize: [1, 2],
          '&:hover': {
            color: 'inherit',
            bg: 'gray.2',
          },
        }}
      />
    </NextLink>
  )
}
