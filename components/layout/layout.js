import AppContentContext from '@/components/layout/appcontentcontext';
import Config from '@/components/layout/config';
import Footer from '@/components/layout/footer';
import Menu from '@/components/layout/menu';
import Topbar from '@/components/layout/topbar';
import { MantleContext } from '@/components/lib/api/MantleContext';
import { DomHandler, classNames } from '@/components/lib/utils/Utils';
import NewsSection from '@/components/news/newssection';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

export default function Layout({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [configActive, setConfigActive] = useState(false);
    const { ripple, inputStyle } = useContext(MantleContext);
    const { theme, darkMode, newsActive, changeTheme } = useContext(AppContentContext);
    const router = useRouter();

    const wrapperClassName = classNames('layout-wrapper', {
        'layout-news-active': newsActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-dark': darkMode,
        'layout-light': !darkMode
    });

    const toggleDarkMode = () => {
        let newTheme = null;

        if (darkMode) {
            newTheme = theme.replace('dark', 'light');
        } else if (theme.includes('light') && theme !== 'fluent-light') {
            newTheme = theme.replace('light', 'dark');
        } else {
            newTheme = 'lara-dark-cyan';
        }

        changeTheme(newTheme, !darkMode);
    };

    useEffect(() => {
        if (sidebarActive) {
            DomHandler.blockBodyScroll('blocked-scroll');
        } else {
            DomHandler.unblockBodyScroll('blocked-scroll');
        }
    }, [sidebarActive]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const handleRouteChangeComplete = (l) => {
            setSidebarActive(false);
        };

        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={wrapperClassName} data-p-theme={theme}>
            <Head>
                <title>Mantle UI - React Component Library</title>
                <meta charSet="UTF-8" />
                <meta name="description" content="Mantle UI is a flexible and accessible React component library." />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Mantle UI | React Component Library" />
                <meta name="twitter:description" content="Mantle UI is a flexible and accessible React component library." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Mantle UI | React Component Library" />
                <meta property="og:url" content="https://github.com/Mantle-UI/mantle-ui" />
                <meta property="og:description" content="Mantle UI is a flexible and accessible React component library." />
                <meta property="og:image" content="/images/mantle-ui-logo.png" />
                <meta property="og:ttl" content="604800" />
                <link rel="icon" href="/favicon.ico" type="image/x-icon" />
            </Head>
            <NewsSection />
            <Topbar showConfigurator showMenuButton onMenuButtonClick={() => setSidebarActive(true)} onConfigButtonClick={() => setConfigActive(true)} onDarkSwitchClick={toggleDarkMode} />
            <div className={classNames('layout-mask', { 'layout-mask-active': sidebarActive })} onClick={() => setSidebarActive(false)} />
            <Config active={configActive} onHide={() => setConfigActive(false)} onDarkSwitchClick={toggleDarkMode} />
            <div className="layout-content">
                <Menu active={sidebarActive} />
                <div className="layout-content-slot">{children}</div>
            </div>
            <Footer />
        </div>
    );
}
