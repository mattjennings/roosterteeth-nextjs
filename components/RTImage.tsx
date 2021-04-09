import NextImage from 'next/image'
import React from 'react'

export interface RTImageProps extends ImageProps {
  img: RT.Image
}

export default function RTImage({ img, ...props }: RTImageProps) {
  return <NextImage src={img.attributes.large} {...(props as any)} />
}

type ImageProps = Omit<
  JSX.IntrinsicElements['img'],
  'src' | 'srcSet' | 'ref' | 'width' | 'height' | 'loading'
> & {
  quality?: number | string
  priority?: boolean
  loading?: 'lazy' | 'eager'
  unoptimized?: boolean
  width?: number | string
  height?: number | string
  layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive'
}
