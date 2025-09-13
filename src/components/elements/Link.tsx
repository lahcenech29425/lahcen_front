"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  isExternal?: boolean;
  children: React.ReactNode;
}

function isExternalUrl(url: string) {
  return /^https?:\/\//.test(url) || url.startsWith("//");
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, isExternal, children, ...props }, ref) => {
    const router = useRouter();
    const external = isExternal ?? isExternalUrl(href);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!external) {
        e.preventDefault();
        router.push(href);
      }
      if (props.onClick) props.onClick(e);
    };
    return (
      <a
        ref={ref}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Link";
