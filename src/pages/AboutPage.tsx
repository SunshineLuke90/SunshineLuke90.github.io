import '../../about.css';

export default function AboutPage () {
    return (
        <main>
            <h2 className="sub-header">About Me</h2>
            <calcite-card-group>
                <calcite-card className="card" thumbnail-position="inline-start">
                    <img
                        slot="thumbnail"
                        src="/images/BlazerProfile.jpg"
                        alt="A picture of me in a Northwest Blazer"
                        width="20%"
                    />
                    <span slot="heading">My History:</span>
                    <span slot="description">
                        <p className="about-content">
                            Hello! I&apos;m Lucius Creamer, a passionate GIS developer with a love for
                            creating beautiful and functional applications and maps. I have been using
                            GIS technology for almost 10 years, and I continue to learn and grow in this
                            field every day.
                        </p>
                        <p className="about-content">
                            I started my GIS journey early in high school, learning the basics of GIS and
                            cartography, and taking summer internships at the City of Columbia.
                        </p>
                        <p className="about-content">
                            I went on to study Geography at Northwest Missouri State University, where I
                            earned my Bachelor&apos;s in Geography with a GIS emphasis.
                        </p>
                        <p className="about-content">
                            During my time at Northwest, I was involved in founding a partnership between
                            Northwest and the National Geospatial-Intelligence Agency (NGA), which
                            allowed GIS students to get hands-on experience with real world projects.
                        </p>
                    </span>
                </calcite-card>

                <calcite-card className="card" thumbnail-position="inline-start">
                    <img
                        slot="thumbnail"
                        src="/images/Boulder.jpg"
                        alt="A picture of me sitting on a rock in Colorado"
                        width="20%"
                    />
                    <span slot="heading">Current Role:</span>
                    <span slot="description">
                        <p className="about-content">
                            Currently, I work as a GIS Specialist supporting the Missouri State Emergency
                            Management Agency (SEMA). My role involves developing and maintaining GIS
                            applications, analyzing risk, providing situational awareness, and supporting
                            the mission of preparedness, response and recovery.
                        </p>
                        <p className="about-content">
                            My goal within SEMA is to improve the situational awareness tools that GIS
                            can provide, and to be able to provide some of those insights to the broader
                            public.
                        </p>
                    </span>
                </calcite-card>

                <calcite-card className="card" thumbnail-position="inline-start">
                    <img
                        slot="thumbnail"
                        src="/images/CouplePhoto.jpg"
                        alt="A selfie of me and my girlfriend on pikes peak"
                        width="20%"
                    />
                    <span slot="heading">Personal Life:</span>
                    <span slot="description">
                        <p className="about-content">
                            In my personal life, I enjoy working on GIS and web development projects,
                            spending time with my beautiful girlfriend, and taking time to travel and
                            relax.
                        </p>
                        <p className="about-content">
                            It&apos;s hard to determine what hobby I might pick up next, but lately I enjoy
                            video games, hiking and coding.
                        </p>
                    </span>
                </calcite-card>
            </calcite-card-group>
        </main>
    );
}
