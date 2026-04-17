import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

/**
 * AppShell wraps every "main" screen.
 * It renders the content area and shows the Navbar
 * unless the user is inside the fullscreen analyze flow.
 */
export default function AppShell({ children }) {
  const { analyzePage } = useApp();

  return (
    <>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Bottom nav — hidden while analyzing */}
      {!analyzePage && <Navbar />}
    </>
  );
}
