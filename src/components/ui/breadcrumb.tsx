"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight2 } from "iconsax-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-center gap-1.5 text-sm"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <ArrowRight2
                size={14}
                color="currentColor"
                style={{ color: "var(--dbx-text-tertiary)" }}
              />
            )}
            {item.href && !isLast ? (
              <button
                onClick={() => router.push(item.href!)}
                className="transition-colors duration-200 cursor-pointer hover:underline"
                style={{
                  color: isLast
                    ? "var(--dbx-text-primary)"
                    : "var(--dbx-text-tertiary)",
                }}
              >
                {item.label}
              </button>
            ) : (
              <span
                style={{
                  color: isLast
                    ? "var(--dbx-text-primary)"
                    : "var(--dbx-text-tertiary)",
                  fontWeight: isLast ? 500 : 400,
                }}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </motion.nav>
  );
}
