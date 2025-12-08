import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DungeonDetails } from "@/components/dungeon-details";
import { PageHeader } from "@/components/page-header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { WoWAPIClient } from "@/lib/api-client";

interface DungeonPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const instances = await WoWAPIClient.getInstances();
  return instances.dungeons.map((dungeon) => ({
    id: dungeon.id.toString(),
  }));
}

export async function generateMetadata({ params }: DungeonPageProps) {
  // `params` may be a Promise in Next.js; await it before using.
  const { id } = (await params) as { id: string };
  const dungeon = await WoWAPIClient.getDungeon(id);

  if (!dungeon) {
    return {
      title: "Dungeon Not Found - Can I AMS This?",
    };
  }

  return {
    title: `${dungeon.name} - Can I AMS This?`,
    description: `Check which spells in ${dungeon.name} can be immuned with Death Knight Anti-Magic Shell`,
  };
}

export default async function DungeonPage({ params }: DungeonPageProps) {
  const { id } = (await params) as { id: string };
  // Fetch the dungeon on the server and pass it to the client component
  // as `initialDungeon` so the UI can render immediately without a
  // redundant client-side fetch that may suffer from shape/casing
  // mismatches with the backend.
  let initialDungeon = null;
  try {
    initialDungeon = await WoWAPIClient.getDungeon(id);
  } catch (err) {
    // swallow — DungeonDetails will show an appropriate message
    initialDungeon = null;
  }
  console.log("Initial dungeon data:", initialDungeon);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <DungeonDetails dungeonId={id} initialDungeon={initialDungeon} />
        </Suspense>
      </main>
    </div>
  );
}
