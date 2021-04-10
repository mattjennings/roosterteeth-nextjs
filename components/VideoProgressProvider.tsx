import { fetcher } from 'lib/fetcher'
import { useSession } from 'next-auth/client'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useUser } from './UserProvider'

interface VideoProgressContextValue {
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
  const { user } = useUser()

  const queryClient = useQueryClient()

  const { data: videos = [] } = useQuery(
    `/api/user/keep-watching`,
    () => {
      // fetch from db if user is logged in
      if (user) {
        return fetcher<Video[]>(`/api/user/keep-watching`)
      }
      // otherwise get from localstorage
      else {
        return JSON.parse(localStorage.getItem(`keep-watching`) ?? `[]`)
      }
    },
    {
      // whether user is logged in or not, we always write to localstorage, so we can
      // get the initial value from there
      initialData: process.browser
        ? JSON.parse(localStorage.getItem(`keep-watching`) ?? `[]`)
        : [],
    }
  )

  // save to local storage whenever videos is changed
  useEffect(() => {
    localStorage.setItem(`keep-watching`, JSON.stringify(videos))
  }, [videos])

  const setVideoProgress = useCallback(
    ({ slug, progress }: Video) => {
      queryClient.setQueryData<Video[]>(
        `/api/user/keep-watching`,
        (prev = []) => {
          const isRemoving = progress === 0

          if (isRemoving) {
            return prev.filter((v) => v.slug !== slug)
          } else {
            const index = prev.findIndex((v) => v.slug === slug)

            if (index === -1) {
              return [...prev, { slug, progress }]
            }

            return [
              ...prev.slice(0, index),
              { slug, progress },
              ...prev.slice(index + 1),
            ]
          }
        }
      )

      // if user is logged in, save to db
      if (user) {
        fetcher(`/api/user/set-video-progress`, {
          method: `POST`,
          body: JSON.stringify({ slug, progress }),
        }).catch(console.error)
      }
    },
    [queryClient, user]
  )

  const getVideoProgress = useCallback(
    (slug: string) => {
      return videos.find((v) => v.slug == slug)?.progress ?? 0
    },
    [videos]
  )

  const removeVideo = useCallback(
    (slug: string) => {
      return setVideoProgress({ slug, progress: 0 })
    },
    [setVideoProgress]
  )

  const value = useMemo<VideoProgressContextValue>(
    () => ({
      videos: videos ?? [],
      setVideoProgress,
      getVideoProgress,
      removeVideo,
    }),
    [videos, setVideoProgress, getVideoProgress, removeVideo]
  )

  return (
    <VideoProgressContext.Provider value={value}>
      {children}
    </VideoProgressContext.Provider>
  )
}
