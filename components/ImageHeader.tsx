import React from 'react'
import { MotionImage, MotionImageProps } from './MotionComponents'

export default function ImageHeader({
  img,
  title,
  ...props
}: {
  img: string
  title: string
} & MotionImageProps) {
  return (
    <MotionImage
      src={img}
      alt={title}
      {...(props as any)}
      sx={{
        width: `100%`,
        height: `10vw`,
        objectFit: `cover`,
        ...(props.sx ?? {}),
      }}
    />
  )
}
