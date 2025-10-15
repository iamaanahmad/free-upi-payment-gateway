"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Account created successfully!" });
      } else {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Logged in successfully!" });
      }
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.code.replace('auth/', '').replace(/-/g, ' '),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Log In" : "Sign Up"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account."
            : "Create an account to start generating UPI links."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "login" ? "Log In" : "Sign Up"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline text-primary">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/login" className="underline text-primary">
                Log in
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
