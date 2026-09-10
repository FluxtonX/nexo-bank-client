import { WithdrawWorkspace } from "@/components/dashboard/withdraw-workspace";

export default async function WithdrawPage({
  searchParams,
}: {
  searchParams?: Promise<{ method?: string; asset?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <WithdrawWorkspace
        initialMethod={params?.method}
        initialAsset={params?.asset}
      />
    </>
  );
}
