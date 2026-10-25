/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import StudentProfileUpdate from '../components/profile/StudentProfileUpdate';
import ProfileUpdate from '../components/ProfileUpdate';
import useAppStore from '../store/useAppStore';

describe('Profile Update components stress test with various user payloads', () => {
  const usersToTest = [
    { id: 'admin_1513', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin' },
    { id: 'admin_1513', name: 'Kariyer Geliştirme Koordinatörlüğü', role: 'admin', skills: null, languages: null, clubs: null },
    { id: 'cmp_1', name: 'Trendyol', role: 'company' },
    { id: 'emp_1', name: 'Aselsan', role: 'employer' },
    { id: 'stu_1', name: 'Ali', role: 'student' },
    { id: 'stu_2', name: 'Veli', role: 'student', skills: 'React, Node', languages: 'İngilizce' }, // string instead of array!
    { id: 'alu_1', name: 'Ayşe', role: 'alumni' },
    { id: 'acad_1', name: 'Prof. Ahmet', role: 'academic' },
    {},
    null,
    undefined
  ];

  it('renders StudentProfileUpdate safely with all user shapes', () => {
    for (const u of usersToTest) {
      const { unmount } = render(
        <StudentProfileUpdate 
          currentUser={u}
          userRole="student"
          setView={vi.fn()}
        />
      );
      unmount();
    }
  });

  it('renders ProfileUpdate safely with all user shapes and roles', () => {
    for (const u of usersToTest) {
      for (const role of ['admin', 'company', 'alumni', 'student', 'academic']) {
        const { unmount } = render(
          <ProfileUpdate 
            currentUser={u}
            userRole={role}
            setView={vi.fn()}
          />
        );
        unmount();
      }
    }
  });
});
