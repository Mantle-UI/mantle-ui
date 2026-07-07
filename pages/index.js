import FeaturesSection from '@/components/landing/featuressection';
import FooterSection from '@/components/landing/footersection';
import HeroSection from '@/components/landing/herosection';
import ThemeSection from '@/components/landing/themesection';
import AppContentContext from '@/components/layout/appcontentcontext';
import Topbar from '@/components/layout/topbar';
import { useMountEffect } from '@/components/lib/mantle-ui-react.all';
import { classNames } from '@/components/lib/utils/Utils';
// import NewsSection from '@/components/news/newssection';
import Head from 'next/head';
import { useContext } from 'react';

export default function Home() {
    const { newsActive, darkMode, changeTheme } = useContext(AppContentContext);
    const landingClass = classNames('landing', { 'layout-light': !darkMode, 'layout-dark': darkMode, 'layout-news-active': newsActive });

    const toggleDarkMode = () => {
        const newTheme = darkMode ? 'lara-light-cyan' : 'lara-dark-cyan';

        changeTheme(newTheme, !darkMode);
    };

    useMountEffect(() => {
        changeTheme(darkMode ? 'lara-dark-cyan' : 'lara-light-cyan', darkMode);
    });

    return (
        <div className={landingClass}>
            <Head>
                <title>MantleUI - React UI Component Library</title>
                <meta charSet="UTF-8" />
                <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MantleUI | React UI Component Library" />
                <meta name="twitter:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="MantleUI | React UI Component Library" />
                <meta property="og:url" content="https://github.com/Mantle-UI/mantle-ui" />
                <meta property="og:description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                <meta property="og:image" content="https://github.com/Mantle-UI/mantle-ui/raw/main/public/images/mantle-logo-text.png" />
                <meta property="og:ttl" content="604800" />
            </Head>
            {/* <NewsSection /> */}
            <Topbar onDarkSwitchClick={toggleDarkMode} />
            <HeroSection />
            <FeaturesSection />
            <ThemeSection />
            <FooterSection />
        </div>
    );
}

Home.getLayout = function getLayout(page) {
    return page;
};
