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

const domNode = document.getElementById("legend");
const root = createRoot(domNode);

root.render(
  <AlertPanel areaCode='MO' />
)

/*
function fetchAndUpdateSevereAlerts() {
  fetch('https://api.weather.gov/alerts/active.atom?area=MO')
    .then(response => response.text())
    .then(xmlText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const entries = Array.from(xmlDoc.getElementsByTagName("entry"));
      const severeEntries = entries.filter(entry => {
        const severityTag = entry.getElementsByTagName("cap:severity")[0];
        return severityTag && severityTag.textContent === "Severe";
      });
      // Extract details for each severe entry
      const details = severeEntries.map(entry => {
        return {
          id: entry.getElementsByTagName("id")[0]?.textContent || "",
          title: entry.getElementsByTagName("title")[0]?.textContent || "",
          summary: entry.getElementsByTagName("summary")[0]?.textContent || "",
          event: entry.getElementsByTagName("cap:event")[0]?.textContent || "",
          severity: entry.getElementsByTagName("cap:severity")[0]?.textContent || "",
          areaDesc: entry.getElementsByTagName("cap:areaDesc")[0]?.textContent || "",
          polygon: entry.getElementsByTagName("cap:polygon")[0]?.textContent || ""
        };
      });
      const currentSevereIds = details.map(item => item.id);
      // Only update if there are new severe events
      const isChanged = currentSevereIds.length !== previousSevereIds.length ||
        currentSevereIds.some((id, i) => id !== previousSevereIds[i]);
      if (isChanged) {
        // Find new alerts to play sound for
        const newAlertIds = currentSevereIds.filter(id => !previousSevereIds.includes(id));
        previousSevereIds = currentSevereIds;
        const severeList = document.getElementById("severe-list");
        // Banner logic
        let banner = document.getElementById("severe-banner");
        const hasUnmuted = details.some(item => !mutedAlerts.has(item.id));
        if (!banner && hasUnmuted) {
          banner = document.createElement("div");
          banner.id = "severe-banner";
          banner.textContent = "⚠️ Severe Weather Alert Active!";
          banner.style.position = "fixed";
          banner.style.top = "0";
          banner.style.left = "0";
          banner.style.width = "100%";
          banner.style.background = "#d32f2f";
          banner.style.color = "#fff";
          banner.style.fontWeight = "bold";
          banner.style.textAlign = "center";
          banner.style.padding = "12px 0";
          banner.style.zIndex = "1000";
          document.body.prepend(banner);
          // Push down main content
          const shell = document.querySelector('calcite-shell > div');
          if (shell) shell.style.marginTop = '48px';
        } else if (banner && !hasUnmuted) {
          banner.remove();
          // Remove margin from main content
          const shell = document.querySelector('calcite-shell > div');
          if (shell) shell.style.marginTop = '';
        }

        if (severeList) {
          severeList.innerHTML = "";

          // Default all alerts to muted only on first load
          if (mutedAlerts.size === 0) {
            details.forEach(item => {
              mutedAlerts.add(item.id);
            });
          }

          // Add Unmute All and Mute All buttons at the top
          const controlsDiv = document.createElement("div");
          controlsDiv.style.marginBottom = "10px";

          const unmuteAllBtn = document.createElement("calcite-button");
          unmuteAllBtn.innerText = "Unmute All";
          unmuteAllBtn.setAttribute("appearance", "solid");
          unmuteAllBtn.setAttribute("scale", "m");
          unmuteAllBtn.style.marginRight = "8px";
          unmuteAllBtn.addEventListener("click", () => {
            details.forEach(item => {
              mutedAlerts.delete(item.id);
            });
            updateSevereList(details, newAlertIds, severeList);
            // Play sound for first unmuted alert if any
            if (details.length > 0 && newAlertIds.length > 0) {
              alertAudio.currentTime = 0;
              alertAudio.play();
              soundingAlertId = newAlertIds[0];
            }
            // Show banner if needed
            let banner = document.getElementById("severe-banner");
            if (!banner && details.some(item => !mutedAlerts.has(item.id))) {
              banner = document.createElement("div");
              banner.id = "severe-banner";
              banner.textContent = "⚠️ Severe Weather Alert Active!";
              banner.style.position = "fixed";
              banner.style.top = "0";
              banner.style.left = "0";
              banner.style.width = "100%";
              banner.style.background = "#d32f2f";
              banner.style.color = "#fff";
              banner.style.fontWeight = "bold";
              banner.style.textAlign = "center";
              banner.style.padding = "12px 0";
              banner.style.zIndex = "1000";
              document.body.prepend(banner);
              // Push down main content
              const shell = document.querySelector('calcite-shell > div');
              if (shell) shell.style.marginTop = '48px';
            }
          });

          const muteAllBtn = document.createElement("calcite-button");
          muteAllBtn.innerText = "Mute All";
          muteAllBtn.setAttribute("appearance", "outline" );
          muteAllBtn.setAttribute("scale", "m");
          muteAllBtn.addEventListener("click", () => {
            details.forEach(item => {
              mutedAlerts.add(item.id);
            });
            alertAudio.pause();
            alertAudio.currentTime = 0;
            soundingAlertId = null;
            updateSevereList(details, newAlertIds, severeList);
            // Remove banner if all muted
            let banner = document.getElementById("severe-banner");
            if (banner) {
              banner.remove();
              // Remove margin from main content
              const shell = document.querySelector('calcite-shell > div');
              if (shell) shell.style.marginTop = '';
            }
          });

          controlsDiv.appendChild(unmuteAllBtn);
          controlsDiv.appendChild(muteAllBtn);
          severeList.appendChild(controlsDiv);

          // Add play sound button at the top
          const playButton = document.createElement("calcite-button");
          playButton.innerText = "Play Severe Alert Sound";
          playButton.setAttribute("appearance", "clear");
          playButton.setAttribute("scale", "m");
          playButton.style.marginBottom = "10px";
          playButton.addEventListener("click", () => {
            alertAudio.currentTime = 0;
            alertAudio.play();
          });
          severeList.appendChild(playButton);

          updateSevereList(details, newAlertIds, severeList);
// Helper to update severe list UI and icons
function updateSevereList(details, newAlertIds, severeList) {
  // Remove all list items except controls/buttons
  // (Assumes controls/buttons are first children)
  while (severeList.children.length > 2) {
    severeList.removeChild(severeList.lastChild);
  }
  details.forEach(item => {
    const li = document.createElement("li");
    // Mute icon
    const muteIcon = document.createElement("span");
    muteIcon.innerHTML = mutedAlerts.has(item.id) ? "🔇" : "🔔";
    muteIcon.style.cursor = mutedAlerts.has(item.id) ? "default" : "pointer";
    muteIcon.style.marginRight = "8px";
    muteIcon.title = mutedAlerts.has(item.id) ? "Muted" : "Mute alert";
    muteIcon.onclick = () => {
      if (!mutedAlerts.has(item.id)) {
        mutedAlerts.add(item.id);
        muteIcon.innerHTML = "🔇";
        muteIcon.style.cursor = "default";
        muteIcon.title = "Muted";
        // If this alert was sounding, switch to another unmuted alert if available
        if (soundingAlertId === item.id) {
          // Find another unmuted alert
          const nextUnmuted = details.find(d => !mutedAlerts.has(d.id));
          if (nextUnmuted) {
            alertAudio.currentTime = 0;
            alertAudio.play();
            soundingAlertId = nextUnmuted.id;
          } else {
            alertAudio.pause();
            alertAudio.currentTime = 0;
            soundingAlertId = null;
          }
        }
        // Remove banner if all alerts are muted
        if (details.every(d => mutedAlerts.has(d.id))) {
          let banner = document.getElementById("severe-banner");
          if (banner) {
            banner.remove();
            // Remove margin from main content
            const shell = document.querySelector('calcite-shell > div');
            if (shell) shell.style.marginTop = '';
          }
        }
      }
      // If already muted, do nothing
    };
    li.appendChild(muteIcon);
    // Alert details
    const detailsDiv = document.createElement("div");
    detailsDiv.innerHTML = `<strong>${item.title}</strong><br>
      <em>${item.event}</em> | <span>${item.severity}</span><br>
      <span>${item.areaDesc}</span><br>
      <p>${item.summary}</p>`;
    li.appendChild(detailsDiv);
    severeList.appendChild(li);
    // Play sound for new alerts unless muted
    if (newAlertIds.includes(item.id) && !mutedAlerts.has(item.id)) {
      alertAudio.currentTime = 0;
      alertAudio.play();
      soundingAlertId = item.id;
    }
  });
}
        }
      }
    })
    .catch(error => console.error('Error fetching or parsing XML:', error));
}
*/
/*
// Initial fetch
fetchAndUpdateSevereAlerts();
// Fetch every 5 minutes (300,000 ms)
setInterval(fetchAndUpdateSevereAlerts, 30000);

*/