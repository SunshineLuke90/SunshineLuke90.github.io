import { Alert } from "./Alert";
import type { NWSAlert } from "../services/nwsApi";

interface AlertListProps {
    alerts: NWSAlert[];
    mutedAlertIds: Set<string>;
    onToggleMute: (id: string) => void;
    onMuteAll: () => void;
    onUnmuteAll: () => void;
}

export function AlertList({ alerts, mutedAlertIds, onToggleMute, onMuteAll, onUnmuteAll }: AlertListProps) {
    const center = {
        display: 'flex',
        margin: 'auto',
        width: '100%',
        justifyContent: 'space-evenly'
    }
    const buttonStyle = {
        width: '50%',
        height: '50px',
        padding: '5px',
    }
    return (
        <div className="alert-list-container">
            <div id="mute-buttons" style={center}>
                <calcite-button onClick={onUnmuteAll} id="Unmute" appearance="outline-fill" kind="neutral" style={buttonStyle} className="unmute user-button">Unmute</calcite-button>
                <calcite-button onClick={onMuteAll} id="Mute" appearance="outline-fill" kind="inverse" style={buttonStyle} className="user-button">Mute</calcite-button>
            </div>
            {alerts.length == 0 ? (
                <div style={{ padding: 0, margin: 5, textAlign: "center" }}>
                    <h3>
                        There are currently no severe alerts in Missouri.
                    </h3>
                </div>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0, margin: 5 }}>
                    {alerts.map(alert => (
                        <Alert
                            key={alert.id}
                            alert={alert}
                            isMuted={mutedAlertIds.has(alert.id)}
                            onToggleMute={onToggleMute}
                        />
                    ))}
                </ul>
            )
            }

        </div>
    );
}