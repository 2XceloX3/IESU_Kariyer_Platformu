import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactInfoForm({ onSave, initialData }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: initialData || {}
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave(data);
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to ensure values are strings (not null/undefined) for inputs
  const val = (name) => {
    const v = form.watch(name);
    return v === null || v === undefined ? '' : v;
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input type="text" {...form.register('name')} />
      <button type="submit" disabled={isLoading}>Save</button>
    </form>
  );
}
