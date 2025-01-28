export const theme = {
  colors: {
    primary: {
      main: 'blue-600',
      light: 'blue-400',
      dark: 'blue-800',
      highlight: 'blue-300'
    },
    background: {
      main: 'slate-50',
      paper: 'white'
    },
    text: {
      primary: 'slate-900',
      secondary: 'slate-700'
    }
  },
  cursor: {
    interactive: 'cursor-pointer',
    disabled: 'cursor-not-allowed',
    loading: 'cursor-wait',
    text: 'cursor-text'
  }
}

export type Theme = typeof theme 