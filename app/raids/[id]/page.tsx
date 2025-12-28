import { notFound } from "next/navigation";
import { RaidDetails } from "@/components/raid-details";
import { getAllInstances, getRaid } from "@/lib/instance-loader";

interface RaidPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const { raids } = getAllInstances();
  return raids.map((raid) => ({
    id: raid.id.toString(),
  }));
}

export async function generateMetadata({ params }: RaidPageProps) {
  const resolvedParams = await params;
  const raid = getRaid(resolvedParams.id);

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

export default async function RaidPage({ params }: RaidPageProps) {
  const resolvedParams = await params;
  const raid = getRaid(resolvedParams.id);

  if (!raid) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RaidDetails raid={raid} />
    </div>
  );
}
