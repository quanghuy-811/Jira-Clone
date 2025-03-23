import { MainNav } from "@/components/main-nav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <MainNav />
      <main className="container flex-grow mx-auto py-6 px-4">{children}</main>
      {/* <footer className="w-full bg-gray-900 text-white text-center p-4">
        <p className="text-sm">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </footer> */}
    </div>
  );
}
