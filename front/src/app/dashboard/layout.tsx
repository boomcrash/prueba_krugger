import Header from "@/presentation/components/Header";
import NavigationDrawer from "@/presentation/components/NavigationDrawer";
import { cookies } from "next/headers";
import { decodeToken, isTokenExpired } from "@/utils/jwt";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token || isTokenExpired(token)) {
    redirect("/login");
  }

  const decoded = decodeToken(token);
  if (!decoded) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <NavigationDrawer roles={decoded.roles} />
      <div className="flex-1 ml-16">
        <Header username={decoded.sub} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
