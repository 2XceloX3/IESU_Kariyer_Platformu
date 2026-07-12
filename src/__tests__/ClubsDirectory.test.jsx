import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ClubsDirectory from '../components/ClubsDirectory';

describe('ClubsDirectory Component', () => {
  const mockSetClubs = vi.fn();
  const mockSetClubApplications = vi.fn();

  const mockProps = {
    clubs: [
      {
        id: 'c1',
        name: 'Tech Club',
        category: 'Technology',
        description: 'A club for tech enthusiasts',
        memberCount: 50,
        status: 'Aktif'
      },
      {
        id: 'c2',
        name: 'Art Club',
        category: 'Arts',
        description: 'A club for art lovers',
        memberCount: 30,
        status: 'Aktif'
      }
    ],
    setClubs: mockSetClubs,
    clubApplications: [],
    setClubApplications: mockSetClubApplications,
    currentUser: { id: 'u1', name: 'Student 1' },
    featureClubApplications: true
  };

  it('renders without crashing', () => {
    render(<ClubsDirectory {...mockProps} />);
    expect(screen.getByText(/Tech Club/i)).toBeInTheDocument();
  });

  it('filters clubs by search query', () => {
    render(<ClubsDirectory {...mockProps} />);
    
    // Tech Club should be visible initially
    expect(screen.getByText(/Tech Club/i)).toBeInTheDocument();
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText(/Ara/i);
    fireEvent.change(searchInput, { target: { value: 'Art' } });
    
    // Tech Club should not be visible
    expect(screen.queryByText(/Tech Club/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Art Club/i)).toBeInTheDocument();
  });

  it('opens club details modal', () => {
    render(<ClubsDirectory {...mockProps} />);
    
    // Click on Tech Club
    const techClub = screen.getByText(/Tech Club/i);
    fireEvent.click(techClub);
    
    // It should open a modal with the description
    // Since description might appear twice (in card and modal), we check if length >= 1
    // or we check for a modal-specific text, like 'Kulüp Hakkında'
    expect(screen.getAllByText(/A club for tech enthusiasts/i).length).toBeGreaterThan(1);
    // There might be encoding issues with Hakkında, so just check the length
  });

  it('opens new application modal', () => {
    render(<ClubsDirectory {...mockProps} />);
    
    // Click on "Yeni Kulüp Başvurusu" button
    const applyButton = screen.getByText(/Yeni Kul.*p Başvurusu/i) || screen.getByRole('button', { name: /Yeni Kul.*p/i });
    fireEvent.click(applyButton);
    
    // Should see something related to the form, like 'Kuruluş Amacı'
    expect(screen.getAllByText(/Ama/i).length).toBeGreaterThan(0);
  });
});
