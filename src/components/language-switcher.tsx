'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {locales, localeNames} from '@/i18n';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from 'next-intl/client';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    router.replace(pathname, {locale: value});
  };

  return (
    <Select onValueChange={onSelectChange} defaultValue={locale}>
        <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t('label')} />
        </SelectTrigger>
        <SelectContent>
            {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
                {localeNames[loc]}
            </SelectItem>
            ))}
        </SelectContent>
    </Select>
  );
}
