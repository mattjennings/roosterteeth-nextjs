import clsx from 'clsx'
import format from 'date-fns/format'
import isBefore from 'date-fns/isBefore'
import { HTMLMotionProps, motion } from 'framer-motion'
import { useLocalStorage } from 'hooks/useLocalStorage'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NoSSR from './NoSSR'
import Progress from './Progress'

export interface EpisodeProps extends HTMLMotionProps<'a'> {
  episode: RT.Episode
  showDescription?: boolean
}

export default function EpisodeCard({
  episode,
  showDescription = true,
  ...props
}: EpisodeProps) {
  const title = episode.attributes.title
  const description =
    // caption is often better, but not always there
    episode.attributes.caption || episode.attributes.description
  const link = episode.canonical_links.self
  const date = new Date(episode.attributes.original_air_date)
  const publicDate = new Date(episode.attributes.public_golive_at)
  const isRTFirst =
    !!episode.attributes.public_golive_at &&
    (isBefore(new Date(), new Date(episode.attributes.public_golive_at)) ||
      episode.attributes.is_sponsors_only)

  const [progress] = useLocalStorage(
    `video-progress-${episode.attributes.slug}`,
    0
  )

  const img =
    episode.included.images.find(
      (img) => img.attributes.image_type === `title_card`
    ) ?? episode.included.images[0]

  return (
    <Link href={link} passHref>
      <motion.a
        aria-label={
          isRTFirst
            ? `FIRST members only, available ${format(
                publicDate,
                `MMMM dd, yyyy`
              )}`
            : ``
        }
        {...(props as any)}
        className={clsx(
          props.className,
          `flex flex-col group focus-big relative rounded-lg overlfow-hidden cursor-pointer overflow-hidden`,
          `bg-gray-200 dark:bg-dark-gray-800 shadow`
        )}
      >
        <div className="w-full relative">
          <Image
            className={clsx(
              `transform transition-transform duration-200 ease-linear`,
              `hover:scale-[1.025] group-focus:scale-[1.025]`
            )}
            src={img.attributes.medium}
            width={300 * (16 / 9)}
            height={300}
            layout="responsive"
            alt={title}
          />
          <NoSSR>
            {progress > 0 && (
              <Progress
                className="absolute left-0 right-0 bottom-0"
                value={progress}
              />
            )}
          </NoSSR>
          {isRTFirst && (
            <>
              <div className="flex justify-center items-center absolute inset-0 bg-black opacity-80" />
              <div className="flex flex-col justify-center items-center absolute inset-0 p-4 text-center">
                <p className="font-bold text-white text-5xl lg:text-3xl opacity-80">
                  RT FIRST
                </p>
              </div>
            </>
          )}
        </div>
        <div className="p-2 flex flex-col justify-between flex-grow">
          <div>
            <h6 className="text-lg font-semibold">{title}</h6>
            {showDescription && <p className="text-sm">{description}</p>}
          </div>
          <time
            className="mt-1 text-gray-700 dark:text-dark-gray-600"
            dateTime={isRTFirst ? publicDate.toISOString() : date.toISOString()}
          >
            {format(isRTFirst ? publicDate : date, `MMM dd / yy`)}
          </time>
        </div>
        {props.children}
      </motion.a>
    </Link>
  )
}
