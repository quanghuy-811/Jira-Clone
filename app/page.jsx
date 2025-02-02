import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold">Jira Clone</div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              The #1 software
              <br />
              development tool
            </h1>
            <p className="text-xl text-gray-600">
              Plan, track, and manage your agile and software development
              projects with Jira Clone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="px-8">
                <Link href="/auth/register">Get it free</Link>
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1">
            <img
              src="/hero.svg"
              alt="Project Management"
              className="w-full max-w-2xl mx-auto"
            />
          </div>
        </div>

        {/* Features */}
        <section className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Project management made easy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-2">Project Planning</h3>
              <p className="text-gray-600">
                Create, organize, and plan your projects with ease.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-2">Task Management</h3>
              <p className="text-gray-600">
                Track and manage tasks efficiently with our intuitive interface.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Work together seamlessly with your team members.
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
