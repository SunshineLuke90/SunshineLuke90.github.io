import { lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import AccessibilityPage from './pages/AccessibilityPage';
import ExbPage from './pages/ExbPage';
import SagPage from './pages/SagPage';
import JapanTripPage from './pages/JapanTripPage';

const ControllingCalcitePage = lazy(() => import('./pages/ControllingCalcitePage'));
const OnHoverPage = lazy(() => import('./pages/OnHoverPage'));
const RadarPage = lazy(() => import('./pages/RadarPage'));

const DARK_MODE_PATHS = ['/controlling-calcite', '/on-hover'];

// Maps old `?page` query keys to their new paths.
const LEGACY_QUERY_PATHS: Record<string, string> = {
    about: '/about',
    contact: '/contact',
    blog: '/blog',
    accessibility: '/accessibility',
    exb: '/exb',
    controllingCalcite: '/controlling-calcite',
    onHover: '/on-hover',
    radar: '/radar',
    sag: '/sag',
};

function HomeRoute () {
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const post = params.get('post');
    if (post) {
        return <Navigate to={`/blog/${encodeURIComponent(post)}`} replace />;
    }

    for (const key of params.keys()) {
        if (key in LEGACY_QUERY_PATHS) {
            return <Navigate to={LEGACY_QUERY_PATHS[key]} replace />;
        }
    }

    return <HomePage />;
}

export default function App () {
    const { pathname } = useLocation();

    useEffect(() => {
        const useDarkMode = DARK_MODE_PATHS.includes(pathname);
        document.body.classList.toggle('calcite-mode-dark', useDarkMode);

        return () => {
            document.body.classList.remove('calcite-mode-dark');
        };
    }, [pathname]);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<HomeRoute />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="japan" element={<JapanTripPage />} />
                <Route path="japan/:slug" element={<JapanTripPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:slug" element={<BlogPage />} />
                <Route path="accessibility" element={<AccessibilityPage />} />
                <Route path="exb" element={<ExbPage />} />
                <Route path="sag" element={<SagPage />} />
                <Route path="controlling-calcite" element={<ControllingCalcitePage />} />
                <Route path="on-hover" element={<OnHoverPage />} />
                <Route path="radar" element={<RadarPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
