import { GTagManager } from '@/components/analytics/analytics';
import AppContentContext from '@/components/layout/appcontentcontext';
import Layout from '@/components/layout/layout';
import { MantleProvider } from '@/components/lib/api/MantleContext';
import { applyBasePathCompatibility, switchTheme } from '@/components/utils/utils';
import '@docsearch/css';
import '@mantle-ui/icons/primeicons.css';
import '@mantle-ui/flex/mantleflex.css';
import { useEffect, useState } from 'react';
import '../styles/demo/demo.scss';
import '../styles/layout/layout.scss';

const THEME_STORAGE_KEY = 'mantle-ui-docs-theme';

function AppContent({ component: Component, pageProps }) {
    if (Component.getLayout) {
        return Component.getLayout(<Component {...pageProps} />);
    }

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default function MyApp({ Component, pageProps }) {
    const isProduction = process.env.NODE_ENV === 'production';
    const [darkMode, setDarkMode] = useState(true);
    const [theme, setTheme] = useState('lara-dark-cyan');
    const [newsActive, setNewsActive] = useState(false);
    const [announcement, setAnnouncement] = useState(null);

    const appState = {
        darkMode: darkMode,
        theme: theme,
        newsActive: newsActive,
        announcement: announcement,
        changeTheme: (newTheme, dark) => {
            if (newTheme !== theme) {
                switchTheme(theme, newTheme, 'theme-link', () => {
                    setDarkMode(dark);
                    setTheme(newTheme);

                    try {
                        window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
                    } catch (error) {
                        // Theme switching remains available when browser storage is unavailable.
                    }
                });
            }
        },
        showNews: (message) => {
            setNewsActive(true);
            setAnnouncement(message);
        },
        hideNews: () => {
            setNewsActive(false);
        }
    };

    const mantleConfig = {
        ripple: true,
        hideOverlaysOnDocumentScrolling: false
    };

    useEffect(() => {
        return applyBasePathCompatibility();
    }, []);

    useEffect(() => {
        try {
            const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

            if (savedTheme && savedTheme !== theme) {
                switchTheme(theme, savedTheme, 'theme-link', () => {
                    setDarkMode(savedTheme.includes('-dark'));
                    setTheme(savedTheme);
                });
            }
        } catch (error) {
            // Use the default theme when browser storage is unavailable.
        }
    }, []); // The stored selection is restored once after the client mounts.

    return (
        <AppContentContext.Provider value={appState}>
            <MantleProvider value={mantleConfig}>
                {isProduction && <GTagManager />}
                <AppContent component={Component} pageProps={pageProps} />
            </MantleProvider>
        </AppContentContext.Provider>
    );
}
