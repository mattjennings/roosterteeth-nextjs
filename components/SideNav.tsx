import React from 'react'
import Flex, { FlexProps } from './Flex'
import NextLink from 'next/link'
import { Link as ThemeLink, LinkProps } from 'theme-ui'

export default function SideNav(props: FlexProps) {
  return (
    <Flex
      align="center"
      justify="flex-end"
      {...(props as any)}
      sx={{
        bg: 'background',
        borderRight: '1px solid',
        borderColor: 'gray.5',
        px: 2,
        width: '100%',
        height: '100vh',
        ...(props.sx ?? {}),
      }}
    ></Flex>
  )
}

function Link(props: LinkProps) {
  return (
    <ThemeLink
      {...props}
      mx={2}
      sx={{
        color: 'gray.9',
        textTransform: 'uppercase',
        fontWeight: 'medium',
        fontSize: 2,
        '&:hover': {
          color: 'gray.7',
        },
      }}
    />
  )
}
