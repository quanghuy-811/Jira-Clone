import Footer from "@/components/footer";
import { MainNav } from "@/components/main-nav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <MainNav />
      <main className="container flex-grow mx-auto py-6 px-4">{children}</main>
      {/* <Footer /> */}
      <footer className="w-full text-center py-4 text-sm text-gray-500 border-t">
        Copyright © 2025 Jira
      </footer>
    </div>
  );
}
