import { setCookie, parseCookies } from 'nookies'

export interface UserCookie {
  recentVideos: string[]
  favouriteChannels: string[]
}

export function setUserCookie(data: Partial<UserCookie>, ctx?: any) {
  const prev = getUserCookie(ctx)

  const newData = {
    ...prev,
    ...data,
  }
  setCookie(ctx, `user`, JSON.stringify(newData), {
    maxAge: 30 * 24 * 60 * 60,
    sameSite: true,
  })

  return newData
}

export function getUserCookie(ctx?: any) {
  const cookies = parseCookies(ctx)

  return JSON.parse(cookies?.user ?? `{}`)
}
