import { MotionGrid } from 'components/MotionComponents'
import ShowCard from 'components/ShowCard'
import Text from 'components/Text'
import { AnimatePresence } from 'framer-motion'
import { fetcher } from 'lib/fetcher'
import { GetServerSideProps } from 'next'
import React from 'react'
import { SearchResponse, Show } from 'RT'
import { Box } from 'theme-ui'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const [popularShows] = await Promise.all([
    fetcher(`/api/shows?order_by=attributes.trending_score&page=1&per_page=8`, {
      ctx,
    }),
  ])

  return {
    props: {
      title: `Home`,
      popularShows,
    },
  }
}

export default function Home({
  popularShows,
}: {
  popularShows: SearchResponse<Show>
}) {
  return (
    <Box>
      <AnimatePresence initial={false} exitBeforeEnter>
        <Box p={3}>
          <Text fontWeight="medium" fontSize={4} mb={1}>
            Popular Series
          </Text>
          <MotionGrid
            columns={[1, 2, 3, 3, 4]}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            {popularShows.data.map((show) => (
              <ShowCard key={show.id} show={show} sx={{ height: 300 }} />
            ))}
          </MotionGrid>
        </Box>
      </AnimatePresence>
    </Box>
  )
}
