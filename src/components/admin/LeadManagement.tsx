import React, { useEffect, useState } from 'react';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { supabase } from '../../lib/auth';
import { MoreHorizontal, FileText, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Lead {
  id: string;
  created_at: string;
  customer_name: string;
  email: string;
  phone: string;
  service_type: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
}

export function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading = false;
    }
  }

  async function updateLeadStatus(leadId: string, status: Lead['status']) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  }

  async function deleteLead(leadId: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  }

  const columns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString()
    },
    {
      accessorKey: 'customer_name',
      header: 'Customer Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone',
      header: 'Phone'
    },
    {
      accessorKey: 'service_type',
      header: 'Service Type'
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Lead['status'];
        const colors = {
          new: 'bg-blue-100 text-blue-800',
          contacted: 'bg-yellow-100 text-yellow-800',
          qualified: 'bg-green-100 text-green-800',
          converted: 'bg-purple-100 text-purple-800',
          lost: 'bg-red-100 text-red-800'
        };

        return (
          <Badge className={colors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const lead = row.original as Lead;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'contacted')}>
                Mark as Contacted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'qualified')}>
                Mark as Qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'converted')}>
                Mark as Converted
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'lost')}>
                Mark as Lost
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => deleteLead(lead.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={leads}
        searchKey="customer_name"
      />
    </div>
  );
}
