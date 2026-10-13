import { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/about', label: 'About me', icon: 'information' },
    { path: '/blog', label: 'Blog', icon: 'blog' },
    { path: '/contact', label: 'Contact', icon: 'address-book' },
];

export default function Layout () {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isActive = (path: string) =>
        path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`);

    return (
        <>
            <div className="header noto-sans-heavy">
                <img src="/images/KC1440p.jpg" alt="A styled topographic map background" />
                <h1>Sunshine Spatial</h1>
                <h2>GIS and Developer Portfolio | Lucius Creamer</h2>
                <h3>A showcase of passion projects, coding exercises, and design work.</h3>
                <div className="action-bar">
                    {NAV_ITEMS.map((item) => (
                        <calcite-button
                            key={item.path}
                            className="menu-button"
                            round
                            kind="neutral"
                            label={`Open ${item.label}`}
                            icon-start={item.icon}
                            scale="m"
                            appearance={isActive(item.path) ? 'solid' : 'transparent'}
                            title={item.label}
                            onClick={() => navigate(item.path)}
                        />
                    ))}
                </div>
            </div>
            <Suspense fallback={<main><p>Loading page...</p></main>}>
                <div key={pathname} className="page-transition">
                    <Outlet />
                </div>
            </Suspense>
            <footer>
                <p>&copy; 2026 Lucius Creamer. All rights reserved.</p>
            </footer>
        </>
    );
}
