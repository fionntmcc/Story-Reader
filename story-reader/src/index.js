import React, { useContext, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';

const Root = () => {
  const { theme, fontSize } = useContext(ThemeContext);

  useEffect(() => {
    document.body.className = `${theme} ${fontSize}`;
  }, [theme, fontSize]);

  return <App />;
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider>
    <Root />
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
