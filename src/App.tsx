import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import AccessibilityPage from './pages/AccessibilityPage';
import ExbPage from './pages/ExbPage';
import SagPage from './pages/SagPage';
import type { NavigateFn } from './types/appTypes';

const ControllingCalcitePage = lazy(() => import('./pages/ControllingCalcitePage'));
const OnHoverPage = lazy(() => import('./pages/OnHoverPage'));
const RadarPage = lazy(() => import('./pages/RadarPage'));

const ROUTES: Record<string, any> = {
    home: HomePage,
    about: AboutPage,
    contact: ContactPage,
    blog: BlogPage,
    accessibility: AccessibilityPage,
    exb: ExbPage,
    controllingCalcite: ControllingCalcitePage,
    onHover: OnHoverPage,
    radar: RadarPage,
    sag: SagPage,
};

const QUERY_PAGES = [
    'about',
    'contact',
    'blog',
    'accessibility',
    'exb',
    'controllingCalcite',
    'onHover',
    'radar',
    'sag',
];

function getPageFromURL (): string {
    const params = new URLSearchParams(window.location.search);

    for (const key of params.keys()) {
        if (QUERY_PAGES.includes(key)) {
            return key;
        }
    }

    if (params.has('post')) {
        return 'blog';
    }

    return 'home';
}

export default function App () {
    const [page, setPage] = useState<string>(getPageFromURL);

    useEffect(() => {
        const onPopState = () => setPage(getPageFromURL());
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    useEffect(() => {
        const useDarkMode = page === 'controllingCalcite' || page === 'onHover';
        document.body.classList.toggle('calcite-mode-dark', useDarkMode);

        return () => {
            document.body.classList.remove('calcite-mode-dark');
        };
    }, [page]);

    const navigate = useCallback<NavigateFn>((nextPage = 'home') => {
        const search = nextPage === 'home' ? '' : `?${nextPage}`;
        const nextURL = `${window.location.pathname}${search}`;

        window.history.pushState({}, '', nextURL);
        setPage(nextPage);
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, []);

    const ActivePage = useMemo(() => ROUTES[page] ?? HomePage, [page]);

    return (
        <Layout navigate={navigate} currentPage={page}>
            <Suspense fallback={<main><p>Loading page...</p></main>}>
                <div key={page} className="page-transition">
                    <ActivePage navigate={navigate} />
                </div>
            </Suspense>
        </Layout>
    );
}
