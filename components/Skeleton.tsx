import React from 'react'
import { Box, BoxProps, useThemeUI } from 'theme-ui'
import LoadingSkeleton, {
  SkeletonProps as LoadingSkeletonProps,
  SkeletonTheme,
} from 'react-loading-skeleton'

export interface SkeletonProps extends BoxProps, LoadingSkeletonProps {
  width?: number
  height?: number
}

export default function Skeleton({ sx, ...props }: SkeletonProps) {
  const { theme } = useThemeUI()

  return (
    <SkeletonTheme
      color={theme.colors.gray[2]}
      highlightColor={theme.colors.gray[3]}
    >
      <Box
        as={LoadingSkeleton}
        {...(props as any)}
        sx={{
          ...(sx ?? {}),
        }}
      />
    </SkeletonTheme>
  )
}
