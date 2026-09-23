import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Student Hive.
 * Adheres strictly to the Hive Color Identity Map (#990000, red).
 */
export const DEFAULT_STUDENT_HIVE = Object.freeze({
  hiveColor: '#990000',
  hiveName: 'student',
  hiveAccent: 'red',
  lightBg: 'bg-red-50',
  borderAccent: 'border-red-200',
  textColor: 'text-[#990000]',
  primaryBg: 'bg-[#990000]',
  hoverBg: 'hover:bg-red-800',
  badgeClass: 'bg-red-50 text-[#990000] border-red-200',
  ringColor: 'focus:ring-red-500',
  label: 'Student',
  labelTr: 'Öğrenci',
  icon: '🎓'
});

export const HiveContext = createContext(DEFAULT_STUDENT_HIVE);

/**
 * Student Hive Provider.
 * Allows partial or complete overrides via the `value` prop while
 * ensuring defaults are always preserved.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_STUDENT_HIVE, ...value } : DEFAULT_STUDENT_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Student Hive context.
 * Guarantees a safe fallback to DEFAULT_STUDENT_HIVE if called outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_STUDENT_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as StudentHiveContext, HiveProvider as StudentHiveProvider };
export default HiveContext;
