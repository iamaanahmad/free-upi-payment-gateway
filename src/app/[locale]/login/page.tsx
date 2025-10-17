import AuthForm from "@/components/auth-form";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4 py-8 md:py-12">
      <AuthForm mode="login" />
    </div>
  );
}
