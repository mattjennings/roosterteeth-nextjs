import Cors from 'cors'
import initMiddleware from './initMiddleware'

export const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)
