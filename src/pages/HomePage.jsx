import '../../home.css';

const chipTs = { '--calcite-chip-text-color': '#38bef0' };
const chipReact = { '--calcite-chip-text-color': '#58c4dc' };
const chipJs = { '--calcite-chip-text-color': '#e9d44d' };
const chipAzure = { '--calcite-chip-text-color': '#5d9fef' };
const chipExb = { '--calcite-chip-text-color': '#0ebace' };

export default function HomePage ({ navigate }) {
    return (
        <main>
            <section>
                <h2 className="projects sub-header">Featured Projects</h2>
                <div>
                    <calcite-card-group>
                        <calcite-card className="card" thumbnail-position="inline-start">
                            <img
                                slot="thumbnail"
                                src="https://placebear.com/301/254"
                                alt="A bear in its natural habitat."
                                style={{ objectFit: 'cover' }}
                            />
                            <span slot="heading">Custom Experience Builder Widgets</span>
                            <span slot="description">
                                Building apps using ArcGIS Maps SDK is great, but sometimes it&apos;s best to
                                build applications with low-code utilities. This page showcases some apps,
                                and links to custom widgets.
                            </span>
                            <calcite-chip scale="s" className="chip ongoing">
                                <img slot="image" src="/images/ongoing.png" alt="Blue dots icon" />
                                Ongoing
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipTs}>
                                <img slot="image" src="/images/ts-logo-128.png" />
                                TypeScript
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipReact}>
                                <img slot="image" src="/images/logo_dark.svg" />
                                React
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipAzure}>
                                <img slot="image" src="/images/azure-devops.png" />
                                Azure DevOps (CI/CD)
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipExb}>
                                <img slot="image" src="/images/exb.png" />
                                Experience Builder
                            </calcite-chip>
                            <div slot="footer-start"></div>
                            <calcite-button slot="footer-end" kind="neutral" onClick={() => navigate('exb')}>
                                Open
                            </calcite-button>
                        </calcite-card>

                        <calcite-card className="card" thumbnail-position="inline-start">
                            <img
                                slot="thumbnail"
                                src="https://placebear.com/301/255"
                                alt="A bear in its natural habitat."
                                style={{ objectFit: 'cover' }}
                            />
                            <span slot="heading">2026 Significant Achievement in GIS Award</span>
                            <span slot="description">
                                My project for SEMA, the SEMA Daily Brief, was selected to recieve a
                                SAG award by Esri.
                            </span>
                            <calcite-chip scale="s" className="chip" style={chipTs}>
                                <img slot="image" src="/images/ts-logo-128.png" />
                                TypeScript
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipReact}>
                                <img slot="image" src="/images/logo_dark.svg" />
                                React
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipAzure}>
                                <img slot="image" src="/images/azure-devops.png" />
                                Azure DevOps (CI/CD)
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipExb}>
                                <img slot="image" src="/images/exb.png" />
                                Experience Builder
                            </calcite-chip>
                            <div slot="footer-start"></div>
                            <calcite-button slot="footer-end" kind="neutral" onClick={() => navigate('sag')}>
                                Open
                            </calcite-button>
                        </calcite-card>

                        <calcite-card className="card" thumbnail-position="inline-start">
                            <img
                                slot="thumbnail"
                                src="https://placebear.com/301/253"
                                alt="A bear in its natural habitat."
                                style={{ objectFit: 'cover' }}
                            />
                            <span slot="heading">A Better Esri Radar Viewer</span>
                            <span slot="description">
                                Esri doesn&apos;t really provide a radar solution out of the box. This project
                                seeks to provide an alternative method to be able to add radar to any Esri
                                map based product.
                            </span>
                            <calcite-chip scale="s" className="chip complete">
                                <img slot="image" src="/images/check.png" alt="Green check icon" />
                                Complete
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipReact}>
                                <img slot="image" src="/images/logo_dark.svg" />
                                React
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipJs}>
                                <img slot="image" src="/images/icons8-javascript-48.png" />
                                Javascript
                            </calcite-chip>
                            <div slot="footer-start"></div>
                            <calcite-button slot="footer-end" kind="neutral" onClick={() => navigate('radar')}>
                                Open
                            </calcite-button>
                        </calcite-card>

                        <calcite-card className="card" thumbnail-position="inline-start">
                            <img
                                slot="thumbnail"
                                src="https://placebear.com/300/252"
                                alt="A bear in its natural habitat."
                                style={{ objectFit: 'cover' }}
                            />
                            <span slot="heading">Accessibility Through Responsive Design</span>
                            <span slot="description">
                                A consistent goal, to improve accessibility, and create responsive design
                                that works on any device. Read about how I work to implement accessible
                                design in my own projects.
                            </span>
                            <calcite-chip scale="s" className="chip ongoing">
                                <img slot="image" src="/images/ongoing.png" alt="Blue dots icon" />
                                Ongoing
                            </calcite-chip>
                            <div slot="footer-start"></div>
                            <calcite-button
                                slot="footer-end"
                                kind="neutral"
                                onClick={() => navigate('accessibility')}
                            >
                                Open
                            </calcite-button>
                        </calcite-card>

                        <calcite-card className="card" thumbnail-position="inline-start">
                            <img
                                slot="thumbnail"
                                src="https://placebear.com/300/250"
                                alt="A bear in its natural habitat."
                                style={{ objectFit: 'cover' }}
                            />
                            <span slot="heading">Working With the Hover Effect</span>
                            <span slot="description">
                                Web-Mapping is highly interactive! Allowing users to click on features to
                                get more information is a great way to reduce clutter. But what if you
                                could get insights without even making an input?
                            </span>
                            <calcite-chip scale="s" className="chip complete">
                                <img slot="image" src="/images/check.png" alt="Green check icon" />
                                Complete
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipReact}>
                                <img slot="image" src="/images/logo_dark.svg" />
                                React
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipJs}>
                                <img slot="image" src="/images/icons8-javascript-48.png" />
                                Javascript
                            </calcite-chip>
                            <div slot="footer-start"></div>
                            <calcite-button slot="footer-end" kind="neutral" onClick={() => navigate('onHover')}>
                                Open
                            </calcite-button>
                        </calcite-card>

                        <calcite-card className="card" thumbnail-position="inline-start">
                            <img
                                slot="thumbnail"
                                src="https://placebear.com/310/250"
                                alt="A bear in its natural habitat."
                                style={{ objectFit: 'cover' }}
                            />
                            <span slot="heading">Taking Control of Calcite Design</span>
                            <span slot="description">
                                I am working on controlling the Calcite Design framework to make highly
                                styled applications. Using this framework makes it easy to work in
                                accessibility, and ensure consistent design language. This application uses a
                                simple map viewer to show the usefulness of Calcite.
                            </span>
                            <calcite-chip scale="s" className="chip complete">
                                <img slot="image" src="/images/check.png" alt="Green check icon" />
                                Complete
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipReact}>
                                <img slot="image" src="/images/logo_dark.svg" />
                                React
                            </calcite-chip>
                            <calcite-chip scale="s" className="chip" style={chipJs}>
                                <img slot="image" src="/images/icons8-javascript-48.png" />
                                Javascript
                            </calcite-chip>
                            <div slot="footer-start"></div>
                            <calcite-button
                                slot="footer-end"
                                kind="neutral"
                                onClick={() => navigate('controllingCalcite')}
                            >
                                Open
                            </calcite-button>
                        </calcite-card>
                    </calcite-card-group>
                </div>
            </section>
        </main>
    );
}
