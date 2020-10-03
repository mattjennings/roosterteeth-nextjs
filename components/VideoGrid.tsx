import React from 'react'
import { MotionGrid, MotionGridProps } from './MotionComponents'

export default function VideoGrid(props: MotionGridProps) {
  return (
    <MotionGrid
      columns={[1, 2, 3, 3, 4]}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      {...props}
    />
  )
}
