import '../../accessibility/accessibility.css';

export default function AccessibilityPage() {
    return (
        <main>
            <section>
                <h2 className="projects sub-header">Accessibility through Responsive Design</h2>
                <p className="body-text">
                    Accessibility is an ongoing project, a part of everything within this website. The
                    projects that are designed here are made to be accessible, mobile friendly, and user
                    friendly. To design websites in this way, a variety of techniques are used. This can
                    all be accomplished by changing the format of the website completely between mobile
                    and desktop views, using keyboard navigable web components, and creating clear and
                    concise web flows.
                    <br />
                    <br />
                    Another key pillar of web design is to ensure that while keeping up with
                    accessibility guidelines, there is no consequence to the design elements within the
                    application. This includes map design, as well as using fun and beautiful page
                    elements. A secondary goal within each mini-project is to apply accessibility
                    guidelines, and maintain a consistent complex theme.
                    <br />
                    <br />
                    Some of the core elements that allow for easy accessibility compliance are utilizing
                    the existing frameworks and web components provided by Esri and other packages. The
                    use of Calcite Components allows for easy tab navigation and active selection, and
                    the use of Esri map components allows for keyboard view navigation. Other components
                    like the Chart.js allow for highly customizable data visualization, making it easy to
                    understand complex data at a glance.
                    <br />
                    <br />
                    If you&apos;re interested in how this responsive design is implemented, try viewing the
                    projects on this website on multiple devices to see how it compares and adapts to
                    various use cases.
                </p>
            </section>
        </main>
    );
}
