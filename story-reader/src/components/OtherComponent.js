
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function OtherComponent() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme}>
      {/* ...existing code... */}
    </div>
  );
}