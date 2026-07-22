import { AccountDetailPage } from "../_components/account-detail-page";
import { accountPages } from "../_components/account-data";

export default function StudentBankingPage() {
  return <AccountDetailPage account={accountPages.student} />;
}
