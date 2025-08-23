import { createRoot } from 'react-dom/client';
import React from 'react';
import { AlertPanel } from './components/AlertPanel';
import "../styles.css";
import "../calcite.css"

import '@esri/calcite-components/dist/components/calcite-button';
import '@esri/calcite-components/dist/components/calcite-action-bar';
import '@esri/calcite-components/dist/components/calcite-shell';
import '@arcgis/map-components/components/arcgis-map'
import '@arcgis/map-components/components/arcgis-zoom'
import '@arcgis/map-components/components/arcgis-legend'
import Extent from "@arcgis/core/geometry/Extent.js";

const domNode = document.getElementById("legend");
const root = createRoot(domNode);

root.render(
  <AlertPanel areaCode='MO' />
)

const mapElement = document.querySelector("arcgis-map");
const view = mapElement.view;
view.when(() => {
  view.extent = new Extent({
    xmin: -96.0,
    ymin: 35.7,
    xmax: -88.9,
    ymax: 40.9,
  });
});
