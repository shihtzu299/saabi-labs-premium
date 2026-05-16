"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Quote,
  Send,
  Star,
  Upload,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Testimonial } from "@/data/testimonials";

type TestimonialsProps = {
  testimonials: Testimonial[];
};

type FormErrors = Partial<
  Record<"name" | "company" | "message" | "avatar" | "rating", string>
>;

const maxAvatarSize = 1024 * 1024 * 2;
const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];

function fallbackAvatar(name: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
    name || "Guest",
  )}`;
}

function getRating(rating?: number) {
  return typeof rating === "number" && rating >= 1 ? Math.min(5, rating) : 5;
}

function RatingStars({
  rating,
  onChange,
  disabled = false,
}: {
  rating: number;
  onChange?: (rating: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const active = value <= rating;

        if (!onChange) {
          return (
            <Star
              key={value}
              size={18}
              className={active ? "fill-yellow-300 text-yellow-300" : "text-white/20"}
            />
          );
        }

        return (
          <button
            key={value}
            type="button"
            title={`${value} star${value === 1 ? "" : "s"}`}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            disabled={disabled}
            onClick={() => onChange(value)}
            className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Star
              size={22}
              className={
                active ? "fill-yellow-300 text-yellow-300" : "text-white/25"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    message: "",
    rating: 5,
  });

  const visibleTestimonials = useMemo(
    () => testimonials.filter((testimonial) => testimonial.status !== "pending"),
    [testimonials],
  );

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    containerRef.current.scrollBy({
      left: direction === "right" ? 420 : -420,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setForm({ name: "", company: "", message: "", rating: 5 });
    setAvatarFile(null);
    setAvatarPreview("");
    setErrors({});
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "Please enter your name.";
    }

    if (form.company.trim().length < 2) {
      nextErrors.company = "Please enter your company.";
    }

    if (form.message.trim().length < 20) {
      nextErrors.message = "Share at least 20 characters.";
    }

    if (form.rating < 1 || form.rating > 5) {
      nextErrors.rating = "Please choose a rating.";
    }

    if (avatarFile) {
      if (!allowedAvatarTypes.includes(avatarFile.type)) {
        nextErrors.avatar = "Use a JPG, PNG, or WebP image.";
      } else if (avatarFile.size > maxAvatarSize) {
        nextErrors.avatar = "Avatar must be 2MB or smaller.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAvatarChange = (file?: File) => {
    setAvatarFile(file || null);
    setErrors((current) => ({ ...current, avatar: undefined }));

    if (!file) {
      setAvatarPreview("");
      return;
    }

    if (!allowedAvatarTypes.includes(file.type) || file.size > maxAvatarSize) {
      setAvatarPreview("");
      setAvatarFile(file);
      return;
    }

    setAvatarPreview(URL.createObjectURL(file));
  };

  const submitTestimonial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("company", form.company.trim());
    payload.append("message", form.message.trim());
    payload.append("rating", String(form.rating));

    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    setIsSubmitting(true);

    const response = await fetch("/api/testimonials", {
      method: "POST",
      body: payload,
    });
    const data = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setErrors({
        message: data.error || "Something went wrong. Please try again.",
      });
      return;
    }

    resetForm();
    setToast("Thank you. Your testimonial is waiting for review.");

    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setToast("");
    }, 1400);
  };

  return (
    <section className="py-32" id="testimonials">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 uppercase tracking-[0.3em] text-blue-400">
              Testimonials
            </p>

            <h2 className="text-4xl font-black md:text-5xl">
              What clients say about us.
            </h2>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              title="Scroll testimonials left"
              aria-label="Scroll testimonials left"
              onClick={() => scroll("left")}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-blue-400/40"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              title="Scroll testimonials right"
              aria-label="Scroll testimonials right"
              onClick={() => scroll("right")}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:border-blue-400/40"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="testimonial-scroll flex gap-6 overflow-x-auto scroll-smooth pb-4"
        >
          {visibleTestimonials.map((testimonial) => (
            <div
              key={testimonial.id || `${testimonial.name}-${testimonial.company}`}
              className="glass min-w-[320px] max-w-[360px] flex-shrink-0 rounded-[28px] p-7"
            >
              <Quote className="mb-6 text-blue-300" size={32} />

              <div className="mb-5">
                <RatingStars rating={getRating(testimonial.rating)} />
              </div>

              <p className="min-h-32 text-base leading-7 text-gray-300">
                "{testimonial.message}"
              </p>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={testimonial.avatarUrl || fallbackAvatar(testimonial.name)}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>
                  <div className="font-semibold">{testimonial.name}</div>

                  <div className="text-sm text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-7 py-4 font-semibold text-white transition hover:scale-[1.02] hover:bg-blue-400"
          >
            <Send size={18} />
            Share your experience
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-8 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={closeModal}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-experience-title"
              className="glass max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[28px] p-6 shadow-2xl md:p-8"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 uppercase tracking-[0.24em] text-blue-400">
                    Share Experience
                  </p>
                  <h3 id="share-experience-title" className="text-3xl font-black">
                    Tell us what working together felt like.
                  </h3>
                </div>

                <button
                  type="button"
                  title="Close"
                  aria-label="Close"
                  onClick={closeModal}
                  className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition hover:border-blue-300/50"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="grid gap-4" onSubmit={submitTestimonial}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-gray-300">Avatar</span>
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-black/15 p-4">
                    <img
                      src={avatarPreview || fallbackAvatar(form.name)}
                      alt=""
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <span className="mb-2 flex items-center gap-2 text-sm text-blue-300">
                        <Upload size={16} />
                        Optional avatar upload
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={isSubmitting}
                        className="block w-full text-sm text-gray-400"
                        onChange={(event) =>
                          handleAvatarChange(event.target.files?.[0])
                        }
                      />
                    </div>
                  </div>
                  {errors.avatar ? (
                    <span className="text-sm text-red-300">{errors.avatar}</span>
                  ) : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-gray-300">Rating</span>
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <RatingStars
                      rating={form.rating}
                      disabled={isSubmitting}
                      onChange={(rating) =>
                        setForm((current) => ({ ...current, rating }))
                      }
                    />
                  </div>
                  {errors.rating ? (
                    <span className="text-sm text-red-300">{errors.rating}</span>
                  ) : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-gray-300">Name</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-blue-300/60"
                    value={form.name}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                  />
                  {errors.name ? (
                    <span className="text-sm text-red-300">{errors.name}</span>
                  ) : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-gray-300">Company</span>
                  <input
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-blue-300/60"
                    value={form.company}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        company: event.target.value,
                      }))
                    }
                  />
                  {errors.company ? (
                    <span className="text-sm text-red-300">{errors.company}</span>
                  ) : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-gray-300">Message</span>
                  <textarea
                    className="min-h-32 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-blue-300/60"
                    value={form.message}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        message: event.target.value,
                      }))
                    }
                  />
                  {errors.message ? (
                    <span className="text-sm text-red-300">{errors.message}</span>
                  ) : null}
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit testimonial"}
                </button>
              </form>

              <AnimatePresence>
                {toast ? (
                  <motion.div
                    className="mt-5 flex items-center gap-3 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                  >
                    <CheckCircle2 size={18} />
                    {toast}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
