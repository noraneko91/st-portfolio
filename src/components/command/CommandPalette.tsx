import * as React from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';

// Astro 側で組み立てて data 属性で渡すデータ (文言は i18n ファイルから) / Astro 쪽에서 만들어 data 속성으로 넘기는 데이터 (문구는 i18n 파일에서)
export type PaletteData = {
  storageKey: string;
  labels: {
    title: string;
    description: string;
    placeholder: string;
    empty: string;
    close: string;
    pages: string;
    language: string;
    links: string;
  };
  pages: { label: string; href: string }[];
  languages: { code: string; name: string; href: string; htmlLang: string; current: boolean }[];
  links: { label: string; href: string }[];
};

export function CommandPalette({ data, initialOpen }: { data: PaletteData; initialOpen: boolean }) {
  const [open, setOpen] = React.useState(initialOpen);
  const { labels } = data;

  // 読み込み後は Ctrl/⌘+K とヘッダーのボタンの両方で開く / 로드 후에는 Ctrl/⌘+K와 헤더 버튼 모두로 연다
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('command-palette:open', onOpen);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('command-palette:open', onOpen);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={labels.title}
      description={labels.description}
      closeLabel={labels.close}
    >
      <CommandInput placeholder={labels.placeholder} />
      <CommandList>
        <CommandEmpty>{labels.empty}</CommandEmpty>
        <CommandGroup heading={labels.pages}>
          {data.pages.map((page) => (
            <CommandItem key={page.href} value={page.label} onSelect={() => go(page.href)}>
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={labels.language}>
          {data.languages.map((language) => (
            <CommandItem
              key={language.code}
              value={`${language.code} ${language.name}`}
              onSelect={() => {
                try {
                  localStorage.setItem(data.storageKey, language.code);
                } catch {
                  // 保存できなくても移動は続ける / 저장할 수 없어도 이동은 계속한다
                }
                go(language.href);
              }}
            >
              <span lang={language.htmlLang}>{language.name}</span>
              {language.current && (
                <span aria-hidden="true" className="text-accent">
                  ●
                </span>
              )}
              <CommandShortcut>{language.code.toUpperCase()}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={labels.links}>
          {data.links.map((link) => (
            <CommandItem key={link.href} value={link.label} onSelect={() => go(link.href)}>
              {link.label}
              <CommandShortcut aria-hidden="true">↗</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
