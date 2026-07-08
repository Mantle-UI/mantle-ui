import Link from 'next/link';

const FooterSection = () => {
    return (
        <section className="landing-footer pt-8 px-5 lg:px-8">
            <div className="landing-footer-container">
                <div className="flex flex-wrap z-1">
                    <div className="w-6 lg:w-3 flex">
                        <ul className="list-none p-0 m-0">
                            <li className="font-bold mb-5">General</li>
                            <li className="mb-4">
                                <Link href="/installation" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150">
                                    Get Started
                                </Link>
                            </li>
                            <li className="mb-4">
                                <a href="https://github.com/Mantle-UI/mantle-ui" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Examples
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="w-6 lg:w-3 flex">
                        <ul className="list-none p-0 m-0">
                            <li className="font-bold mb-5">Community</li>
                            <li className="mb-4">
                                <a href="https://github.com/Mantle-UI/mantle-ui/discussions" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Forum
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="https://discord.gg/gzKFYnpmCY" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="w-6 lg:w-3 flex">
                        <ul className="list-none p-0 m-0">
                            <li className="font-bold mt-5 lg:mt-0 mb-5">Resources</li>
                            <li className="mb-4">
                                <a href="https://www.youtube.com/channel/UCTgmp69aBOlLnPEqlUyetWw" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Videos
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="https://github.com/Mantle-UI/mantle-ui/releases" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Releases
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="https://github.com/Mantle-UI/mantle-ui/blob/main/CHANGELOG.md" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Changelog
                                </a>
                            </li>
                            <li className="mb-4">
                                <a href="https://github.com/Mantle-UI/mantle-ui/discussions" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150" target="_blank" rel="noopener noreferrer">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="w-6 lg:w-3 flex">
                        <ul className="list-none p-0 m-0">
                            <li className="font-bold mt-5 lg:mt-0 mb-5">Explore</li>
                            <li className="mb-4">
                                <Link href="/theming" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150">
                                    Theming
                                </Link>
                            </li>
                            <li className="mb-4">
                                <Link href="/tailwind" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150">
                                    Tailwind
                                </Link>
                            </li>
                            <li>
                                <Link href="/contribution" className="text-secondary font-medium hover:text-primary transition-colors transition-duration-150">
                                    Contribution
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="section-divider mt-8" />

                <div className="flex flex-wrap justify-content-between py-6 gap-5">
                    <span className="font-semibold text-xl">Mantle UI</span>
                    <div className="flex align-items-center">
                        <a href="https://github.com/Mantle-UI/mantle-ui/releases" className="linkbox block w-3rem h-3rem flex align-items-center justify-content-center mr-3">
                            <i className="pi pi-twitter" />
                        </a>
                        <a href="https://github.com/Mantle-UI/mantle-ui" className="linkbox block w-3rem h-3rem flex align-items-center justify-content-center mr-3">
                            <i className="pi pi-github" />
                        </a>
                        <a href="https://discord.gg/gzKFYnpmCY" className="linkbox block w-3rem h-3rem flex align-items-center justify-content-center mr-3">
                            <i className="pi pi-discord" />
                        </a>
                        <a href="https://github.com/Mantle-UI/mantle-ui/discussions" className="linkbox block w-3rem h-3rem flex align-items-center justify-content-center">
                            <i className="pi pi-comments" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FooterSection;
