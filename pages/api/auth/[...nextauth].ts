import { fetcher } from 'lib/fetcher'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: `RoosterTeeth`,
      credentials: {
        username: { label: `Username`, type: `text` },
        password: { label: `Password`, type: `password` },
      },
      async authorize({ username, password }) {
        const user = await login(username, password)

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null or false then the credentials will be rejected
          return null
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],
  callbacks: {
    // Getting the JWT token from API response
    async jwt(token: JWT & RT.AuthUser, user: JWT & RT.AuthUser) {
      // Initial sign in
      if (user) {
        return {
          user,
          accessToken: user.access_token,
          refreshToken: user.refresh_token,
          accessTokenExpires: Date.now() + user.expires_in * 1000,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      return refreshAccessToken(token.refresh_token)
    },
    async session(session, token: JWT & { user: RT.AuthUser }) {
      // @ts-ignore
      session.user = token.user
      session.accessToken = token.user.access_token

      // next-auth ts types are wrong
      return session as any
    },
  },
  session: {
    jwt: true,
    maxAge: 29 * 24 * 60 * 60, // 29 days
  },
  debug: true,
})

async function refreshAccessToken(token: string) {
  const user = await fetcher(`https://auth.roosterteeth.com/oauth/token`, {
    method: `POST`,
    body: JSON.stringify({
      grant_type: `refresh_token`,
      refresh_token: token,
    }),
  })

  const info = await fetcher(
    `https://business-service.roosterteeth.com/api/v1/me`,
    {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  )

  const isRTFirst = info?.attributes?.is_first_plus

  return {
    ...user,
    isRTFirst,
  }
}

async function login(username: string, password: string) {
  const user = await fetcher(`https://auth.roosterteeth.com/oauth/token`, {
    method: `POST`,
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      grant_type: `password`,
      password,
      username,
      scope: `user public`,
    }),
  })

  const info = await fetcher(
    `https://business-service.roosterteeth.com/api/v1/me`,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  )

  const isRTFirst = info?.attributes?.member_tier === `first`
  return {
    ...user,
    isRTFirst,
  }
}

function revokeToken(token: string): Promise<{}> {
  return fetcher(`https://auth.roosterteeth.com/oauth/revoke`, {
    method: `POST`,
    body: JSON.stringify({
      token,
    }),
  }).then((res) => res.json())
}
