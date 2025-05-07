"use client";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  return (
    <pre className={cn(
      "bg-secondary rounded-md p-4 overflow-x-auto font-mono text-sm my-4",
      "border border-border",
      className
    )}>
      <code>{code}</code>
    </pre>
  );
}