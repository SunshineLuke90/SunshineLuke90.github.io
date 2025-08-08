export function Alert({ alert, isMuted, onToggleMute }) {
    return (
        <li className="alert-item">
            <calcite-checkbox onClick={() => onToggleMute(alert.id)} title={isMuted ? "Unmute" : "Mute"} checked={isMuted ? false : true}></calcite-checkbox>
            <b>{alert.event} - {alert.area}</b><br />{alert.headline}
        </li>
    )
}