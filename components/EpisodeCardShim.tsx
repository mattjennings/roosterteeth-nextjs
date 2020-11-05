// import { useResponsiveValue } from '@theme-ui/match-media'
// import format from 'date-fns/format'
// import isBefore from 'date-fns/isBefore'
// import Link from 'next/link'
// import React, { useEffect, useState } from 'react'
// import { Box, Progress } from 'theme-ui'
// import Flex from './Flex'
// import { MotionFlex, MotionFlexProps, MotionImage } from './MotionComponents'
// import NoSSR from './NoSSR'
// import Text from './Text'
// import ProgressiveImage from 'react-progressive-image'
// import RTImage from './RTImage'

// export default function EpisodeCardShim(props: MotionFlexProps) {
//   return (
//     <MotionFlex
//       as="a"
//       direction="column"
//       sx={{
//         borderRadius: `lg`,
//         bg: `gray.2`,
//         overflow: `hidden`,
//         cursor: `pointer`,
//         color: `inherit`,
//         textDecoration: `none`,
//       }}
//       {...(props as any)}
//     >
//       <Box
//         sx={{
//           overflow: `hidden`,
//           width: `100%`,
//           position: `relative`,
//         }}
//       >
//         <Box sx={{ position: `static` }}>
//           <RTImage
//             img={episode.included.images[0]}
//             sx={{
//               width: `100%`,
//               height: `auto`,
//               filter: isRTFirst ? `brightness(30%)` : undefined,
//             }}
//           />
//         </Box>
//         <NoSSR>
//           <Progress
//             sx={{
//               position: `absolute`,
//               left: 0,
//               right: 0,
//               bottom: 1,
//             }}
//             max={1}
//             value={progress}
//           />
//         </NoSSR>
//         {isRTFirst && (
//           <Flex
//             center
//             sx={{
//               position: `absolute`,
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//             }}
//           >
//             <Text fontWeight="bold" color="white" fontSize={3}>
//               RT FIRST
//             </Text>
//           </Flex>
//         )}
//       </Box>
//       <Flex
//         p={2}
//         direction="column"
//         justify="space-between"
//         sx={{ flexGrow: 1 }}
//       >
//         <Box>
//           <Text fontSize={2} fontWeight="semibold">
//             {title}
//           </Text>
//           <Text fontSize={0}>{caption}</Text>
//         </Box>
//         <Text fontSize={0} mt={2} color="textMuted">
//           {format(isRTFirst ? publicDate : date, `MMM dd / yy`)}
//         </Text>
//       </Flex>
//     </MotionFlex>
//   )
// }
