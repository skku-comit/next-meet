import { RecoilRoot } from "recoil";
import AuthProvider from "@/lib/auth/SessionProvider";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <RecoilRoot>
      <AuthProvider>
        {children}
      </AuthProvider>
    </RecoilRoot>
  );
}
