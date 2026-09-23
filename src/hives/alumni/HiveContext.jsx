import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Alumni Hive.
 * Adheres strictly to the Hive Color Identity Map (#059669, emerald).
 */
export const DEFAULT_ALUMNI_HIVE = Object.freeze({
  hiveColor: '#059669',
  hiveName: 'alumni',
  hiveAccent: 'emerald',
  lightBg: 'bg-emerald-50',
  borderAccent: 'border-emerald-200',
  textColor: 'text-[#059669]',
  primaryBg: 'bg-[#059669]',
  hoverBg: 'hover:bg-emerald-700',
  badgeClass: 'bg-emerald-50 text-[#059669] border-emerald-200',
  ringColor: 'focus:ring-emerald-500',
  label: 'Alumni',
  labelTr: 'Mezun',
  icon: '🟢'
});

export const HiveContext = createContext(DEFAULT_ALUMNI_HIVE);

/**
 * Alumni Hive Provider.
 * Allows partial or complete overrides via the `value` prop while
 * ensuring defaults are always preserved.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_ALUMNI_HIVE, ...value } : DEFAULT_ALUMNI_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Alumni Hive context.
 * Guarantees safe fallback to DEFAULT_ALUMNI_HIVE if used outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_ALUMNI_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as AlumniHiveContext, HiveProvider as AlumniHiveProvider };
export default HiveContext;
