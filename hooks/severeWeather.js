// src/hooks/useSevereWeather.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { getNWSAlerts } from '../services/nwsApi';

export function severeWeather(areaCode = 'MO') {
    const [alerts, setAlerts] = useState([]);
    const [mutedAlertIds, setMutedAlertIds] = useState(new Set());
    const previousAlertIds = useRef([]);
    const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/weather/distant_thunder.ogg')); // Path to your audio file

    const fetchAndProcessAlerts = useCallback(async () => {
        const currentAlerts = await getNWSAlerts(areaCode);
        const currentAlertIds = currentAlerts.map(alert => alert.id);

        // Only update state and play sound if alerts have actually changed
        if (JSON.stringify(currentAlertIds) !== JSON.stringify(previousAlertIds.current)) {
            setAlerts(currentAlerts);

            // Find genuinely new alerts
            const newAlerts = currentAlerts.filter(
                alert => !previousAlertIds.current.includes(alert.id)
            );

            // If there are new, unmuted alerts, play the sound
            const shouldPlaySound = newAlerts.some(alert => !mutedAlertIds.has(alert.id));
            if (shouldPlaySound) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        }

        // Store the current IDs for the next check
        previousAlertIds.current = currentAlertIds;
    }, [mutedAlertIds]); // Rerun if mutedAlertIds changes

    // Fetch data on initial load and then on a timer
    useEffect(() => {
        fetchAndProcessAlerts(); // Initial fetch
        const interval = setInterval(fetchAndProcessAlerts, 30000); // Fetch every 60 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [fetchAndProcessAlerts]);

    // --- Handler Functions ---
    const toggleMute = (id) => {
        setMutedAlertIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const muteAll = () => {
        const allIds = new Set(alerts.map(a => a.id));
        setMutedAlertIds(allIds);
        audioRef.current.pause();
    };

    const unmuteAll = () => {
        setMutedAlertIds(new Set());
    };

    // Return state and handlers for the UI component to use
    return { alerts, mutedAlertIds, toggleMute, muteAll, unmuteAll };
}