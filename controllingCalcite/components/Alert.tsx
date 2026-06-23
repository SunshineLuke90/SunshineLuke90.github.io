import type { NwsAlert } from '../../src/types/appTypes';

interface AlertProps {
    alert: NwsAlert;
    isMuted: boolean;
    onToggleMute: (id: string) => void;
}

export function Alert({ alert, isMuted, onToggleMute }: AlertProps) {
    const button = {
        height: '1em',
        padding: '5px',
        marginBottom: '5px',
    };

    return (
        <li className="alert-item">
            <calcite-button style={button} scale='s' className='user-button' onClick={() => onToggleMute(alert.id)} title={isMuted ? "Unmute" : "Mute"} icon-start={isMuted ? 'sound-off' : 'sound'}></calcite-button>
            <b>{alert.event} - {alert.area}</b><br />{alert.headline}
        </li>
    );
}