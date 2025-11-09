"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import {useTranslations, useLocale} from 'next-intl';
import LanguageSwitcher from './language-switcher';

export default function Header() {
  const t = useTranslations('Header');
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const locale = useLocale();

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push(`/${locale}/`);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="UPI PG Logo" width={28} height={28} className="h-7 w-7" />
          {t('title')} <Badge variant="default" className="text-xs px-2 py-0.5 ml-1">{t('subtitle')}</Badge>
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
                <DropdownMenuItem onClick={() => router.push(`/${locale}/dashboard`)}>
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
                <Link href={`/${locale}/login`}>{t('login')}</Link>
              </Button>
              <Button asChild>
                <Link href={`/${locale}/signup`}>{t('signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
