import { severeWeather } from "../hooks/severeWeather";
import { AlertList } from "./AlertList";

export function AlertPanel({ areaCode = 'MO' }) {
    const { alerts, mutedAlertIds, toggleMute, muteAll, unmuteAll } = severeWeather(areaCode);

    const style = {
        width: '100%',
        margin: 'auto',
        justifyContent: 'space-evenly'
    }
    return (
        <>
            <div style={style}>
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