import '../../exb/exb.css';

export default function ExbPage() {
    return (
        <main>
            <section>
                <h2 className="projects sub-header">Custom Experience Builder Widgets</h2>
                <div className="link-container">
                    <calcite-button
                        href="https://exb.luciuscreamer.com"
                        className="link-button"
                        round="true"
                        kind="neutral"
                        label="Experience builder showcase"
                        scale="m"
                        title="Experience Builder Showcase"
                    >
                        Showcase
                    </calcite-button>
                    <calcite-button
                        href="https://github.com/SunshineLuke90/widgets"
                        className="link-button"
                        round="true"
                        kind="neutral"
                        label="Widgets GitHub Repository"
                        scale="m"
                        title="Widgets GitHub Repository"
                    >
                        Widgets GitHub
                    </calcite-button>
                    <calcite-button
                        href="https://github.com/SunshineLuke90/apps"
                        className="link-button"
                        round="true"
                        kind="neutral"
                        label="Apps GitHub Repository"
                        scale="m"
                        title="Apps GitHub Repository"
                    >
                        Apps GitHub
                    </calcite-button>
                </div>
                <p className="body-text">
                    I have been spending a lot of time lately thinking about extending existing
                    frameworks to fit specific user needs. While Esri does a fairly good job at
                    providing a robust suite of widgets to fulfill most needs, GIS builders have unique
                    and specific needs, but don&apos;t always have a developer behind them to build a full
                    application from scratch. Partially out of frustration with gaps in functionality,
                    and partially out of a desire to solve problems on my own, I have built several
                    custom widgets for Experience Builder. These widgets are open, and available for
                    others to use and extend as they see fit. Use the buttons above to either navigate
                    to the Experience Builder GitHub repos, or to my Experience Builder showcase site.
                    <br />
                    <br />
                    One of the lessons that I&apos;ve been learning is how to use CI/CD while working on
                    developing these custom Experience Builder applications. Because these applications
                    are built outside of ArcGIS online, I have more control over the build and release
                    schedule of the applications, as well as gaining the bonus advantage of version
                    control through Git.
                    <br />
                    <br />
                    My solution for controlling the releases of Experience Builder Applications, as well
                    as making it easy to build applications and reuse widgets across applications is to
                    use a 2 repository approach, with an "apps" and a "widgets" repository, storing what
                    you would expect. The releases are controlled by a setting within the build yaml for
                    each application, so that each application&apos;s build pipeline is only triggered when a
                    commit is made to that specific app&apos;s folder within the "apps" repository. Right
                    now, the build pipeline is run in a cloud hosted pool in Azure DevOps, triggered
                    automatically upon a commit. Upon build completion, a release pipleine kicks off,
                    which is run self hosted on a
                    {' '}
                    <a href="https://www.raspberrypi.com/products/raspberry-pi-5/" target="_self">
                        Raspberry Pi 5
                    </a>
                    , where the application is deployed to and served through a reverse proxy, viewable
                    at
                    {' '}
                    <a href="https://exb.luciuscreamer.com" target="_self">
                        exb.luciuscreamer.com
                    </a>
                    .
                    <br />
                    <br />
                    This sort of build and deployment pipeline setup has been very robust, and works in a
                    way that still allows flexibility in how each individual applicaiton is deployed,
                    while still making it easy to see all apps and widgets in one place, which is
                    extremely useful for GIS builders who are used to an ArcGIS Online environment. This
                    could be further extended by running the builder environment as a service, so that
                    the builder doesn&apos;t even need to set up the development environment on their local
                    machine.
                </p>
            </section>
        </main>
    );
}
