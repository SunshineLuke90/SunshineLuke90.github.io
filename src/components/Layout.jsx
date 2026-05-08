const NAV_ITEMS = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'about', label: 'About me', icon: 'information' },
    { key: 'blog', label: 'Blog', icon: 'blog' },
    { key: 'contact', label: 'Contact', icon: 'address-book' },
];

export default function Layout({ navigate, currentPage, children }) {
    return (
        <>
            <div className="header noto-sans-heavy">
                <img src="images/KC1440p.jpg" alt="A styled topographic map background" />
                <h1>Sunshine Spatial</h1>
                <h2>GIS and Developer Portfolio | Lucius Creamer</h2>
                <h3>A showcase of passion projects, coding exercises, and design work.</h3>
                <div className="action-bar">
                    {NAV_ITEMS.map((item) => (
                        <calcite-button
                            key={item.key}
                            className="menu-button"
                            round="true"
                            kind="neutral"
                            label={`Open ${item.label}`}
                            icon-start={item.icon}
                            scale="m"
                            appearance={currentPage === item.key ? 'solid' : 'transparent'}
                            title={item.label}
                            onClick={() => navigate(item.key)}
                        />
                    ))}
                </div>
            </div>
            {children}
            <footer>
                <p>&copy; 2026 Lucius Creamer. All rights reserved.</p>
            </footer>
        </>
    );
}
