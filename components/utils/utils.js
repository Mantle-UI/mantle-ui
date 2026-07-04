export const getBasePath = () => process.env.NEXT_PUBLIC_BASE_PATH || '';

export const withBasePath = (path = '') => {
    if (!path || !path.startsWith('/') || path.startsWith('//')) {
        return path;
    }

    const basePath = getBasePath();

    return basePath ? `${basePath}${path}` : path;
};

export const applyBasePathCompatibility = () => {
    const basePath = getBasePath();

    if (!basePath || typeof window === 'undefined') {
        return () => {};
    }

    const rewriteAttribute = (element, attributeName) => {
        const value = element.getAttribute(attributeName);

        if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith(basePath)) {
            return;
        }

        element.setAttribute(attributeName, `${basePath}${value}`);
    };

    const rewriteBackgroundImage = (element) => {
        const { backgroundImage } = element.style;

        if (!backgroundImage || !backgroundImage.includes("url('/")) {
            return;
        }

        element.style.backgroundImage = backgroundImage.replace(/url\('\/(.*?)'\)/g, `url('${basePath}/$1')`);
    };

    const rewriteNode = (node) => {
        if (!(node instanceof HTMLElement)) {
            return;
        }

        rewriteAttribute(node, 'src');
        rewriteAttribute(node, 'href');
        rewriteAttribute(node, 'content');
        rewriteBackgroundImage(node);

        node.querySelectorAll('[src], [href], [content], [style]').forEach((element) => {
            rewriteAttribute(element, 'src');
            rewriteAttribute(element, 'href');
            rewriteAttribute(element, 'content');
            rewriteBackgroundImage(element);
        });
    };

    rewriteNode(document.documentElement);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => rewriteNode(node));

            if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
                rewriteNode(mutation.target);
            }
        });
    });

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'content', 'style']
    });

    return () => observer.disconnect();
};

export const switchTheme = (currentTheme, newTheme, linkElementId, callback) => {
    const linkElement = document.getElementById(linkElementId);
    const cloneLinkElement = linkElement.cloneNode(true);
    const newThemeUrl = linkElement.getAttribute('href').replace(currentTheme, newTheme);

    cloneLinkElement.setAttribute('id', linkElementId + '-clone');
    cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', linkElementId);

        if (callback) {
            callback();
        }
    });
    linkElement.parentNode?.insertBefore(cloneLinkElement, linkElement.nextSibling);
};

export const getStorage = (stateStorageProp) => {
    switch (stateStorageProp) {
        case 'local':
            return window.localStorage;

        case 'session':
            return window.sessionStorage;

        case 'custom':
            return null;

        default:
            throw new Error(stateStorageProp + ' is not a valid value for the state storage, supported values are "local", "session" and "custom".');
    }
};
