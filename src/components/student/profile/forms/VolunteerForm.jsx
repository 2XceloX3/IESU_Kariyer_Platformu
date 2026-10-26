import React, { useState } from 'react';

export default function VolunteerForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(
    initialData || { role: '', organization: '', startDate: '', endDate: '', description: '' }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="volunteer-form" className="space-y-4 p-4 border rounded mt-4">
      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Organization</label>
        <input
          type="text"
          value={formData.organization}
          onChange={(e) => setFormData({...formData, organization: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded" data-testid="cancel-form-btn">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" data-testid="submit-form-btn">Submit</button>
      </div>
    </form>
  );
}
