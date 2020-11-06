import React from 'react'
import { Box, BoxProps, useThemeUI } from 'theme-ui'
import LoadingSkeleton, {
  SkeletonProps as LoadingSkeletonProps,
  SkeletonTheme,
} from 'react-loading-skeleton'
import { useResponsiveValue } from '@theme-ui/match-media'

export interface SkeletonProps
  extends BoxProps,
    Omit<LoadingSkeletonProps, 'height' | 'width'> {
  width?: number | string | Array<number | string>
  height?: number | string | Array<number | string>
}

export default function Skeleton({ width, height, ...props }: SkeletonProps) {
  const { theme } = useThemeUI()

  const responsiveWidth = useResponsiveValue(
    Array.isArray(width) ? width : [width]
  )
  const responsiveHeight = useResponsiveValue(
    Array.isArray(height) ? height : [height]
  )

  return (
    <SkeletonTheme
      color={theme.colors.gray[2]}
      highlightColor={theme.colors.gray[3]}
    >
      <Box
        as={LoadingSkeleton}
        width={responsiveWidth}
        height={responsiveHeight}
        {...(props as any)}
      />
    </SkeletonTheme>
  )
}
