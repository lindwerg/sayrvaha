import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-serif text-primary mb-4">404</h1>
      <p className="text-lg text-muted mb-8">Страница не найдена</p>
      <Link
        href="/"
        className="inline-block border border-primary text-primary px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
      >
        На главную
      </Link>
    </section>
  );
}
