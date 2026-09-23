import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Academic Hive.
 * Adheres strictly to the Hive Color Identity Map (#7c3aed, violet).
 */
export const DEFAULT_ACADEMIC_HIVE = Object.freeze({
  hiveColor: '#7c3aed',
  hiveName: 'academic',
  hiveAccent: 'violet',
  lightBg: 'bg-violet-50',
  borderAccent: 'border-violet-200',
  textColor: 'text-[#7c3aed]',
  primaryBg: 'bg-[#7c3aed]',
  hoverBg: 'hover:bg-violet-800',
  badgeClass: 'bg-violet-50 text-[#7c3aed] border-violet-200',
  ringColor: 'focus:ring-violet-500',
  label: 'Academic',
  labelTr: 'Akademik',
  icon: '👨‍🏫'
});

export const HiveContext = createContext(DEFAULT_ACADEMIC_HIVE);

/**
 * Academic Hive Provider.
 * Allows partial or complete overrides via the `value` prop while
 * ensuring defaults are always preserved.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_ACADEMIC_HIVE, ...value } : DEFAULT_ACADEMIC_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Academic Hive context.
 * Guarantees safe fallback to DEFAULT_ACADEMIC_HIVE if used outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_ACADEMIC_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as AcademicHiveContext, HiveProvider as AcademicHiveProvider };
export default HiveContext;
