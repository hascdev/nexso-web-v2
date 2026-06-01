"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckCircle,
  ArrowRight,
  Clock,
} from "@phosphor-icons/react";

type Status = "idle" | "submitting" | "success";
type Errors = { name?: string; email?: string; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    const next: Errors = {};
    if (!name) next.name = "Cuéntanos tu nombre.";
    if (!email) next.email = "Necesitamos un correo para responderte.";
    else if (!EMAIL_RE.test(email)) next.email = "Revisa el formato del correo.";
    if (!message) next.message = "Escribe brevemente qué necesitas.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 900);
  }

  return (
    <section
      id="contacto"
      className="mx-auto max-w-page w-full px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Solicita una cotización o reunión técnica
          </h2>
          <p className="mt-5 flex items-center gap-2 text-lg text-muted">
            <Clock size={20} weight="regular" className="text-primary-strong" />
            Respondemos en menos de 24 horas.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            Escríbenos qué quieres resolver. Si ya tienes un proceso de Compra
            Ágil o licitación en curso, indícalo y te orientamos.
          </p>
        </div>

        <div className="rounded-[var(--radius-base)] border border-line bg-surface p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {status === "success" ? (
              <motion.div
                key="success"
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-start gap-4 py-8"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary-strong">
                  <CheckCircle size={28} weight="fill" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-ink">
                  Mensaje recibido
                </h3>
                <p className="max-w-sm text-[15px] leading-relaxed text-muted">
                  Gracias por escribir. Te responderemos al correo indicado
                  dentro de las próximas 24 horas.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={false}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                <Field
                  label="Nombre"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  error={errors.name}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Correo"
                    name="email"
                    type="email"
                    placeholder="nombre@empresa.cl"
                    error={errors.email}
                  />
                  <Field
                    label="Organización"
                    name="org"
                    type="text"
                    placeholder="Empresa o institución"
                    optional
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-ink"
                  >
                    Qué necesitas
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Describe el proyecto, el problema o el proceso que tienes en curso."
                    aria-invalid={!!errors.message}
                    className="w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary focus:ring-4 focus:ring-primary-soft"
                  />
                  {errors.message ? (
                    <p className="text-sm text-primary-strong">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-medium text-on-primary transition-[transform,background-color] duration-200 ease-[var(--ease-out-strong)] hover:bg-primary-strong active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensaje
                      <ArrowRight size={18} weight="bold" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  error,
  optional,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  error?: string;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
        {optional ? (
          <span className="ml-2 font-normal text-faint">(opcional)</span>
        ) : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary focus:ring-4 focus:ring-primary-soft"
      />
      {error ? <p className="text-sm text-primary-strong">{error}</p> : null}
    </div>
  );
}
