import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { SiteNav } from "@/components/SiteNav";

export default function ThankYouPage({ searchParams }: { searchParams: { role?: string } }) {
  const role = searchParams.role === "instructor" ? "instructor" : "user";

  return (
    <main>
      <SiteNav />
      <Section>
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Thanks for your interest!</h1>
          <p className="mt-4 text-slate-600">
            We received your {role} request and will follow up shortly with next steps.
          </p>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-brand-500 px-5 py-3 font-semibold text-white">
            Back to homepage
          </Link>
        </div>
      </Section>
      <Footer />
    </main>
  );
}
