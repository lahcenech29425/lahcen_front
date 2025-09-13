import RegisterForm from "@/components/form/account/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-8 my-16">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
        <RegisterForm />
      </div>
    </main>
  );
}