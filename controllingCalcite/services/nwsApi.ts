export interface NWSAlert {
    id: string;
    area: string;
    event: string;
    headline: string;
}

interface NWSGraphEvent {
    id: string;
    areaDesc: string;
    event: string;
    headline: string;
    severity: string;
}

export async function getNWSAlerts(areaCode = 'MO'): Promise<NWSAlert[]> {
    const events: NWSAlert[] = [];
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
            for (const event of data['@graph'] as NWSGraphEvent[]) {
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
        return []
    }
    return events;
}