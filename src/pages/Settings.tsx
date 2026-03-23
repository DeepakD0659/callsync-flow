import { AppLayout } from "@/components/AppLayout";
import { useTheme, type ThemeName, type FontFamily, type Density } from "@/contexts/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Waves, Check, RotateCcw, User, Palette, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const themes: { id: ThemeName; label: string; icon: typeof Sun; desc: string }[] = [
  { id: "light", label: "Light Mode", icon: Sun, desc: "Clean and professional" },
  { id: "dark", label: "Dark Mode", icon: Moon, desc: "Easy on the eyes" },
  { id: "banking", label: "Banking Blue", icon: Waves, desc: "Premium institutional" },
];

const fonts: { id: FontFamily; label: string; sample: string }[] = [
  { id: "lexend", label: "Lexend", sample: "Modern and readable" },
  { id: "inter", label: "Inter", sample: "Clean and geometric" },
];

const densities: { id: Density; label: string }[] = [
  { id: "comfortable", label: "Comfortable" },
  { id: "compact", label: "Compact" },
];

export default function Settings() {
  const { theme, setTheme, font, setFont, density, setDensity } = useTheme();

  const resetAll = () => {
    setTheme("light");
    setFont("lexend");
    setDensity("comfortable");
  };

  return (
    <AppLayout title="Settings & Customization">
      <p className="text-sm text-muted-foreground mb-6 animate-in-up">
        Architect your personal workflow and visual experience.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <Card className="animate-in-up border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-primary" /> Profile Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-primary-foreground shadow-lg">
                AS
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                <Input defaultValue="Alexander Sterling" className="h-9" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Employee ID</Label>
                <Input defaultValue="#RP-99281" readOnly className="h-9 bg-muted/50" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Division</Label>
                <Input defaultValue="Institutional Assets" readOnly className="h-9 bg-muted/50" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Primary Email</Label>
              <Input defaultValue="a.sterling@recoverypro.com" className="h-9" />
            </div>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "80ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm"><Shield className="h-4 w-4 text-primary" /> Role & Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-semibold">Administrator Access</p>
              <p className="text-xs text-muted-foreground mt-1">Full system oversight and policy editing.</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-semibold">Recovery Agent</p>
              <p className="text-xs text-muted-foreground mt-1">Access to worklists and call controls.</p>
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              Some permissions are managed by the Global Identity Provider.
            </p>
          </CardContent>
        </Card>

        {/* Theme Customization */}
        <Card className="lg:col-span-2 animate-in-up border-border shadow-sm" style={{ animationDelay: "160ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm"><Palette className="h-4 w-4 text-primary" /> Theme Customization Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Visual Aesthetic */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visual Aesthetic</Label>
                <div className="space-y-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "flex items-center gap-3 w-full rounded-xl border p-3 text-left transition-all",
                        theme === t.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <t.icon className={cn("h-5 w-5", theme === t.id ? "text-primary" : "text-muted-foreground")} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                      </div>
                      {theme === t.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Typeface</Label>
                <div className="space-y-2">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFont(f.id)}
                      className={cn(
                        "flex items-center gap-3 w-full rounded-xl border p-3 text-left transition-all",
                        font === f.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <span className="text-lg font-bold text-foreground" style={{ fontFamily: f.id === "lexend" ? "Lexend" : "Inter" }}>
                        Aa
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{f.label}</p>
                        <p className="text-[11px] text-muted-foreground">{f.sample}</p>
                      </div>
                      {font === f.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>

                <Separator />

                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interface Density</Label>
                <div className="flex gap-2">
                  {densities.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDensity(d.id)}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                        density === d.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Real-time Preview</Label>
                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="rounded-lg bg-card border border-border p-3 shadow-sm">
                    <div className="h-2 w-16 rounded bg-primary mb-2" />
                    <div className="h-1.5 w-24 rounded bg-muted" />
                    <div className="h-1.5 w-20 rounded bg-muted mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 flex-1 rounded bg-primary/10 border border-primary/20" />
                    <div className="h-6 flex-1 rounded bg-success/10 border border-success/20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-[10px] text-muted-foreground">Live Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset */}
        <Card className="lg:col-span-2 animate-in-up border-destructive/20 shadow-sm" style={{ animationDelay: "240ms" }}>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-semibold">System Reset</p>
              <p className="text-xs text-muted-foreground">Revert all interface customizations to factory default settings.</p>
            </div>
            <Button variant="outline" onClick={resetAll} className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
              <RotateCcw className="h-4 w-4" /> Reset Workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
