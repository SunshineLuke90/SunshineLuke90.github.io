import { severeWeather } from "../hooks/severeWeather";
import { AlertList } from "./AlertList";

export function AlertPanel() {
    const { alerts, mutedAlertIds, toggleMute, muteAll, unmuteAll } = severeWeather();

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