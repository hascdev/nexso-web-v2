"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#metodo", label: "Método" },
  { href: "#integraciones", label: "Integraciones" },
  { href: "#sector-publico", label: "Sector público" },
  { href: "#cumplimiento", label: "Cumplimiento" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "border-b border-line bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-page w-full items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#top" className="shrink-0" aria-label="Nexso, inicio">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contacto"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-[transform,background-color] duration-200 ease-[var(--ease-out-strong)] hover:bg-primary-strong active:scale-[0.97] sm:inline-flex"
            >
              Conversemos
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated lg:hidden"
            >
              <List size={22} weight="regular" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed left-0 top-0 z-50 h-[100dvh] w-full bg-bg lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-5 sm:px-8">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated"
              >
                <X size={22} weight="regular" />
              </button>
            </div>
            <ul className="flex flex-col gap-1 px-3 pt-6">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-2xl font-light tracking-tight text-ink transition-colors hover:bg-elevated"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="px-4 pt-4">
                <a
                  href="#contacto"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-medium text-on-primary transition-transform duration-200 active:scale-[0.97]"
                >
                  Conversemos
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
