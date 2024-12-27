import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface BillingRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
}

export function BillingHistory() {
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function loadBillingHistory() {
      try {
        const history = await api.getBillingHistory();
        setBillingHistory(history);
      } catch (error) {
        console.error('Failed to load billing history:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBillingHistory();
  }, []);

  const handleDownloadInvoice = async (record: BillingRecord) => {
    if (!record.invoiceUrl) return;

    try {
      setDownloading(record.id);
      const response = await fetch(record.invoiceUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${record.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (status: BillingRecord['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>
          View and download your past invoices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {billingHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No billing history available
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {format(new Date(record.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>${record.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {record.invoiceUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(record)}
                        disabled={downloading === record.id}
                      >
                        {downloading === record.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="sr-only">Download Invoice</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Need help with your billing?{' '}
            <a href="/support" className="text-primary hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
