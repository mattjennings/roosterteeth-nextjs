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

export const MotionBox = motion.custom(Box)
export type MotionBoxProps = BoxProps & MotionProps

export const MotionFlex = motion.custom(Flex)
export type MotionFlexProps = FlexProps & MotionProps

export const MotionGrid = motion.custom(Grid)
export type MotionGridProps = GridProps & MotionProps

export const MotionButton = motion.custom(Button)
export type MotionButtonProps = ButtonProps & MotionProps

export const MotionText = motion.custom(Text)
export type MotionTextProps = TextProps & MotionProps

export const MotionImage = motion.custom(Image)
export type MotionImageProps = ImageProps & MotionProps
