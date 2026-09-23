import React, { createContext, useContext, useMemo } from 'react';

/**
 * Immutable default design tokens for the Company Hive.
 * Adheres strictly to the Hive Color Identity Map (#1e3a5f, blue).
 */
export const DEFAULT_COMPANY_HIVE = Object.freeze({
  hiveColor: '#1e3a5f',
  hiveName: 'company',
  hiveAccent: 'blue',
  lightBg: 'bg-blue-50',
  borderAccent: 'border-blue-200',
  textColor: 'text-[#1e3a5f]',
  primaryBg: 'bg-[#1e3a5f]',
  hoverBg: 'hover:bg-slate-900',
  badgeClass: 'bg-blue-50 text-[#1e3a5f] border-blue-200',
  ringColor: 'focus:ring-blue-500',
  label: 'Company',
  labelTr: 'Kurumsal',
  icon: '🏢'
});

export const HiveContext = createContext(DEFAULT_COMPANY_HIVE);

/**
 * Company Hive Provider.
 * Allows partial or complete overrides via the `value` prop while
 * ensuring defaults are always preserved.
 */
export function HiveProvider({ children, value }) {
  const contextValue = useMemo(() => {
    return value ? { ...DEFAULT_COMPANY_HIVE, ...value } : DEFAULT_COMPANY_HIVE;
  }, [value]);

  return (
    <HiveContext.Provider value={contextValue}>
      {children}
    </HiveContext.Provider>
  );
}

/**
 * Hook to consume Company Hive context.
 * Guarantees safe fallback to DEFAULT_COMPANY_HIVE if used outside HiveProvider.
 */
export function useHiveContext() {
  const context = useContext(HiveContext);
  return context || DEFAULT_COMPANY_HIVE;
}

// Named aliases for developer clarity & default export
export { HiveContext as CompanyHiveContext, HiveProvider as CompanyHiveProvider };
export default HiveContext;
