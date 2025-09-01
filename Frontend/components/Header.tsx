"use client"; // State yönetimi için client component'e çeviriyoruz

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Linkler component dışında tanımlanarak her render'da yeniden oluşturulması engellendi.
const navLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/portfolyo", label: "Portfolyo" },
    { href: "/danismanlarimiz", label: "Ekibimiz" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/iletisim", label: "İletişim" }
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    }

    // YENİ: Menü açıkken arkadaki sayfanın kaymasını engellemek için useEffect eklendi.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Component unmount olduğunda stilin sıfırlanmasını sağlar.
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <>
            {/* GÜNCELLEME: Header'ın z-index'i 40 yapıldı. */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" onClick={closeMenu} className="text-2xl font-bold text-blue-600">
                                Özen Gayrimenkul
                            </Link>
                        </div>

                        <nav className="hidden md:flex md:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Menüyü aç</span>
                                <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* GÜNCELLEME: Mobil menünün z-index'i 50 yapıldı (header'ın üstüne çıkması için). */}
            <div className={`fixed inset-0 bg-white z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                    <nav className="flex flex-col items-center space-y-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className="text-2xl font-medium text-gray-700 hover:text-blue-600 transition-colors"
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

