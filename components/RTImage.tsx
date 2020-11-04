import React from 'react'
import ProgressiveImage from 'react-progressive-image'
import { Image } from 'RT'
import { SxStyleProp } from 'theme-ui'
import { MotionImage, MotionImageProps } from './MotionComponents'

export interface RTImageProps extends MotionImageProps {
  img: Image
  sx?: SxStyleProp
}

export default function RTImage({ img, sx }: RTImageProps) {
  return (
    <ProgressiveImage
      src={img.attributes.medium}
      placeholder={img.attributes.small}
    >
      {(src) => (
        <MotionImage
          src={src}
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
