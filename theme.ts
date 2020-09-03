import { tailwind } from '@theme-ui/presets'

export const theme = {
  ...tailwind,
  styles: {
    ...tailwind.styles,
    progress: {
      color: 'red.6',
      backgroundColor: 'white',
    },
  },
}
