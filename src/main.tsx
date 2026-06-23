import { createRoot } from 'react-dom/client';
import App from './App';
import '../calcite.css';
import '../styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
	throw new Error('Root element with id "root" was not found.');
}

createRoot(rootElement).render(<App />);
