import { DepositWorkspace } from "@/components/dashboard/deposit-workspace";

export default async function DepositPage({
  searchParams,
}: {
  searchParams?: Promise<{ asset?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <DepositWorkspace initialAsset={params?.asset} />
    </>
  );
}
