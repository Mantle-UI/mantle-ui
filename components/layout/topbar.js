import { StyleClass } from '@/components/lib/styleclass/StyleClass';
import { classNames } from '@/components/lib/utils/Utils';
import { DocSearch } from '@docsearch/react';
import Link from 'next/link';
import pkg from 'package.json';
import { useEffect, useRef } from 'react';

export default function Topbar(props) {
    const versionsRef = useRef(null);
    const versions = [
        {
            name: 'main',
            version: pkg.version,
            url: 'https://github.com/Mantle-UI/mantle-ui'
        }
    ];

    function handleDocSearchTransformItems(items) {
        const isLocalhost = process.env.NODE_ENV !== 'production';

        return items.map((item) => {
            if (isLocalhost) {
                const url = new URL(item.url);

                url.protocol = window.location.protocol;
                url.hostname = window.location.hostname;
                url.port = window.location.port;
                item.url = url.toString();
            }

            return item;
        });
    }

    const onMenuButtonClick = () => {
        props.onMenuButtonClick();
    };

    const onConfigButtonClick = () => {
        props.onConfigButtonClick();
    };

    const containerElement = useRef(null);
    const scrollListener = useRef();

    const bindScrollListener = () => {
        scrollListener.current = () => {
            if (containerElement && containerElement.current) {
                if (window.scrollY > 0) {
                    containerElement.current.classList.add('layout-topbar-sticky');
                } else {
                    containerElement.current.classList.remove('layout-topbar-sticky');
                }
            }
        };

        window.addEventListener('scroll', scrollListener.current);
    };

    const unbindScrollListener = () => {
        if (scrollListener.current) {
            window.removeEventListener('scroll', scrollListener.current);
            scrollListener.current = null;
        }
    };

    useEffect(() => {
        bindScrollListener();

        return function unbind() {
            unbindScrollListener();
        };
    }, []);

    const toggleDarkMode = () => {
        props.onDarkSwitchClick();
    };

    return (
        <div ref={containerElement} className="layout-topbar">
            <div className="layout-topbar-inner">
                <div className="layout-topbar-logo-container">
                    <Link href="/" className="layout-topbar-logo" aria-label="Mantle UI logo">
                        <img src="/images/mantle-logo-text.png" alt="Mantle UI" height="35" />
                    </Link>
                    <Link href="/" className="layout-topbar-icon" aria-label="Mantle UI logo">
                        <img src="/images/mantle-ui-logo.png" alt="Mantle UI icon" height="35" />
                    </Link>
                </div>

                <ul className="flex list-none m-0 p-0 gap-2 align-items-center">
                    <li>
                        <DocSearch appId="473OAGLWFO" apiKey="b4dc5205df58e30da26b455573a41c24" indexName="Mantle UI Docs" debug={false} transformItems={handleDocSearchTransformItems} />
                    </li>
                    <li>
                        <a
                            href="https://github.com/Mantle-UI/mantle-ui"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-shrink-0 px-link border-1 border-solid w-2rem h-2rem surface-border border-round surface-card align-items-center justify-content-center transition-all transition-duration-300 hover:border-primary"
                        >
                            <i className="pi pi-github text-700" />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://discord.gg/BGs6EkpnDv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-shrink-0 px-link border-1 border-solid w-2rem h-2rem surface-border border-round surface-card align-items-center justify-content-center transition-all transition-duration-300 hover:border-primary"
                        >
                            <i className="pi pi-discord text-700" />
                        </a>
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex flex-shrink-0 px-link border-1 border-solid w-2rem h-2rem surface-border border-round surface-card align-items-center justify-content-center transition-all transition-duration-300 hover:border-primary"
                            onClick={toggleDarkMode}
                        >
                            <i className={classNames('pi text-700', { 'pi-moon': props.dark, 'pi-sun': !props.dark })} />
                        </button>
                    </li>
                    {props.showConfigurator && (
                        <li>
                            <button type="button" className="p-button flex-shrink-0 flex border-1 w-2rem h-2rem p-0 align-items-center justify-content-center transition-all transition-duration-300 min-w-0" onClick={onConfigButtonClick}>
                                <i className="pi pi-palette" />
                            </button>
                        </li>
                    )}

                    <li className="relative">
                        <StyleClass nodeRef={versionsRef} selector="@next" enterClassName="hidden" enterActiveClassName="scalein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick>
                            <button
                                ref={versionsRef}
                                type="button"
                                style={{ maxWidth: '8rem' }}
                                className="px-link flex align-items-center surface-card h-2rem px-2 border-1 border-solid surface-border transition-all transition-duration-300 hover:border-primary"
                            >
                                <span className="text-900 block white-space-nowrap overflow-hidden">{versions && versions.length ? versions[0].version : ''}</span>
                                <span className="ml-2 pi pi-angle-down text-600" />
                            </button>
                        </StyleClass>
                        <div className="p-3 surface-overlay hidden absolute right-0 top-auto border-round shadow-2 origin-top w-8rem">
                            <ul className="list-none m-0 p-0">
                                {versions.map((version) => {
                                    return (
                                        <li role="none" key={version.version}>
                                            <a href={version.url} className="inline-flex p-2 border-round hover:surface-hover w-full">
                                                <span className="font-bold text-900">{version.name}</span>
                                                <span className="ml-2 text-700 white-space-nowrap block overflow-hidden text-overflow-ellipsis">({version.version})</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </li>
                    {props.showMenuButton && (
                        <li className="menu-button">
                            <button
                                type="button"
                                className="flex flex-shrink-0 px-link border-1 border-solid w-2rem h-2rem surface-border border-round surface-card align-items-center justify-content-center transition-all transition-duration-300 hover:border-primary menu-button"
                                onClick={onMenuButtonClick}
                                aria-haspopup
                                aria-label="Menu"
                            >
                                <i className="pi pi-bars text-700" />
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
