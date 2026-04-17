/**
 * AuthLayout — thin wrapper for Login / Register pages.
 * Keeps them scrollable and full-height.
 */
export default function AuthLayout({ children }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
}
