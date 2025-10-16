"use client";

import { Link, useRouter } from 'next-intl/client';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import {useTranslations} from 'next-intl';
import LanguageSwitcher from './language-switcher';

export default function Header() {
  const t = useTranslations('Header');
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"/><path d="M10 17v-1a2 2 0 1 1 4 0v1"/><path d="M22 17v-1a2 2 0 1 0-4 0v1"/><path d="M12 21v-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V21"/></svg>
          {t('title')} <Badge variant="default" className="text-xl px-2 py-0.5">{t('subtitle')}</Badge>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isUserLoading ? (
            <Skeleton className="h-10 w-24 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? ''} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem disabled>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        {user.displayName ? user.email : ''}
                        </p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>{t('dashboard')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t('signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
