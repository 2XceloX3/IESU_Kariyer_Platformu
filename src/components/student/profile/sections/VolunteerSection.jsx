import React, { useState } from 'react';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import { formatDateRange, calculateDuration } from '../../../../utils/format';
import VolunteerForm from '../forms/VolunteerForm';
import SectionCard from './SectionCard';

export default function VolunteerSection({ items = [], onAdd, onUpdate, onDelete, isEditing }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (data) => {
    if (editingId) {
      onUpdate(editingId, data);
      setEditingId(null);
    } else {
      onAdd(data);
      setIsAdding(false);
    }
  };

  return (
    <SectionCard title="Volunteer Experience" icon={Heart} isEditing={isEditing} onAdd={() => setIsAdding(true)}>
      {items.length === 0 && !isAdding && (
        <div className="text-center text-gray-500 py-4">No volunteer experience added yet.</div>
      )}
      {items.map((item) => (
        <div key={item.id} data-testid="volunteer-item" className="mb-4 p-4 border rounded relative group">
          <h4 className="font-semibold">{item.role}</h4>
          <p className="text-sm text-gray-600">{item.organization}</p>
          <p className="text-xs text-gray-400">
            {formatDateRange(item.startDate, item.endDate)} · {calculateDuration(item.startDate, item.endDate)}
          </p>
          {item.description && <p className="mt-2 text-sm">{item.description}</p>}

          {isEditing && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <button
                onClick={() => setEditingId(item.id)}
                data-testid="edit-btn"
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                data-testid="delete-btn"
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
      {(isAdding || editingId) && (
        <VolunteerForm
          onSubmit={handleSubmit}
          initialData={editingId ? items.find((i) => i.id === editingId) : null}
          onCancel={() => { setIsAdding(false); setEditingId(null); }}
        />
      )}
    </SectionCard>
  );
}
