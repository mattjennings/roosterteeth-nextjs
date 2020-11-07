import { tailwind } from '@theme-ui/presets'
import { Theme } from 'theme-ui'

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

export const theme: Theme = {
  initialColorModeName: `dark`,
  ...tailwind,
  colors: {
    ...colors,
    // default color is dark mode
    background: darkModeGray[0],
    text: darkModeGray[6],
    textMuted: darkModeGray[4],
    divider: darkModeGray[2],
    gray: darkModeGray,

    modes: {
      light: {
        ...colors,
        divider: colors.gray[3],
      },
    },
  },
  buttons: {
    ...tailwind.buttons,
    primary: {
      '&:not([disabled])': {
        cursor: `pointer`,
      },
    },
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
