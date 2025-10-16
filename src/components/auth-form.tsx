"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth, initiateEmailSignUp, initiateEmailSignIn, initiateGoogleSignIn } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next-intl/link";
import { onAuthStateChanged } from "firebase/auth";
import { Separator } from "@/components/ui/separator";
import {useTranslations} from 'next-intl';
import {useRouter} from 'next-intl/client';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.356-11.297-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.25,44,30.42,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);


type AuthFormProps = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const t = useTranslations(mode === 'login' ? 'LoginPage' : 'SignupPage');
  const t_toasts = useTranslations('Toasts');

  const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthSuccess = () => {
    toast({ title: mode === 'login' ? t_toasts('loginSuccess') : t_toasts('signupSuccess') });
    router.push("/dashboard");
  }

  const handleAuthError = () => {
    toast({
        title: t_toasts('authFailed'),
        description: t_toasts('authFailedDescription'),
        variant: "destructive",
      });
  }

  const setupAuthListener = () => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      setLoading(false);
      if (user) {
        handleAuthSuccess();
      }
    });
    return unsubscribe;
  }

  const onEmailSubmit = (values: z.infer<typeof formSchema>) => {
    const unsubscribe = setupAuthListener();
    
    onAuthStateChanged(auth, (user, error) => {
        unsubscribe(); 
        setLoading(false);
        if (user) {
            handleAuthSuccess();
        } else if (error) {
            handleAuthError();
        }
    });

    if (mode === "signup") {
      initiateEmailSignUp(auth, values.email, values.password);
    } else {
      initiateEmailSignIn(auth, values.email, values.password);
    }
  };

  const onGoogleSubmit = () => {
    setupAuthListener();
    initiateGoogleSignIn(auth);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={onGoogleSubmit} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                {t('googleButton')}
            </Button>
            <div className="flex items-center space-x-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">{t('orContinue')}</span>
                <Separator className="flex-1" />
            </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEmailSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('emailLabel')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('emailPlaceholder')} {...field} />
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
                  <FormLabel>{t('passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('submitButton')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {mode === 'login' ? (
            <>
              {t('signupPrompt')}
              <Link href="/signup" className="underline text-primary">
                {t('signupLink')}
              </Link>
            </>
          ) : (
            <>
              {t('loginPrompt')}
              <Link href="/login" className="underline text-primary">
                {t('loginLink')}
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
