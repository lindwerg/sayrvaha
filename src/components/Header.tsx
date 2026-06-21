"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useCart } from "./cart/CartContext";
import { NAV_LINKS } from "@/lib/nav";

function CartIcon({ onNavigate }: { onNavigate?: () => void }) {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={`Корзина${count ? `, товаров: ${count}` : ""}`}
      className="relative inline-flex items-center justify-center p-2 text-foreground hover:text-primary transition-colors"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
        <path d="M2 2h3l2.4 12.3a2 2 0 0 0 2 1.7h7.7a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-medium leading-none">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function Header({ cartEnabled = false }: { cartEnabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-primary shrink-0">
          <BrandLogo size="sm" color="var(--color-primary)" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm text-foreground hover:text-primary transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: cart + burger */}
        <div className="flex items-center gap-1">
          {cartEnabled && <CartIcon />}

          {/* Burger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Меню"
          >
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white border-t border-border">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-foreground hover:text-primary transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
