import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@arcgis/map-components/components/arcgis-map';

import Radar from './Radar';
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('radar-panel')).render(<Radar />)