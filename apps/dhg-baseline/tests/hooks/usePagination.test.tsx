import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      totalItems: 100,
      itemsPerPage: 10,
      initialPage: 1,
      ...props
    };
    
    return renderHook(() => usePagination(defaultProps));
  };

  it('should initialize with correct values', () => {
    const { result } = setup();
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(false);
  });

  it('should calculate correct page items', () => {
    const { result } = setup();
    
    expect(result.current.pageItems).toEqual({
      start: 0,
      end: 10
    });
  });

  it('should handle next page navigation', () => {
    const { result } = setup();
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems).toEqual({
      start: 10,
      end: 20
    });
  });

  it('should handle previous page navigation', () => {
    const { result } = setup({ initialPage: 2 });
    
    act(() => {
      result.current.prevPage();
    });
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasPrevPage).toBe(false);
  });

  it('should not go beyond total pages', () => {
    const { result } = setup({ totalItems: 20, itemsPerPage: 10 });
    
    act(() => {
      result.current.nextPage();
    });
    
    expect(result.current.currentPage).toBe(2);
    expect(result.current.hasNextPage).toBe(false);
    
    act(() => {
      result.current.nextPage(); // Should not go to page 3
    });
    
    expect(result.current.currentPage).toBe(2);
  });

  it('should handle direct page navigation', () => {
    const { result } = setup();
    
    act(() => {
      result.current.goToPage(5);
    });
    
    expect(result.current.currentPage).toBe(5);
    expect(result.current.pageItems).toEqual({
      start: 40,
      end: 50
    });
  });
}); 