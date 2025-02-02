// app/dashboard/layout.js
import { MainNav } from "@/components/main-nav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <MainNav />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
