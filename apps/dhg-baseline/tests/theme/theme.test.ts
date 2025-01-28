import { describe, it, expect } from 'vitest'
import { theme } from '../../src/theme'

describe('Theme', () => {
  it('should have required color properties', () => {
    expect(theme.colors.primary.main).toBeDefined()
    expect(theme.colors.primary.light).toBeDefined()
    expect(theme.colors.primary.dark).toBeDefined()
    expect(theme.colors.background.main).toBeDefined()
    expect(theme.colors.text.primary).toBeDefined()
  })

  it('should have required cursor properties', () => {
    expect(theme.cursor.interactive).toBe('cursor-pointer')
    expect(theme.cursor.disabled).toBe('cursor-not-allowed')
    expect(theme.cursor.loading).toBe('cursor-wait')
    expect(theme.cursor.text).toBe('cursor-text')
  })
}) 