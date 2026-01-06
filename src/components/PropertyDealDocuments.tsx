/**
 * Property Deal Documents Component
 * Shows documents for a specific property deal (Option 2 integration)
 * Provides smart auto-fill from property and transaction data
 */

import { useState, useEffect } from 'react';
import { Plus, FileText, FileCheck, Home, AlertCircle, Receipt, Download, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { DocumentGeneratorModal } from './DocumentGeneratorModal';
import { getDocumentsByProperty, deleteGeneratedDocument } from '../lib/documents';
import { DOCUMENT_TEMPLATES, DocumentType, GeneratedDocument } from '../types/documents';
import { Property, Transaction, Contact } from '../types';
import { toast } from 'sonner';

interface Props {
  property: Property;
  transaction?: Transaction;
  contacts?: Contact[];
}

const iconMap = {
  FileText,
  FileCheck,
  Home,
  AlertCircle,
  Receipt
};

export function PropertyDealDocuments({ property, transaction, contacts = [] }: Props) {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentType | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [property.id]);

  const loadDocuments = () => {
    const docs = getDocumentsByProperty(property.id);
    setDocuments(docs);
  };

  const handleTemplateSelect = (templateId: DocumentType) => {
    setSelectedTemplate(templateId);
    // Close template selector first to prevent double modal
    setShowTemplateSelector(false);
    // Open generator after a short delay to ensure clean transition
    setTimeout(() => {
      setShowGenerator(true);
    }, 100);
  };

  const handleDocumentGenerated = () => {
    loadDocuments();
    setShowGenerator(false);
    setSelectedTemplate(null);
  };

  const handleDelete = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        deleteGeneratedDocument(documentId);
        loadDocuments();
        toast.success('Document deleted successfully');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleDownload = (document: GeneratedDocument) => {
    // In a real implementation, this would generate and download the PDF
    toast.info('Download functionality will be implemented with PDF generation');
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deal Documents</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Generate legal documents for this property deal
              </p>
            </div>
            <Button onClick={() => setShowTemplateSelector(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Generate New Document
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Documents List */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No documents generated yet</h3>
            <p className="text-sm text-gray-600 mb-4">
              Click "Generate New Document" to create your first document for this deal
            </p>
            <Button variant="outline" onClick={() => setShowTemplateSelector(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc) => {
            const template = DOCUMENT_TEMPLATES.find(t => t.id === doc.documentType);
            const Icon = template ? iconMap[template.icon as keyof typeof iconMap] : FileText;

            return (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-900 truncate">
                            {doc.documentName}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {template?.name || doc.documentType}
                          </p>
                          {doc.details.buyerName && (
                            <p className="text-sm text-gray-500 mt-1">
                              Buyer: {doc.details.buyerName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="text-sm text-gray-500">
                          Created: {new Date(doc.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {doc.clauses.length} Clauses
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Template Selector Modal */}
      <Dialog open={showTemplateSelector} onOpenChange={setShowTemplateSelector}>
        <DialogContent className="max-w-[85vw] max-h-[90vh]">
          <DialogHeader className="space-y-3">
            <DialogTitle>Select Document Template</DialogTitle>
            <DialogDescription>
              Choose a template to generate a document for this property deal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-6">
            {transaction && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Smart Auto-fill:</strong> The selected document will be automatically filled with 
                  buyer, seller, property, and pricing details from this deal.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {DOCUMENT_TEMPLATES.map((template) => {
                const Icon = iconMap[template.icon as keyof typeof iconMap];

                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-end pt-6 border-t">
              <Button variant="outline" onClick={() => setShowTemplateSelector(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Generator Modal - With Smart Auto-fill */}
      {showGenerator && selectedTemplate && (
        <DocumentGeneratorModal
          documentType={selectedTemplate}
          onClose={() => {
            setShowGenerator(false);
            setSelectedTemplate(null);
          }}
          onComplete={handleDocumentGenerated}
          property={property}
          transaction={transaction}
          contacts={contacts}
        />
      )}
    </div>
  );
}
