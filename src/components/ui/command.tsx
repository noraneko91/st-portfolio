// shadcn/ui の Command (cmdk) をもとに、サイトの配色変数に合わせて調整したもの (ADR 0005)
// shadcn/ui의 Command (cmdk)를 바탕으로 사이트 색 변수에 맞춰 조정한 것 (ADR 0005)
import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from 'cn';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn('flex h-full w-full flex-col overflow-hidden bg-bg text-text', className)}
      {...props}
    />
  );
}

function CommandDialog({
  title,
  description,
  closeLabel,
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & { title: string; description: string; closeLabel: string }) {
  return (
    <Dialog {...props}>
      <DialogContent closeLabel={closeLabel}>
        {/* 見出しと説明は読み上げ用 / 제목과 설명은 스크린리더용 */}
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>
        <Command loop>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-14 items-center gap-3 border-b border-border pr-12 pl-4">
      <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn('h-full w-full bg-transparent text-base outline-none placeholder:text-muted', className)}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn('max-h-[min(60vh,24rem)] scroll-py-2 overflow-x-hidden overflow-y-auto p-2', className)}
      {...props}
    />
  );
}

function CommandEmpty(props: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return <CommandPrimitive.Empty data-slot="command-empty" className="py-8 text-center text-sm text-muted" {...props} />;
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'pb-2 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:text-muted',
        className,
      )}
      {...props}
    />
  );
}

// 選択中の項目は背景とテーマ色の左線で示す (色だけに頼らない) / 선택 중인 항목은 배경과 포인트 컬러 왼쪽 선으로 표시한다 (색에만 의존하지 않는다)
function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'flex min-h-11 cursor-pointer items-center gap-3 border-l-2 border-transparent px-3 text-sm select-none data-[selected=true]:border-accent data-[selected=true]:bg-surface',
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return <span data-slot="command-shortcut" className={cn('ml-auto font-mono text-xs text-muted', className)} {...props} />;
}

export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut };
