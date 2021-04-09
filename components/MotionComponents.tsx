import { motion, MotionProps } from 'framer-motion'
import {
  Box,
  BoxProps,
  Grid,
  GridProps,
  Button,
  ButtonProps,
  Image,
  ImageProps,
} from 'theme-ui'
import Text, { TextProps } from './Text'
import Flex, { FlexProps } from './Flex'

export const MotionBox = motion(Box)
export type MotionBoxProps = BoxProps & MotionProps

export const MotionFlex = motion(Flex)
export type MotionFlexProps = FlexProps & MotionProps

export const MotionGrid = motion(Grid)
export type MotionGridProps = GridProps & MotionProps

export const MotionButton = motion(Button)
export type MotionButtonProps = ButtonProps & MotionProps

export const MotionText = motion(Text)
export type MotionTextProps = TextProps & MotionProps

export const MotionImage = motion(Image)
export type MotionImageProps = ImageProps & MotionProps
