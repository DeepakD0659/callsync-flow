import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Sun, Waves, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme, type ThemeName } from "@/contexts/ThemeContext";
import { useAppData } from "@/contexts/AppDataContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeIcons: Record<ThemeName, typeof Sun> = { light: Sun, dark: Moon, banking: Waves };

export function AppLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { theme, setTheme } = useTheme();
  const { role, setRole, loading, error } = useAppData();
  const ThemeIcon = themeIcons[theme];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-lg">
            <SidebarTrigger className="shrink-0" />
            <Separator orientation="vertical" className="h-5" />
            {title && <h1 className="text-sm font-bold truncate">{title}</h1>}

            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="h-8 w-52 pl-8 text-xs bg-muted/50 border-0" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ThemeIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="mr-2 h-4 w-4" /> Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="mr-2 h-4 w-4" /> Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("banking")}><Waves className="mr-2 h-4 w-4" /> Banking Blue</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setRole(role === "ADMIN" ? "AGENT" : "ADMIN")}
              >
                {role}
              </Button>

              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-bold text-primary-foreground shadow-sm">
                AT
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="h-[55vh] flex items-center justify-center text-sm text-muted-foreground">Loading workspace...</div>
            ) : error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
