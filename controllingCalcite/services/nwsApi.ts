import type { NwsAlert } from '../../src/types/appTypes';

export async function getNWSAlerts(areaCode = 'MO'): Promise<NwsAlert[]> {
    const events: NwsAlert[] = [];
    try {
        const response = await fetch(`https://api.weather.gov/alerts/active/area/${areaCode}`, {
            method: 'get',
            headers: {
                'accept': 'application/ld+json',
                'User-Agent': 'PortfolioAlertList-Lucius@luciuscreamer.com'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP Request status: ${response.status}`);
        }
        const data = await response.json();
        if (data['@graph'] && data['@graph'].length > 0) {
            for (const event of data['@graph']) {
                if (event.severity === "Severe" || event.severity === "Extreme") {
                    events.push({
                        "id": event.id,
                        "area": event.areaDesc,
                        "event": event.event,
                        "headline": event.headline
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error fetching data', error);
        return [];
    }
    return events;
}