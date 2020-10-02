import React from 'react'
import Flex, { FlexProps } from './Flex'
import NextLink from 'next/link'
import { Box, Divider, Link as ThemeLink, LinkProps } from 'theme-ui'
import { useRouter } from 'next/router'

export default function SideNav(props: FlexProps) {
  return (
    <Flex
      as="nav"
      direction="column"
      align="stretch"
      wrap="nowrap"
      {...(props as any)}
      sx={{
        bg: `background`,
        borderRight: `1px solid`,
        borderColor: `gray.5`,
        px: 2,
        pt: [2, 2, 2, `4.5rem`],
        width: `100%`,
        height: `100vh`,
        overflow: `scroll`,
        ...(props.sx ?? {}),
      }}
    >
      <Link href="/">Home</Link>
      <Divider />
      <Link href="/channel/achievement-hunter">Achievement Hunter</Link>
      <Link href="/channel/funhaus">Funhaus</Link>
      <Link href="/channel/rooster-teeth">Rooster Teeth</Link>
      <Link href="/channel/animation">Animation</Link>
      <Link href="/channel/inside-gaming">Inside Gaming</Link>
      <Link href="/channel/death-battle">Death Battle</Link>
      <Link href="/channel/the-yogscast">The Yogscast</Link>
      <Link href="/channel/kinda-funny">Kinda Funny</Link>
      <Link href="/channel/friends-of-rt">Friends of RT</Link>
      <Link href="/channel/sugar-pine-7">Sugar Pine 7</Link>
      <Link href="/channel/cow-chop">Cow Chop</Link>
    </Flex>
  )
}

function Link({ href, ...props }: LinkProps) {
  const { asPath } = useRouter()

  const isActive = asPath === href || asPath === props.as
  return (
    <NextLink href={href}>
      <ThemeLink
        {...props}
        sx={{
          mx: 2,
          my: 1,
          py: 1,
          px: 2,
          borderRadius: `default`,
          bg: isActive ? `gray.2` : `none`,

          color: `gray.9`,
          fontWeight: isActive ? `semibold` : `normal`,
          fontSize: [1, 2],
          '&:hover': {
            color: `gray.9`,

            bg: `gray.2`,
          },
        }}
      />
    </NextLink>
  )
}
