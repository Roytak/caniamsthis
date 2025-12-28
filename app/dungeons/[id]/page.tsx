import { notFound } from "next/navigation";
import { DungeonDetails } from "@/components/dungeon-details";
import { getAllInstances, getDungeon } from "@/lib/instance-loader";

interface DungeonPageProps {
  params: Promise<{ id: string }>;
  searchParams: { filter?: string };
}

export function generateStaticParams() {
  const { dungeons } = getAllInstances();
  return dungeons.map((dungeon) => ({
    id: dungeon.id.toString(),
  }));
}

export async function generateMetadata({ params }: DungeonPageProps) {
  const resolvedParams = await params;
  const dungeon = getDungeon(resolvedParams.id);

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

export default async function DungeonPage({ params, searchParams }: DungeonPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const dungeon = getDungeon(resolvedParams.id);
  const filter = resolvedSearchParams.filter === 'trash' ? 'trash' : 'bosses';

  if (!dungeon) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DungeonDetails dungeon={dungeon} filter={filter} />
    </div>
  );
}
