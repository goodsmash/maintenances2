import React, { useEffect, useState } from 'react';
import { DataTable } from '../ui/data-table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getAllUsers, updateUserRole, UserProfile } from '../../lib/auth';
import { MoreHorizontal, UserCog, Ban } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading = false;
    }
  }

  async function handleRoleUpdate(userId: string, role: UserProfile['role']) {
    try {
      await updateUserRole(userId, role);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }

  const columns = [
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString()
    },
    {
      accessorKey: 'full_name',
      header: 'Name'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as UserProfile['role'];
        const colors = {
          user: 'bg-blue-100 text-blue-800',
          admin: 'bg-purple-100 text-purple-800',
          contractor: 'bg-green-100 text-green-800'
        };

        return (
          <Badge className={colors[role]}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'subscription_tier',
      header: 'Subscription',
      cell: ({ row }) => {
        const tier = row.getValue('subscription_tier') as string;
        const colors = {
          free: 'bg-gray-100 text-gray-800',
          basic: 'bg-blue-100 text-blue-800',
          premium: 'bg-purple-100 text-purple-800',
          enterprise: 'bg-yellow-100 text-yellow-800'
        };

        return (
          <Badge className={colors[tier] || colors.free}>
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'subscription_status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('subscription_status') as string;
        const colors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800'
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
        const user = row.original as UserProfile;

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
              <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'admin')}>
                <UserCog className="h-4 w-4 mr-2" />
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'contractor')}>
                <UserCog className="h-4 w-4 mr-2" />
                Make Contractor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'user')}>
                <UserCog className="h-4 w-4 mr-2" />
                Reset to User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Ban className="h-4 w-4 mr-2" />
                Suspend User
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
        data={users}
        searchKey="email"
      />
    </div>
  );
}
