import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";

export default function SavingsAccountsPage() {
  return <AccountDetailPage account={accountPages.savings} />;
}
