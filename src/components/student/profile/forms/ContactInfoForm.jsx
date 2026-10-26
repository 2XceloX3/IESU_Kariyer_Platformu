import React from 'react';

export default function ContactInfoForm({ form }) {
  // Updated save handler to correctly process the form
  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      // Use the proper form submission flow
      await form.handleSubmit();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* İletişim Bilgileri */}
      <div className="space-y-6">
        <button type="submit" data-testid="submit-button">Kaydet</button>
      </div>
    </form>
  );
}
