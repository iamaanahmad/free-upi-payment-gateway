import AuthForm from "@/components/auth-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
