import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lib/utils";

const shellVariants = cva(
  "grid mb-0 ml-0 items-center gap-2 pb-6 pt-1 md:py-3",
  {
    variants: {
      variant: {
        default: "container p-1 ",
        sidebar: "",
        centered:
          "container flex h-dvh max-w-2xl flex-col justify-center py-16",
        markdown: "container max-w-3xl py-2 md:py-5 lg:py-5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface ShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof shellVariants> {
  as?: React.ElementType;
}

function Shell({
  className,
  as: Comp = "section",
  variant,
  ...props
}: ShellProps) {
  return (
    <Comp className={cn(shellVariants({ variant }), className)} {...props} />
  );
}

export { Shell, shellVariants };
