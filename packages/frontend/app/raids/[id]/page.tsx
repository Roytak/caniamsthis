import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import { RaidDetails } from "@/components/raid-details";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { WoWAPIClient } from "@/lib/api-client";

interface RaidPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const instances = await WoWAPIClient.getInstances();
  return instances.raids.map((raid) => ({
    id: raid.id.toString(),
  }));
}

export async function generateMetadata({ params }: RaidPageProps) {
  const { id } = await params;
  const raid = await WoWAPIClient.getRaid(id);

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <RaidDetails raidId={params.id} />
        </Suspense>
      </main>
    </div>
  );
}
