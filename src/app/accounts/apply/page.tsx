import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";

export default function ApplyOnlinePage() {
  return <AccountDetailPage account={accountPages.apply} />;
}
