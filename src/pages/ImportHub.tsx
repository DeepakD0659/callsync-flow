import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Wizard, type WizardStep } from "@/components/Wizard";
import { importBatches, agents, clients } from "@/lib/mock-data";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Link2, Link2Off, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function UploadStep() {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border p-12 transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer">
          <div className="rounded-2xl bg-primary/10 p-5 mb-4">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <p className="text-base font-semibold">Drop your Excel or CSV file here</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse — .xlsx, .csv supported</p>
          <Button className="mt-5" size="sm">Select File</Button>
        </div>
      </CardContent>
    </Card>
  );
}

const columnMappings = [
  { source: "ACC_IDENTIFIER", target: "Account No", mapped: true },
  { source: "LEGAL_FULL_NAME", target: "Customer Name", mapped: true },
  { source: "PRIMARY_PHONE", target: "", mapped: false },
  { source: "OWING_AMT_USD", target: "Current Balance", mapped: true },
];

function MappingStep() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Column Association</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              <RefreshCw className="h-3 w-3" /> Re-run Auto-map
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-8" />
                  <TableHead className="text-xs">Excel Header (Source)</TableHead>
                  <TableHead className="text-xs">Database Field (Target)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columnMappings.map((col, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs text-muted-foreground font-mono">{String.fromCharCode(65 + i)}</TableCell>
                    <TableCell className="font-mono text-sm font-medium">{col.source}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={col.target || undefined}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="-- Select Field --" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Account No">Account No</SelectItem>
                            <SelectItem value="Customer Name">Customer Name</SelectItem>
                            <SelectItem value="Phone Number">Phone Number</SelectItem>
                            <SelectItem value="Current Balance">Current Balance</SelectItem>
                          </SelectContent>
                        </Select>
                        {col.mapped ? (
                          <Link2 className="h-4 w-4 text-success shrink-0" />
                        ) : (
                          <Link2Off className="h-4 w-4 text-warning shrink-0" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileSpreadsheet className="h-4 w-4 text-primary" /> Source Scan
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold tabular-nums">12,482</p>
                <p className="text-[11px] text-muted-foreground">Total Records</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold tabular-nums text-success">86%</p>
                <p className="text-[11px] text-muted-foreground">Auto-match</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold">Architectural Pro-tip</p>
                <p className="text-[11px] text-muted-foreground mt-1">Ensure your CSV date formats match (YYYY-MM-DD) to avoid validation errors.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ValidateStep() {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-success">12,475</p>
            <p className="text-xs text-muted-foreground">Valid Records</p>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-warning">4</p>
            <p className="text-xs text-muted-foreground">Duplicates Found</p>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center">
            <p className="text-2xl font-bold tabular-nums text-destructive">3</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </div>
        </div>
        <div className="rounded-xl border border-border p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Error Details</p>
          {["Row 445: Missing phone number", "Row 1,201: Invalid account format", "Row 8,982: Negative balance value"].map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
              <span className="text-muted-foreground">{err}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AssignStep() {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6 space-y-4">
        <p className="text-sm text-muted-foreground">Distribute validated records to your recovery team.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Agent</TableHead>
              <TableHead className="text-xs text-right">Records</TableHead>
              <TableHead className="text-xs text-right">Est. Value</TableHead>
              <TableHead className="text-xs">Workload</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.filter(a => a.isActive).map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium text-sm">{agent.name}</TableCell>
                <TableCell className="text-right tabular-nums">{Math.floor(Math.random() * 200 + 100)}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">₹{Math.floor(Math.random() * 50 + 10)}L</TableCell>
                <TableCell>
                  <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.random() * 60 + 30}%` }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function FinishStep() {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="rounded-full bg-success/10 p-5">
          <CheckCircle className="h-12 w-12 text-success" />
        </div>
        <h3 className="text-xl font-bold">Import Complete</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          12,475 records have been validated and distributed across 4 agents. Call campaigns begin immediately.
        </p>
      </CardContent>
    </Card>
  );
}

export default function ImportHub() {
  const wizardSteps: WizardStep[] = [
    { id: "upload", label: "Upload", content: <UploadStep /> },
    { id: "mapping", label: "Mapping", content: <MappingStep /> },
    { id: "validate", label: "Validate", content: <ValidateStep /> },
    { id: "assign", label: "Assign", content: <AssignStep /> },
    { id: "finish", label: "Finish", content: <FinishStep /> },
  ];

  return (
    <AppLayout title="Import & Assign Data">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground animate-in-up">
          Follow the architectural flow to ingest financial records and distribute them to your recovery team.
        </p>

        <div className="animate-in-up" style={{ animationDelay: "80ms" }}>
          <Wizard steps={wizardSteps} onComplete={() => {}} />
        </div>

        {/* Import History */}
        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "160ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Previous Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">File</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs text-right">Processed</TableHead>
                  <TableHead className="text-xs text-right">Failed</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">{batch.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(batch.uploadTimestamp), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{batch.recordsProcessed}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {batch.recordsFailed > 0 ? (
                        <span className="text-destructive font-medium">{batch.recordsFailed}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {batch.recordsFailed === 0 ? (
                        <span className="flex items-center gap-1 text-xs text-success"><CheckCircle className="h-3 w-3" /> Clean</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-warning"><XCircle className="h-3 w-3" /> Errors</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
