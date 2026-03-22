import { AppLayout } from "@/components/AppLayout";
import { importBatches } from "@/lib/mock-data";
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function ImportHub() {
  return (
    <AppLayout title="Import Hub">
      <div className="space-y-6">
        {/* Upload Zone */}
        <Card className="animate-in-up border-border shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 transition-colors hover:border-primary/50 cursor-pointer">
              <div className="rounded-xl bg-primary/10 p-4 mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium">Drop your Excel or CSV file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse — .xlsx, .csv supported</p>
              <Button className="mt-4" size="sm">Select File</Button>
            </div>
          </CardContent>
        </Card>

        {/* Import History */}
        <Card className="animate-in-up border-border shadow-sm" style={{ animationDelay: "120ms" }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Import History</CardTitle>
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
