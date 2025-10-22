"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Shield,
  Key,
  Home,
  Activity,
} from "lucide-react";

const navigation = [
  { name: "Live Monitor", href: "/live", icon: Activity },
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Password-Check", href: "/password-check", icon: Key },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo/Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Cybo</h1>
          <p className="text-xs text-muted-foreground">Security Hub</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-accent/50 p-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-muted-foreground">System gesichert</span>
          </div>
        </div>
      </div>
    </div>
  );
}

