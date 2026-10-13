import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { defineCustomElements } from "@esri/calcite-components/loader";
import "@esri/calcite-components/main.css";
import App from './App';
import '../calcite.css';
import '../styles.css';

defineCustomElements();

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
