import AuthForm from "@/components/auth-form";

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center p-4 py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
