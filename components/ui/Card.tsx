import * as React from "react";

import { cn } from "@/lib/cn";

/* ── Card root ── */
export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverable?: boolean;
};

export function Card({ className, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        "dark:border-slate-700 dark:bg-slate-900",
        hoverable &&
          "cursor-pointer transition-shadow duration-200 hover:shadow-md dark:hover:shadow-slate-800/60",
        className,
      )}
      {...props}
    />
  );
}

/* ── Card sub-components ── */

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center px-6 pb-6",
        className,
      )}
      {...props}
    />
  );
}

export function CardImage({
  className,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className={cn("w-full rounded-t-xl object-cover", className)}
      {...props}
    />
  );
}
