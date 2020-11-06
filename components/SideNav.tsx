import React from 'react'
import Flex, { FlexProps } from './Flex'
import NextLink from 'next/link'
import {
  Box,
  Divider,
  Link as ThemeLink,
  LinkProps,
  useColorMode,
} from 'theme-ui'
import { useRouter } from 'next/router'
import Switch from './Switch'
import { FaSun as LightIcon, FaMoon as DarkIcon } from 'react-icons/fa'
import { AnimatePresence } from 'framer-motion'
import { MotionBox, MotionBoxProps } from './MotionComponents'
import NoSSR from './NoSSR'

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
        borderColor: `divider`,
        px: 2,
        pt: 2,
        width: `100%`,
        height: `100vh`,
        overflow: `scroll`,
        ...(props.sx ?? {}),
      }}
    >
      <Flex justify="flex-end" sx={{ p: 2 }}>
        <NoSSR>
          <ThemeSwitch />
        </NoSSR>
      </Flex>
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
    </Flex>
  )
}

function Link({ href, ...props }: LinkProps) {
  const { asPath } = useRouter()

  const isActive = asPath === href || asPath === props.as
  return (
    <NextLink href={href} passHref>
      <ThemeLink
        {...props}
        sx={{
          mx: 2,
          my: 1,
          py: 1,
          px: 2,
          borderRadius: `default`,
          bg: isActive ? `gray.2` : `none`,

          color: `text`,
          fontWeight: isActive ? `semibold` : `normal`,
          fontSize: [1, 2],
          '&:hover': {
            color: `text`,

            bg: `gray.2`,
          },
          textDecoration: `none`,
        }}
      />
    </NextLink>
  )
}

function ThemeSwitch() {
  const [colorMode, setColorMode] = useColorMode()

  const iconProps: MotionBoxProps = {
    variants: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    initial: `initial`,
    animate: `animate`,
    exit: `exit`,
    transition: {
      duration: 0.15,
    },
    sx: {
      position: `absolute`,
      left: -4,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  return (
    <Flex>
      <Box sx={{ position: `relative` }}>
        <AnimatePresence initial={false} exitBeforeEnter>
          {colorMode === `dark` ? (
            <MotionBox key="dark" {...(iconProps as any)}>
              <Box
                as={DarkIcon}
                sx={{ color: `gray.4`, width: 5, height: 5, mt: `2px` }}
              />
            </MotionBox>
          ) : (
            <MotionBox key="light" {...(iconProps as any)}>
              <Box
                as={LightIcon}
                sx={{ color: `yellow.5`, width: 6, height: 6 }}
              />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Switch
        checked={colorMode === `dark`}
        onChange={(e) => {
          setColorMode(e.currentTarget.checked ? `dark` : `default`)
        }}
      />
    </Flex>
  )
}
