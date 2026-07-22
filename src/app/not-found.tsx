import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-banking-offWhite px-5 text-center">
      <section className="max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-banking-blue">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-banking-text">
          Page not found
        </h1>
        <p className="mt-4 text-banking-muted">
          The page you opened does not exist or has moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md bg-banking-blue px-4 py-3 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
