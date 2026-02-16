import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { SiteNav } from "@/components/SiteNav";
import { LeadForm } from "@/components/forms/LeadForm";

export default function InstructorsPage() {
  return (
    <main>
      <SiteNav />
      <Section className="grid gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">For instructors</h1>
          <p className="mt-4 text-slate-600">Launch and manage structured cohorts with workflows and analytics built in.</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <LeadForm role="instructor" />
        </div>
      </Section>
      <Footer />
    </main>
  );
}
