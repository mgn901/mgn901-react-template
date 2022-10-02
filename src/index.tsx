import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import '@material-design-icons/font/outlined.css';
import 'inter-ui/inter.css';

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
