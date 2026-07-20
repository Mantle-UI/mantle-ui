const FeaturesSection = () => {
    return (
        <section className="landing-features py-8">
            <div className="section-header">Features</div>
            <p className="section-detail">
                <span className="block">Mantle UI builds on the foundations of a widely adopted React component ecosystem and continues that work as an independent, community-maintained library.</span>
                <span className="block font-semibold animated-text relative white-space-nowrap mx-auto">
                    <span className="select-none">Built for real production teams</span>
                </span>
                <span className="block">Explore the components, themes, and documentation to see whether it fits your stack.</span>
            </p>
            <div className=" mt-7 px-3 lg:px-8">
                <div className="features-container">
                    <div className="grid">
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-components.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">80+ UI Components</div>
                                <p className="m-0 text-secondary font-medium">The ultimate set of UI Components to assist you with 80+ impressive React Components.</p>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-theme.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">Styled or Unstyled</div>
                                <p className="m-0 text-secondary font-medium">Choose from a variety of pre-built themes or implement your design systems with the CSS library of your choice like TailwindCSS.</p>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="/images/brand/mantle-guardian.png" alt="Mantle guardian mascot" className="block mb-3 w-6rem" />
                                <div className="font-semibold mb-3 text-lg">Community</div>
                                <p className="m-0 text-secondary font-medium">Connect with other open source users, collaborate on improvements, and help shape Mantle UI.</p>
                                <a href="https://discord.gg/BGs6EkpnDv" target="_blank" rel="noopener noreferrer" className="inline-flex align-items-center gap-2 mt-3 text-primary font-semibold">
                                    Join Discord
                                    <i className="pi pi-arrow-right" />
                                </a>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-accessibility.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">Accessibility</div>
                                <p className="m-0 text-secondary font-medium">Compliant with the Web Content Accessibility Guidelines (WCAG 2.0).</p>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-support.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">Open Source Workflow</div>
                                <p className="m-0 text-secondary font-medium">Built in the open with issues, pull requests, and community feedback shaping the library over time.</p>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-mobile.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">Mobile</div>
                                <p className="m-0 text-secondary font-medium">First class support for responsive design led by touch optimized elements.</p>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-productivity.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">Developer Productivity</div>
                                <p className="m-0 text-secondary font-medium">Composable building blocks, strong defaults, and broad coverage help you move faster across real applications.</p>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 xl:col-3 flex justify-content-center">
                            <div className="box p-4 w-full animation-duration-500">
                                <img src="https://primefaces.org/cdn/primereact/images/landing/features/icon-ts.svg" alt="components icon" className="block mb-3" />
                                <div className="font-semibold mb-3 text-lg">Typescript</div>
                                <p className="m-0 text-secondary font-medium">Top-notch support for Typescript with types and tooling assistance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
