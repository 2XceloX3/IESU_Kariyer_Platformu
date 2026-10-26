import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NewsPage from '../../pages/NewsPage';

describe('NewsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('handles error path when fetchNews throws', async () => {
    const mockError = new Error('Network failure');
    const fetchNewsMock = vi.fn().mockRejectedValue(mockError);

    render(<NewsPage fetchNews={fetchNewsMock} />);

    // Initially loading
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();

    // Wait for the error to be caught and displayed
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Haberler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    });

    // Ensure console.error was called with the right arguments
    expect(console.error).toHaveBeenCalledWith('[NewsPage] Haberler yüklenirken hata:', mockError);

    // Ensure loading state is false in finally block
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
  });

  it('handles happy path when fetchNews succeeds', async () => {
      const mockNews = [
          {
              title: "Test News",
              createdAt: { seconds: 1672531200 }, // 2023-01-01
              publishedAt: { seconds: 1672531200 },
          }
      ];
      const fetchNewsMock = vi.fn().mockResolvedValue(mockNews);

      render(<NewsPage fetchNews={fetchNewsMock} />);

      await waitFor(() => {
          expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
      });

      const newsItems = screen.getAllByTestId('news-item');
      expect(newsItems).toHaveLength(1);
      expect(screen.getByText('Test News')).toBeInTheDocument();
  });

  it('handles missing dates and images gracefully', async () => {
      const mockNews = [
          {
              title: "No Date News",
          }
      ];
      const fetchNewsMock = vi.fn().mockResolvedValue(mockNews);

      render(<NewsPage fetchNews={fetchNewsMock} />);

      await waitFor(() => {
          expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
      });

      const newsItems = screen.getAllByTestId('news-item');
      expect(newsItems).toHaveLength(1);
      expect(screen.getByText('No Date News')).toBeInTheDocument();
      // Should use current date as fallback and unsplash placeholder image
      const img = screen.getByAltText('No Date News');
      expect(img).toHaveAttribute('src', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop');
  });
});
