import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import MessagingInterface from '../components/MessagingInterface';

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function() {};
});

const dummyUser = { id: 'usr-1', name: 'Current User' };
const dummyContacts = [
  { id: 'usr-2', name: 'Contact 1', year: '2024' },
];

const dummyMessages = [
  { id: 'm1', senderId: 'usr-1', receiverId: 'usr-2', content: 'Message123', timestamp: Date.now() },
];

describe('MessagingInterface Component', () => {
  it('renders correctly with chat tab active by default', () => {
    const { container } = render(
      <MemoryRouter>
        <MessagingInterface 
          currentUser={dummyUser} 
          userRole="student" 
          contacts={dummyContacts} 
          messages={dummyMessages} 
          setMessages={vi.fn()} 
        />
      </MemoryRouter>
    );
    expect(container.textContent).toMatch(/Sohbetler/i);
  });

  it('displays active chats in the sidebar', () => {
    const { container } = render(
      <MemoryRouter>
        <MessagingInterface 
          currentUser={dummyUser} 
          userRole="student" 
          contacts={dummyContacts} 
          messages={dummyMessages} 
          setMessages={vi.fn()} 
        />
      </MemoryRouter>
    );
    expect(container.textContent).toMatch(/Contact 1/i);
  });

  it('shows messages when a contact is selected', async () => {
    const { container } = render(
      <MemoryRouter>
        <MessagingInterface 
          currentUser={dummyUser} 
          userRole="student" 
          contacts={dummyContacts} 
          messages={dummyMessages} 
          setMessages={vi.fn()} 
        />
      </MemoryRouter>
    );
    
    // Find the contact element and click it
    const contactElements = screen.getAllByText('Contact 1');
    fireEvent.click(contactElements[0]);
    
    // Check if the chat message appears
    await waitFor(() => {
      // It should appear at least twice (once in sidebar, once in chat window) or just once if sidebar truncates.
      expect(container.textContent).toMatch(/Message123/i);
    });
  });
});
