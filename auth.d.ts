import 'next-auth'

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends RT.AuthUser {
    isRTFirst?: boolean
  }
}
