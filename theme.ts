import { tailwind } from '@theme-ui/presets'

const colors = { ...tailwind.colors, divider: tailwind.colors.gray[5] }

const darkModeGray = [
  `#111`,
  `#212121`,
  `#424242`,
  `#616161`,
  `#757575`,
  `#9e9e9e`,
  `#bdbdbd`,
  `#e0e0e0`,
  `#eeeeee`,
  `#fafafa`,
]

export const theme = {
  ...tailwind,
  colors: {
    ...colors,
    divider: colors.gray[3],
    modes: {
      dark: {
        background: darkModeGray[0],
        text: darkModeGray[6],
        textMuted: darkModeGray[4],
        divider: darkModeGray[2],
        gray: darkModeGray,
      },
    },
  },
  buttons: {
    ...tailwind.buttons,
    menu: {
      height: 10,
      width: 10,
    },
  },
  styles: {
    ...tailwind.styles,
    hr: {
      ...tailwind.styles.hr,
      backgroundColor: `divider`,
    },
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

    '*': {
      transition: `0.3s background ease`,
    },
  },
}
