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
    expect(button.className).toContain('bg-blue-600'); // Part of primary.base
    expect(button.className).toContain('hover:bg-blue-700');

    // Check input styling
    const inputs = screen.getAllByRole('textbox', { hidden: true });
    inputs.forEach(input => {
      expect(input.className).toContain('border-gray-300');
      expect(input.className).toContain('cursor-text');
    });
  });
}); 