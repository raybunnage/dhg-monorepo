import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../src/pages/LoginPage';
import { theme } from '../../src/theme';

describe('LoginPage Theme', () => {
  it('should apply theme styles correctly', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Check button styling
    const button = screen.getByRole('button');
    expect(button.className).toContain(theme.patterns.buttons.primary.base);
    expect(button.className).toContain(theme.patterns.buttons.primary.hover);

    // Check input styling
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input.className).toContain(theme.patterns.inputs.text.base);
      expect(input.className).toContain(theme.cursor.text);
    });
  });
}); 