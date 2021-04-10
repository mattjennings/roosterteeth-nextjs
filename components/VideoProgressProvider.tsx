import { fetcher } from 'lib/fetcher'
import { useSession } from 'next-auth/client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useUser } from './UserProvider'

interface VideoProgressContextValue {
  loading: boolean
  videos: Video[]
  setVideoProgress: (args: { slug: string; progress: number }) => any
  getVideoProgress: (slug: string) => number
  removeVideo: (slug: string) => any
}

interface Video {
  slug: string
  progress: number
}
const VideoProgressContext = React.createContext<VideoProgressContextValue>(
  {} as any
)
export const useVideoProgress = () => useContext(VideoProgressContext)

export default function VideoProgressProvider({ children }) {
  const { user, loading } = useUser()

  const queryClient = useQueryClient()

  const { data: videos = [], isFetched } = useQuery<Video[]>(
    `/api/user/keep-watching`,
    () => {
      // if user is logged in, get from db
      if (user) {
        return fetcher(`/api/user/keep-watching`)
      }
      // otherwise, get from localstorage
      else {
        return Promise.resolve(
          JSON.parse(localStorage.getItem(`keep-watching`) ?? `[]`)
        )
      }
    },
    {
      enabled: !loading,
    }
  )

  const { mutate: setVideoProgress } = useMutation(
    `/api/user/set-video-progress`,
    (args: { slug: string; progress: number }) => {
      // if user is logged in, save to db
      if (user) {
        return fetcher(`/api/user/set-video-progress`, {
          method: `POST`,
          body: JSON.stringify(args),
        })
      }
      // else, save to localstorage
      else {
        localStorage.setItem(
          `keep-watching`,
          JSON.stringify(updateVideosArray(videos, args))
        )
      }
    },
    {
      onSuccess: (data, { slug, progress }) => {
        queryClient.setQueryData(
          `/api/user/keep-watching`,
          (prev: Video[] = []) => updateVideosArray(prev, { slug, progress })
        )
      },
    }
  )

  const value = useMemo<VideoProgressContextValue>(
    () => ({
      loading: !isFetched,
      videos,
      setVideoProgress,
      getVideoProgress(slug) {
        return videos.find((v) => v.slug == slug)?.progress ?? 0
      },
      removeVideo(slug) {
        return setVideoProgress({ slug, progress: 0 })
      },
    }),
    [isFetched, videos, setVideoProgress]
  )

  return (
    <VideoProgressContext.Provider value={value}>
      {children}
    </VideoProgressContext.Provider>
  )
}

/**
 * Returns the updated array of videos with the new progress for the slug
 */
function updateVideosArray(
  videos: Video[],
  { slug, progress }: { slug: string; progress: number }
) {
  const isRemoving = progress === 0

  if (isRemoving) {
    return videos.filter((v) => v.slug !== slug)
  } else {
    const index = videos.findIndex((v) => v.slug === slug)

    if (index === -1) {
      return [...videos, { slug, progress }]
    }

    return [
      ...videos.slice(0, index),
      { slug, progress },
      ...videos.slice(index + 1),
    ]
  }
}
