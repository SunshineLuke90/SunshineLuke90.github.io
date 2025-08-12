// src/hooks/useSevereWeather.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { getNWSAlerts } from '../services/nwsApi';

export function severeWeather(areaCode = 'MO') {
    const [alerts, setAlerts] = useState([]);
    const [mutedAlertIds, setMutedAlertIds] = useState(new Set());
    const previousAlertIds = useRef([]);
    const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/weather/distant_thunder.ogg'));

    // Fetch alerts from NWS on load and every 30s
    useEffect(() => {
        let isMounted = true;
        const fetchAndProcessAlerts = async () => {
            const currentAlerts = await getNWSAlerts(areaCode);
            const currentAlertIds = currentAlerts.map(alert => alert.id);

            // Only update state if alerts have changed
            if (JSON.stringify(currentAlertIds) !== JSON.stringify(previousAlertIds.current)) {
                if (isMounted) {
                    setAlerts(currentAlerts);
                    // On initial load, mute all current alerts
                    if (previousAlertIds.current.length === 0 && currentAlertIds.length > 0) {
                        setMutedAlertIds(new Set(currentAlertIds));
                    }
                    // Find genuinely new alerts
                    const newAlerts = currentAlerts.filter(
                        alert => !previousAlertIds.current.includes(alert.id)
                    );
                    // If there are new, unmuted alerts, play the sound
                    const shouldPlaySound = newAlerts.some(alert => !mutedAlertIds.has(alert.id)) && (previousAlertIds.current.length > 0);
                    if (shouldPlaySound) {
                        console.log(`playing here ${previousAlertIds.current}`)
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                    }
                }
            }
            previousAlertIds.current = currentAlertIds;
        };
        fetchAndProcessAlerts(); // Initial fetch
        const interval = setInterval(fetchAndProcessAlerts, 30000); // Fetch every 30 seconds
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [areaCode]);

    // --- Handler Functions ---
    // These only affect muting/unmuting, not fetching
    const toggleMute = (id) => {
        setMutedAlertIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            // Only pause audio if all alerts are muted
            const allAlertIds = alerts.map(a => a.id);
            const allMuted = allAlertIds.every(alertId => newSet.has(alertId));
            if (allMuted) {
                audioRef.current.pause();
            } else if (!newSet.has(id)) {
                // If this alert was just unmuted, play sound
                audioRef.current.currentTime = 0;
                audioRef.current.play();
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
        // Optionally play sound for first unmuted alert
        if (alerts.length > 0) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    // Return state and handlers for the UI component to use
    return { alerts, mutedAlertIds, toggleMute, muteAll, unmuteAll };
}