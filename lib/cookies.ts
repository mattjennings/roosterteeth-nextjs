import { setCookie, parseCookies } from 'nookies'

export interface UserCookie {
  incompleteVideos?: string[]
  favouriteChannels?: string[]
}

export function setUserCookie(
  data: Partial<UserCookie> | ((prev: UserCookie) => Partial<UserCookie>),
  ctx?: any
) {
  const prev = getUserCookie(ctx)

  const newData =
    typeof data === `function`
      ? {
          ...prev,
          ...data(prev),
        }
      : {
          ...prev,
          ...data,
        }

  setCookie(ctx, `user`, JSON.stringify(newData), {
    maxAge: 30 * 24 * 60 * 60,
    sameSite: true,
    path: `/`,
  })

  return newData
}

export function getUserCookie(ctx?: any): UserCookie {
  const cookies = parseCookies(ctx)

  return JSON.parse(cookies?.user ?? `{}`)
}
