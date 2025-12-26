import { notFound } from "next/navigation";
import { RaidDetails } from "@/components/raid-details";
import { PageHeader } from "@/components/page-header";
import { getAllInstances, getRaid } from "@/lib/instance-loader";

interface RaidPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  const { raids } = getAllInstances();
  return raids.map((raid) => ({
    id: raid.id.toString(),
  }));
}

export function generateMetadata({ params }: RaidPageProps) {
  const raid = getRaid(params.id);

  if (!raid) {
    return {
      title: "Raid Not Found - Can I AMS This?",
    };
  }

  return {
    title: `${raid.name} - Can I AMS This?`,
    description: `Check which boss spells in ${raid.name} can be immuned with Death Knight Anti-Magic Shell`,
  };
}

export default function RaidPage({ params }: RaidPageProps) {
  const raid = getRaid(params.id);

  if (!raid) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <RaidDetails raid={raid} />
      </main>
    </div>
  );
}
