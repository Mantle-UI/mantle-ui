import pkg from 'package.json';

export default function Footer() {
    const version = pkg.version;

    return (
        <div className="layout-footer">
            <div>
                <span>Mantle UI {version}</span>
                <a href="https://github.com/Mantle-UI/mantle-ui" target="_blank" rel="noopener noreferrer">
                    {' '}
                    on GitHub
                </a>
            </div>
        </div>
    );
}
