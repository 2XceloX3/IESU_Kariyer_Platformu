import React from 'react';

export default function SectionCard({ title, icon: Icon, isEditing, onAdd, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="text-gray-400" size={20} />}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        {isEditing && (
          <button
            onClick={onAdd}
            data-testid="add-btn"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            Add
          </button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
