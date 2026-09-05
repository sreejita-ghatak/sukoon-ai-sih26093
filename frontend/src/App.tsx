import React, { useState, useEffect } from 'react';
import { VictimApp } from './components/VictimApp';
import { OperatorApp } from './operator/OperatorApp';

export default function App() {
  const [pathname, setPathname] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Separate Experience Dispatcher
  if (pathname.startsWith('/operator')) {
    return <OperatorApp />;
  }

  // Default: Pristine Victim Application
  return <VictimApp />;
}
