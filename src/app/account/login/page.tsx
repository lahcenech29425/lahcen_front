import LoginForm from "@/components/form/account/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <LoginForm />
      </div>
    </main>
  );
}