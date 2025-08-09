import { Alert } from "./Alert";

export function AlertList({ alerts, mutedAlertIds, onToggleMute, onMuteAll, onUnmuteAll }) {
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
                <calcite-button onClick={onUnmuteAll} id="Unmute" appearance="outline-fill" kind="neutral" style={buttonStyle} class="unmute user-button">Unmute</calcite-button>
                <calcite-button onClick={onMuteAll} id="Mute" appearance="outline-fill" kind="inverse" style={buttonStyle} class="user-button">Mute</calcite-button>
            </div>
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
        </div>
    );
}