import type { NWSAlert } from '../services/nwsApi';

interface AlertProps {
    alert: NWSAlert;
    isMuted: boolean;
    onToggleMute: (id: string) => void;
}

export function Alert({ alert, isMuted, onToggleMute }: AlertProps) {
    const button = {
        height: '1em',
        padding: '5px',
        marginBottom: '5px',
    }

    return (
        <li className="alert-item">
            <calcite-button style={button} scale='s' className='user-button' onClick={() => onToggleMute(alert.id)} title={isMuted ? "Unmute" : "Mute"} icon-start={isMuted ? 'sound-off' : 'sound'}></calcite-button>
            <b>{alert.event} - {alert.area}</b><br />{alert.headline}
        </li>
    )
}