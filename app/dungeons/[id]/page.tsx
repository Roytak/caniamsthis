import { notFound } from "next/navigation";
import { DungeonDetails } from "@/components/dungeon-details";
import { PageHeader } from "@/components/page-header";
import { getAllInstances, getDungeon } from "@/lib/instance-loader";

interface DungeonPageProps {
  params: { id: string };
  searchParams: { filter?: string };
}

export function generateStaticParams() {
  const { dungeons } = getAllInstances();
  return dungeons.map((dungeon) => ({
    id: dungeon.id.toString(),
  }));
}

export function generateMetadata({ params }: DungeonPageProps) {
  const dungeon = getDungeon(params.id);

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

export default function DungeonPage({ params, searchParams }: DungeonPageProps) {
  const dungeon = getDungeon(params.id);
  const filter = searchParams.filter === 'trash' ? 'trash' : 'bosses';

  if (!dungeon) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-green-100">
      <PageHeader />
      <main className="container mx-auto px-4 py-8">
        <DungeonDetails dungeon={dungeon} filter={filter} />
      </main>
    </div>
  );
}
