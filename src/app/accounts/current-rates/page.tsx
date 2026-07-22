import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";

export default function CurrentRatesPage() {
  return <AccountDetailPage account={accountPages.rates} />;
}
