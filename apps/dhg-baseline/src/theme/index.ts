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
  },
  componentGuidelines: {
    spacing: {
      padding: {
        small: 'p-2',
        medium: 'p-4',
        large: 'p-6'
      },
      margin: {
        small: 'm-2',
        medium: 'm-4',
        large: 'm-6'
      }
    }
  },
  patterns: {
    buttons: {
      primary: {
        base: 'bg-blue-600 text-white rounded-md px-4 py-2',
        hover: 'hover:bg-blue-700',
        focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        disabled: 'opacity-50 cursor-not-allowed'
      }
    },
    inputs: {
      text: {
        base: 'border border-gray-300 rounded-md px-3 py-2',
        focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500'
      }
    },
    layout: {
      card: 'bg-white shadow rounded-lg p-6',
      container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      section: 'py-12'
    }
  }
}

export type Theme = typeof theme 