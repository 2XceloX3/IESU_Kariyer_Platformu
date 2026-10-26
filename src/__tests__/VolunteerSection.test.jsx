import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VolunteerSection from '../components/student/profile/sections/VolunteerSection';

vi.mock('../components/student/profile/sections/SectionCard', () => ({
  default: ({ title, children, onAdd, isEditing }) => (
    <div data-testid="section-card">
      <h2>{title}</h2>
      {isEditing && <button onClick={onAdd} data-testid="add-btn">Add</button>}
      {children}
    </div>
  )
}));

vi.mock('../components/student/profile/forms/VolunteerForm', () => ({
  default: ({ onSubmit, onCancel, initialData }) => (
    <div data-testid="volunteer-form">
      <button onClick={() => onSubmit({ role: 'New Role', organization: 'New Org' })} data-testid="submit-form-btn">Submit</button>
      <button onClick={onCancel} data-testid="cancel-form-btn">Cancel</button>
      {initialData && <span data-testid="initial-data">{initialData.id}</span>}
    </div>
  )
}));

vi.mock('../utils/format', () => ({
  formatDateRange: () => '2023-01 - 2023-06',
  calculateDuration: () => '6 months',
}));

describe('VolunteerSection Component', () => {
  const mockItems = [
    { id: '1', role: 'Volunteer', organization: 'Red Cross', startDate: '2023-01', endDate: '2023-06' }
  ];

  it('renders the section title correctly', () => {
    render(<VolunteerSection />);
    expect(screen.getByText('Volunteer Experience')).toBeInTheDocument();
  });

  it('displays empty state message when no items and not adding', () => {
    render(<VolunteerSection items={[]} />);
    expect(screen.getByText('No volunteer experience added yet.')).toBeInTheDocument();
  });

  it('renders a list of volunteer items', () => {
    render(<VolunteerSection items={mockItems} />);
    expect(screen.getByText('Volunteer')).toBeInTheDocument();
    expect(screen.getByText('Red Cross')).toBeInTheDocument();
  });

  it('shows add and edit buttons only in editing mode', () => {
    const { rerender } = render(<VolunteerSection items={mockItems} isEditing={false} />);
    expect(screen.queryByTestId('add-btn')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-btn')).not.toBeInTheDocument();

    rerender(<VolunteerSection items={mockItems} isEditing={true} />);
    expect(screen.getByTestId('add-btn')).toBeInTheDocument();
    expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
  });

  it('opens the form when add button is clicked', () => {
    render(<VolunteerSection isEditing={true} />);
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(screen.getByTestId('volunteer-form')).toBeInTheDocument();
  });

  it('calls onAdd when the form is submitted for a new item', async () => {
    const onAddMock = vi.fn();
    render(<VolunteerSection isEditing={true} onAdd={onAddMock} />);
    fireEvent.click(screen.getByTestId('add-btn'));
    fireEvent.click(screen.getByTestId('submit-form-btn'));

    await waitFor(() => {
        expect(onAddMock).toHaveBeenCalledWith({ role: 'New Role', organization: 'New Org' });
    });
  });

  it('opens the form with initial data when edit button is clicked', () => {
    render(<VolunteerSection items={mockItems} isEditing={true} />);
    fireEvent.click(screen.getByTestId('edit-btn'));
    expect(screen.getByTestId('volunteer-form')).toBeInTheDocument();
    expect(screen.getByTestId('initial-data')).toHaveTextContent('1');
  });

  it('calls onUpdate when the form is submitted for an existing item', async () => {
    const onUpdateMock = vi.fn();
    render(<VolunteerSection items={mockItems} isEditing={true} onUpdate={onUpdateMock} />);
    fireEvent.click(screen.getByTestId('edit-btn'));
    fireEvent.click(screen.getByTestId('submit-form-btn'));

    await waitFor(() => {
        expect(onUpdateMock).toHaveBeenCalledWith('1', { role: 'New Role', organization: 'New Org' });
    });
  });

  it('calls onDelete when the delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(<VolunteerSection items={mockItems} isEditing={true} onDelete={onDeleteMock} />);
    fireEvent.click(screen.getByTestId('delete-btn'));
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
});
