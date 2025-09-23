"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/portfoy", label: "Portföy" },
    { href: "/danismanlarimiz", label: "Danışmanlarımız" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" }
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    const isTransparent = isHomePage && !isScrolled;

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll(); // Sayfa yüklendiğinde anlık kontrol
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Dinamik olarak atanacak sınıflar
    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-500 ${
        isTransparent
            ? 'bg-gradient-to-b from-black/30 via-black/10 to-transparent text-white'
            : 'bg-white/90 text-gray-900 shadow-lg backdrop-blur-md'
    }`;
    
    const logoClasses = `text-2xl font-medium tracking-tight font-serif transition-colors duration-300 ${
        isTransparent ? 'text-white' : 'text-gray-900'
    }`;

    const navLinkClasses = (transparent: boolean) => 
        `relative font-light transition-colors duration-300 py-2 ${
            transparent 
                ? 'text-white hover:text-gray-200' 
                : 'text-gray-600 hover:text-gray-900'
        } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full`;

    return (
        <>
            <header className={headerClasses} role="banner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0 flex items-center gap-4">
                            <Image src="/logo.png" alt="Hatice Özen Gayrimenkul logosu" width={50} height={50} className={logoClasses + 'filter transition-[filter] duration-300' + (isTransparent ? ' invert' : '') } />
                            <Link href="/" onClick={closeMenu} className={logoClasses} aria-label="Ana sayfa">
                                Hatice Özen Gayrimenkul
                            </Link>
                        </div>

                        <nav className="hidden md:flex md:space-x-8" aria-label="Ana menü">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={navLinkClasses(isTransparent)}
                                    aria-current={pathname === link.href ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                                aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                            >
                                <span className="sr-only">Menüyü aç</span>
                                <div className="w-6 h-6 flex flex-col justify-around">
                                    <span className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                                    <span className={`block h-0.5 w-full bg-current transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`block h-0.5 w-full bg-current transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobil Menü Overlay */}
            <div 
                className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeMenu}
                aria-hidden="true"
            ></div>
            
            {/* Mobil Menü Panel */}
            <div id="mobile-menu" className={`fixed top-0 right-0 h-full w-72 bg-white z-50 transform shadow-xl ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="p-8 flex flex-col h-full">
                     <div className="flex-shrink-0 mb-10">
                        <Link href="/" onClick={closeMenu} className="text-2xl font-bold text-blue-600 font-roboto">
                            Hatice Özen Gayrimenkul
                        </Link>
                    </div>
                    <nav className="flex flex-col items-start space-y-6" aria-label="Mobil menü">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="text-xl font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                aria-current={pathname === link.href ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Header;

