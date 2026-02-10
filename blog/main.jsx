import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-card';
import '@esri/calcite-components/dist/components/calcite-card-group';

import { createRoot } from 'react-dom/client';
import Blog from './Blog';

createRoot(document.getElementById('blog-root')).render(<Blog />);