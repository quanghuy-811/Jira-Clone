import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Create your account
            </h2>
            <p className="text-gray-600 mt-2">
              Start your journey with our Jira Clone
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>

      {/* Right Side - Image & Text */}
      <div className="hidden lg:flex flex-1 bg-blue-600">
        <div className="w-full flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-md space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Welcome to Jira Clone
              </h1>
              <p className="text-lg text-white/90">
                Plan, track, and manage your agile and software development
                projects with efficiency.
              </p>
            </div>
            <div className="relative w-full aspect-square max-w-md">
              <img
                src="/welcome-illustration.svg"
                alt="Collaboration Illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
