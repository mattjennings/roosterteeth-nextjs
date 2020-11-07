import React, { useEffect, useState } from 'react'
import Flex, { FlexProps } from './Flex'
import NextLink from 'next/link'
import {
  Box,
  Button,
  Divider,
  Link as ThemeLink,
  LinkProps,
  SxStyleProp,
  useColorMode,
} from 'theme-ui'
import { useRouter } from 'next/router'
import Switch from './Switch'
import { FaSun as LightIcon, FaMoon as DarkIcon } from 'react-icons/fa'
import { AnimatePresence } from 'framer-motion'
import { MotionBox, MotionBoxProps, MotionFlex } from './MotionComponents'
import NoSSR from './NoSSR'
import { HiHome as HomeIcon } from 'react-icons/hi'

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
      <Flex justify="space-between" align="center" sx={{ p: 2 }}>
        <Link href="/">
          <Box as={HomeIcon} sx={{ width: 6, height: 6, mt: `4px` }} />
        </Link>
        <NoSSR>
          <ThemeSwitch />
        </NoSSR>
      </Flex>
      <LinkGroup name="Channels" basePath="/channel">
        <Link sub href="/channel/achievement-hunter">
          Achievement Hunter
        </Link>
        <Link sub href="/channel/funhaus">
          Funhaus
        </Link>
        <Link sub href="/channel/rooster-teeth">
          Rooster Teeth
        </Link>
        <Link sub href="/channel/animation">
          Animation
        </Link>
        <Link sub href="/channel/inside-gaming">
          Inside Gaming
        </Link>
        <Link sub href="/channel/death-battle">
          Death Battle
        </Link>
        <Link sub href="/channel/the-yogscast">
          The Yogscast
        </Link>
        <Link sub href="/channel/kinda-funny">
          Kinda Funny
        </Link>
        <Link sub href="/channel/friends-of-rt">
          Friends of RT
        </Link>
      </LinkGroup>
      <Link href="/series">Series</Link>
    </Flex>
  )
}

function LinkGroup({
  name,
  basePath,
  children,
}: {
  name: string
  basePath: string | string[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const paths = Array.isArray(basePath) ? basePath : [basePath]
  const isActive = paths.some((path) => router.pathname.startsWith(path))
  const [isOpen, setOpen] = useState(isActive)

  useEffect(() => {
    setOpen(isActive)
  }, [isActive])

  return (
    <>
      <Button
        onClick={() => setOpen(!isOpen)}
        sx={{
          textAlign: `left`,
          textTransform: `uppercase`,
          background: `none`,
          color: `text`,
          fontWeight: `bold`,
          mx: 2,
          my: 1,
          py: 1,
          px: 2,
          '&:not([disabled]):hover': {
            bg: `gray.2`,
          },
          '&:not([disabled]):focus': {
            outline: `none`,
            bg: `gray.2`,
          },
        }}
      >
        {name}
      </Button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <MotionFlex
            direction="column"
            align="stretch"
            wrap="nowrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: `auto`, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            sx={{ overflow: `hidden`, ml: 3, pt: 1 }}
            transition={{
              duration: 0.3,
            }}
          >
            {children}
          </MotionFlex>
        )}
      </AnimatePresence>
    </>
  )
}

function Link({ href, sub, ...props }: LinkProps & { sub?: boolean }) {
  const { asPath } = useRouter()
  const isActive = asPath === href || asPath === props.as

  return (
    <NextLink href={href} passHref>
      <ThemeLink
        {...props}
        sx={{
          textAlign: `left`,
          textTransform: !sub ? `uppercase` : `unset`,
          background: `none`,
          color: `text`,
          fontWeight: sub ? (isActive ? `medium` : `normal`) : `bold`,

          mx: 2,
          my: 1,
          py: 1,
          px: 2,
          borderRadius: `default`,
          bg: isActive ? `gray.2` : `none`,

          fontSize: 1,
          textDecoration: `none`,
          '&:not([disabled]):hover': {
            color: `text`,
            bg: `gray.2`,
          },
          '&:not([disabled]):focus': {
            outline: `none`,
            bg: `gray.2`,
          },
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
        onChange={() => {
          setColorMode(colorMode === `light` ? `dark` : `light`)
        }}
      />
    </Flex>
  )
}

const styles: Record<string, (isActive: boolean) => SxStyleProp> = {
  mainLink: (isActive: boolean) => ({
    textAlign: `left`,
    textTransform: `uppercase`,
    background: `none`,
    color: `text`,
    fontWeight: `bold`,
    mx: 2,
    py: 1,
    '&:not([disabled]):hover': {
      bg: `gray.2`,
    },
    '&:not([disabled]):focus': {
      outline: `none`,
      bg: `gray.2`,
    },
  }),
}
