import React from 'react'
import ProgressiveImage from 'react-progressive-image'
import { SxStyleProp } from 'theme-ui'
import { MotionImage, MotionImageProps } from './MotionComponents'

export interface RTImageProps extends MotionImageProps {
  img: RT.Image
  size?: 'thumb' | 'small' | 'medium' | 'large'
  sx?: SxStyleProp
}

export default function RTImage({
  img,
  sx,
  size = `medium`,
  ...props
}: RTImageProps) {
  return (
    <ProgressiveImage
      src={img.attributes[size]}
      placeholder={img.attributes.small}
    >
      {(src) => (
        <MotionImage
          src={src}
          {...(props as any)}
          sx={{
            ...getImgStyles(img.attributes.image_type),
            ...(sx ?? {}),
          }}
        />
      )}
    </ProgressiveImage>
  )
}

function getImgStyles(imgType: string): SxStyleProp {
  switch (imgType) {
    case `mobile_hero`:
    case `cover`:
    case `title_card`:
    case `profile`:
      return { objectFit: `cover` }
    case `wide`:
      return { objectFit: `fill` }
    case `logo`:
      return { px: 2, objectFit: `contain` }
    default:
      return { objectFit: `contain` }
  }
}
