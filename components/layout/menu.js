import { classNames } from '@/components/lib/utils/Utils';
import { MobileNav } from '@/components/lib/mobilenav/MobileNav';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import MenuData from './menu.json';
import MenuItem from './menuitem';

const Menu = memo((props) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const menu = MenuData.data.map((data) => {
        const rootItem = { ...data };

        rootItem.expanded = rootItem.children && rootItem.children.some((item) => item.to === router.pathname || (item.children && item.children.some((it) => it.to === router.pathname)));

        return rootItem;
    });
    const mobileMenu = (items) =>
        items.map((item) => ({
            id: item.to || item.href || item.name,
            label: item.name,
            icon: item.icon,
            url: item.to || item.href,
            target: item.href ? '_blank' : undefined,
            command: item.to
                ? ({ originalEvent }) => {
                      originalEvent.preventDefault();
                      router.push(item.to);
                  }
                : undefined,
            items: item.children ? mobileMenu(item.children) : undefined
        }));

    const scrollToActiveItem = () => {
        const activeItem = document.querySelector('.router-link-active');

        if (activeItem) {
            activeItem.scrollIntoView({ block: 'center' });
        }
    };

    useEffect(() => {
        scrollToActiveItem();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1199px)');
        const updateIsMobile = () => setIsMobile(mediaQuery.matches);

        updateIsMobile();
        mediaQuery.addEventListener('change', updateIsMobile);

        return () => mediaQuery.removeEventListener('change', updateIsMobile);
    }, []);

    const sidebarClassName = classNames('layout-sidebar', { active: props.active });

    return (
        <>
            {!isMobile && (
                <aside className={sidebarClassName}>
                    <nav>
                        <ol className="layout-menu">
                            {menu.map((item, index) => (
                                <MenuItem menuItem={item} root={true} key={`_root${index}`} />
                            ))}
                        </ol>
                    </nav>
                </aside>
            )}
            {isMobile && <MobileNav visible={props.active} onHide={props.onHide} model={mobileMenu(MenuData.data)} activeItem={router.pathname} appendTo="self" blockScroll={false} ariaLabel="Mantle UI documentation" />}
        </>
    );
});

export default Menu;
