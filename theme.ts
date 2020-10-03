import { tailwind } from '@theme-ui/presets'

const colors = { ...tailwind.colors, divider: tailwind.colors.gray[5] }
export const theme = {
  ...tailwind,
  useColorSchemeMediaQuery: true,
  colors,
  buttons: {
    ...tailwind.buttons,
    menu: {
      height: 10,
      width: 10,
    },
    icon: {
      height: 10,
      width: 10,
    },
  },
  styles: {
    ...tailwind.styles,
    progress: {
      color: `red.6`,
      backgroundColor: `white`,
    },
    a: {
      color: colors.blue[6],
      '&:hover': {
        cursor: `pointer`,
        color: colors.blue[4],
      },
    },
  },
}
