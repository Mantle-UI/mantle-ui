import { withBasePath } from '@/components/utils/utils';
import { Head, Html, Main, NextScript } from 'next/document';

const DEFAULT_THEME = 'lara-dark-cyan';
const THEME_STORAGE_KEY = 'mantle-ui-docs-theme';

export default function Document() {
    const themeBootstrapScript = `(function () {
        var theme = ${JSON.stringify(DEFAULT_THEME)};

        try {
            var savedTheme = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});

            if (/^[a-z0-9-]+$/.test(savedTheme || '')) {
                theme = savedTheme;
            }
        } catch (error) {
            // Use the server-rendered default when browser storage is unavailable.
        }

        document.write('<link id="theme-link" href="${withBasePath('/themes/')}' + theme + '/theme.css" rel="stylesheet">');
    })();`;

    return (
        <Html>
            <Head>
                {/* eslint-disable */}
                <meta name="algolia-site-verification" content="D315CFBBFC16F186" />
                <link href={withBasePath('/favicon.svg')} rel="icon" type="image/svg+xml"></link>
                <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}></script>
                <link id="home-table-link" href={withBasePath('/styles/landing/themes/lara-dark-cyan/theme.css')} rel="stylesheet"></link>
                <link rel="stylesheet" href={withBasePath('/styles/flags.css')}></link>
                <script src={withBasePath('/scripts/prism/prism.js')} data-manual></script>
                {/* eslint-enable */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
