export const clientQueryKeys = {
  all: ["client"] as const,
  dashboard: () => [...clientQueryKeys.all, "dashboard"] as const,
  wallets: () => [...clientQueryKeys.all, "wallets"] as const,
  transactions: () => [...clientQueryKeys.all, "transactions"] as const,
  withdrawalRequests: () => [...clientQueryKeys.all, "withdrawal-requests"] as const,
  withdrawBalance: () => [...clientQueryKeys.all, "withdraw-balance"] as const,
};
