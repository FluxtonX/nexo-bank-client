import { UserShell } from "@/components/dashboard/user-shell";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserShell>{children}</UserShell>;
}
