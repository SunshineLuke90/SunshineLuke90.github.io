import { severeWeather } from "../hooks/severeWeather";
import { AlertList } from "./AlertList";

export function AlertPanel({ areaCode = 'MO' }) {
    const { alerts, mutedAlertIds, toggleMute, muteAll, unmuteAll } = severeWeather(areaCode);

    return (
        <>
            <div>
                <AlertList
                    alerts={alerts}
                    mutedAlertIds={mutedAlertIds}
                    onToggleMute={toggleMute}
                    onMuteAll={muteAll}
                    onUnmuteAll={unmuteAll}
                />
            </div>
        </>
    );
}