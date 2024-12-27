import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  File,
  Upload,
  Download,
  Eye,
  Trash2,
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'archived';
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  size: number;
  owner: string;
  sharedWith: string[];
  tags: string[];
  version: string;
  signatureRequired: boolean;
  signatures?: {
    name: string;
    role: string;
    signedAt?: string;
    status: 'pending' | 'signed' | 'rejected';
  }[];
}

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.string().min(1, 'Document type is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()),
  expiryDate: z.string().optional(),
  signatureRequired: z.boolean(),
  file: z.any(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const documentTypes = [
  'Contract',
  'Agreement',
  'Invoice',
  'Quote',
  'Certificate',
  'License',
  'Insurance',
  'Report',
  'Policy',
];

const documentCategories = [
  'Service Agreements',
  'Customer Contracts',
  'Contractor Agreements',
  'Legal Documents',
  'Financial Documents',
  'Compliance Documents',
  'Training Materials',
  'Policies and Procedures',
];

export function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      type: '',
      category: '',
      tags: [],
      signatureRequired: false,
    },
  });

  useEffect(() => {
    loadDocuments();
  }, [searchQuery, categoryFilter, statusFilter]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.getDocuments({
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
      });
      setDocuments(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DocumentFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'file') {
          formData.append('file', value[0]);
        } else if (key === 'tags') {
          formData.append('tags', JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      await api.uploadDocument(formData);
      setIsUploadOpen(false);
      loadDocuments();
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      const response = await api.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (documentId: string) => {
    try {
      const shareLink = await api.generateShareLink(documentId);
      // Copy link to clipboard
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: 'Success',
        description: 'Share link copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate share link',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.deleteDocument(documentId);
      loadDocuments();
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Document Management</h2>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a new document to the system
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {documentCategories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category.toLowerCase()}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="signatureRequired"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Requires Signature</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Upload the document file (PDF, DOC, DOCX)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {documentCategories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Manage your documents and their statuses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4" />
                      <span>{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === 'active'
                          ? 'default'
                          : doc.status === 'expired'
                          ? 'destructive'
                          : doc.status === 'pending'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(doc.updatedAt), 'PP')}
                  </TableCell>
                  <TableCell>{formatFileSize(doc.size)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(doc.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare(doc.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Preview Dialog */}
      {selectedDocument && (
        <Dialog
          open={!!selectedDocument}
          onOpenChange={() => setSelectedDocument(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedDocument.name}</DialogTitle>
              <DialogDescription>
                Document details and preview
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Document Information</h4>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Type</dt>
                      <dd>{selectedDocument.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Category</dt>
                      <dd>{selectedDocument.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Version</dt>
                      <dd>{selectedDocument.version}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Owner</dt>
                      <dd>{selectedDocument.owner}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium">Status Information</h4>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Status</dt>
                      <dd>
                        <Badge
                          variant={
                            selectedDocument.status === 'active'
                              ? 'default'
                              : selectedDocument.status === 'expired'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {selectedDocument.status}
                        </Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Created</dt>
                      <dd>
                        {format(new Date(selectedDocument.createdAt), 'PPp')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Last Updated</dt>
                      <dd>
                        {format(new Date(selectedDocument.updatedAt), 'PPp')}
                      </dd>
                    </div>
                    {selectedDocument.expiryDate && (
                      <div>
                        <dt className="text-sm text-gray-500">Expires</dt>
                        <dd>
                          {format(new Date(selectedDocument.expiryDate), 'PP')}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              {selectedDocument.signatureRequired && (
                <div>
                  <h4 className="font-medium mb-2">Signatures</h4>
                  <div className="space-y-2">
                    {selectedDocument.signatures?.map((signature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div>
                          <p className="font-medium">{signature.name}</p>
                          <p className="text-sm text-gray-500">
                            {signature.role}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {signature.status === 'signed' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-500">
                                Signed on{' '}
                                {format(new Date(signature.signedAt!), 'PP')}
                              </span>
                            </>
                          ) : signature.status === 'pending' ? (
                            <>
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-500">
                                Pending signature
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-gray-500">
                                Rejected
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Preview */}
              <div className="border rounded-lg p-4 h-[400px] overflow-auto">
                <iframe
                  src={`/api/documents/${selectedDocument.id}/preview`}
                  className="w-full h-full"
                  title="Document Preview"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
