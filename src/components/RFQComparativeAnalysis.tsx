import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  ArrowLeft,
  Calendar,
  FileText,
  Star,
  TrendingDown,
  Package,
  CheckCircle,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';
import { formatPKR } from '../lib/currency';
import { User } from '../types';
import { toast } from 'sonner';

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  specifications: string;
}

interface SupplierBid {
  supplierId: string;
  supplierName: string;
  materialBids: {
    [materialId: string]: {
      pricePerUnit: number;
      totalPrice: number;
      deliveryDays: number;
      notes?: string;
    };
  };
  totalBidAmount: number;
  submissionDate: string;
  validityDays: number;
  status: 'submitted' | 'reviewed' | 'accepted' | 'rejected';
}

interface RFQData {
  id: string;
  title: string;
  projectName: string;
  submissionDeadline: string;
  createdDate: string;
  status: 'open' | 'evaluation' | 'awarded' | 'closed';
  materials: Material[];
  supplierBids: SupplierBid[];
}

interface RFQComparativeAnalysisProps {
  user: User;
  onBack: () => void;
  rfqId?: string;
}

// Mock RFQ data with bids
const mockRFQData: RFQData = {
  id: 'RFQ-2024-001',
  title: 'Cement and Steel Supply - Phase 2 Construction',
  projectName: 'Gulshan Heights Residential Complex',
  submissionDeadline: '2024-02-15T17:00:00',
  createdDate: '2024-01-20',
  status: 'evaluation',
  materials: [
    {
      id: 'MAT-001',
      name: 'OPC Cement 50kg Bags',
      quantity: 1000,
      unit: 'Bags',
      specifications: 'Grade 42.5, conforming to ASTM C150 standards'
    },
    {
      id: 'MAT-002',
      name: 'Steel Reinforcement Bars - 16mm',
      quantity: 5,
      unit: 'Tons',
      specifications: 'Grade 60, ASTM A615 compliant, ribbed bars'
    },
    {
      id: 'MAT-003',
      name: 'Steel Reinforcement Bars - 20mm',
      quantity: 3,
      unit: 'Tons',
      specifications: 'Grade 60, ASTM A615 compliant, ribbed bars'
    },
    {
      id: 'MAT-004',
      name: 'Concrete Admixture',
      quantity: 200,
      unit: 'Liters',
      specifications: 'High-range water reducer, ASTM C494 Type F'
    }
  ],
  supplierBids: [
    {
      supplierId: 'SUP-001',
      supplierName: 'Askari Cement Industries',
      materialBids: {
        'MAT-001': { pricePerUnit: 850, totalPrice: 850000, deliveryDays: 7 },
        'MAT-004': { pricePerUnit: 125, totalPrice: 25000, deliveryDays: 5 }
      },
      totalBidAmount: 875000,
      submissionDate: '2024-02-10',
      validityDays: 30,
      status: 'submitted'
    },
    {
      supplierId: 'SUP-002',
      supplierName: 'Amir Steel Mills',
      materialBids: {
        'MAT-002': { pricePerUnit: 185000, totalPrice: 925000, deliveryDays: 14 },
        'MAT-003': { pricePerUnit: 188000, totalPrice: 564000, deliveryDays: 14 }
      },
      totalBidAmount: 1489000,
      submissionDate: '2024-02-12',
      validityDays: 45,
      status: 'submitted'
    },
    {
      supplierId: 'SUP-005',
      supplierName: 'Master Construction Supply',
      materialBids: {
        'MAT-001': { pricePerUnit: 825, totalPrice: 825000, deliveryDays: 10 },
        'MAT-002': { pricePerUnit: 180000, totalPrice: 900000, deliveryDays: 12 },
        'MAT-003': { pricePerUnit: 182000, totalPrice: 546000, deliveryDays: 12 },
        'MAT-004': { pricePerUnit: 135, totalPrice: 27000, deliveryDays: 7 }
      },
      totalBidAmount: 2298000,
      submissionDate: '2024-02-14',
      validityDays: 30,
      status: 'submitted'
    },
    {
      supplierId: 'SUP-007',
      supplierName: 'Prime Materials Ltd',
      materialBids: {
        'MAT-001': { pricePerUnit: 875, totalPrice: 875000, deliveryDays: 5 },
        'MAT-002': { pricePerUnit: 175000, totalPrice: 875000, deliveryDays: 10 },
        'MAT-004': { pricePerUnit: 120, totalPrice: 24000, deliveryDays: 3 }
      },
      totalBidAmount: 1774000,
      submissionDate: '2024-02-13',
      validityDays: 60,
      status: 'submitted'
    }
  ]
};

export const RFQComparativeAnalysis: React.FC<RFQComparativeAnalysisProps> = ({
  user,
  onBack
}) => {
  const [rfqData] = useState<RFQData>(mockRFQData);
  const [selectedBids, setSelectedBids] = useState<{[materialId: string]: string}>({});

  // Calculate lowest prices for each material
  const lowestPrices = useMemo(() => {
    const lowest: {[materialId: string]: { price: number; supplierId: string }} = {};
    
    rfqData.materials.forEach(material => {
      let minPrice = Infinity;
      let bestSupplier = '';
      
      rfqData.supplierBids.forEach(bid => {
        const materialBid = bid.materialBids[material.id];
        if (materialBid && materialBid.pricePerUnit < minPrice) {
          minPrice = materialBid.pricePerUnit;
          bestSupplier = bid.supplierId;
        }
      });
      
      if (minPrice !== Infinity) {
        lowest[material.id] = { price: minPrice, supplierId: bestSupplier };
      }
    });
    
    return lowest;
  }, [rfqData]);

  // Calculate best total bid
  const lowestTotalBid = useMemo(() => {
    return rfqData.supplierBids.reduce((lowest, bid) => 
      bid.totalBidAmount < lowest.totalBidAmount ? bid : lowest
    );
  }, [rfqData]);

  // Auto-select best bids for each material
  const handleAutoSelectBest = () => {
    const bestSelections: {[materialId: string]: string} = {};
    
    Object.keys(lowestPrices).forEach(materialId => {
      bestSelections[materialId] = lowestPrices[materialId].supplierId;
    });
    
    setSelectedBids(bestSelections);
    toast.success('Best bids selected automatically');
  };

  const handleCreatePOFromBest = () => {
    const selectedMaterials = Object.keys(selectedBids);
    if (selectedMaterials.length === 0) {
      toast.error('Please select bids for materials first');
      return;
    }

    // In a real application, this would create purchase orders
    toast.success(`Purchase orders will be created for ${selectedMaterials.length} materials from selected suppliers`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'bg-green-100 text-green-800 border-green-200',
      evaluation: 'bg-blue-100 text-blue-800 border-blue-200',
      awarded: 'bg-purple-100 text-purple-800 border-purple-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      open: 'Open',
      evaluation: 'Under Evaluation',
      awarded: 'Awarded',
      closed: 'Closed'
    };

    const variant = variants[status as keyof typeof variants] || variants.open;
    const label = labels[status as keyof typeof labels] || status;

    return (
      <Badge className={`${variant} border`}>
        {label}
      </Badge>
    );
  };

  const getBidStatusBadge = (status: SupplierBid['status']) => {
    const variants = {
      submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      reviewed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      submitted: 'Submitted',
      reviewed: 'Under Review',
      accepted: 'Accepted',
      rejected: 'Rejected'
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Smart Procurement
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-medium text-gray-900">{rfqData.title}</h1>
                {getStatusBadge(rfqData.status)}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Deadline: {new Date(rfqData.submissionDeadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Project: {rfqData.projectName}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleAutoSelectBest} className="gap-2">
              <TrendingDown className="h-4 w-4" />
              Auto-Select Best
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export Analysis
            </Button>
            <Button 
              onClick={handleCreatePOFromBest}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Package className="h-4 w-4" />
              Create PO from Best Bids
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Materials</p>
                  <p className="text-2xl font-medium">{rfqData.materials.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Suppliers Responded</p>
                  <p className="text-2xl font-medium">{rfqData.supplierBids.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lowest Total Bid</p>
                  <p className="text-2xl font-medium">{formatPKR(lowestTotalBid.totalBidAmount)}</p>
                  <p className="text-sm text-gray-600">{lowestTotalBid.supplierName}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Potential Savings</p>
                  <p className="text-2xl font-medium text-green-600">15.2%</p>
                  <p className="text-sm text-gray-600">vs highest bid</p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparative Analysis Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bid Comparison Analysis
            </CardTitle>
            <CardDescription>
              Side-by-side comparison of all supplier bids. Lowest prices are highlighted in green.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="min-w-[200px]">Material</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-center">Unit</TableHead>
                      {rfqData.supplierBids.map((bid) => (
                        <TableHead key={bid.supplierId} className="text-center min-w-[150px]">
                          <div className="space-y-1">
                            <div className="font-medium">{bid.supplierName}</div>
                            <div className="text-xs text-gray-600">
                              {getBidStatusBadge(bid.status)}
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Select Best</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rfqData.materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{material.name}</div>
                            <div className="text-sm text-gray-600 max-w-xs">
                              {material.specifications}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{material.quantity}</TableCell>
                        <TableCell className="text-center">{material.unit}</TableCell>
                        {rfqData.supplierBids.map((bid) => {
                          const materialBid = bid.materialBids[material.id];
                          const isLowest = lowestPrices[material.id]?.supplierId === bid.supplierId;
                          
                          return (
                            <TableCell 
                              key={bid.supplierId} 
                              className={`text-center ${isLowest ? 'bg-green-50' : ''}`}
                            >
                              {materialBid ? (
                                <div className={`space-y-1 ${isLowest ? 'text-green-800' : ''}`}>
                                  <div className="font-medium">
                                    {formatPKR(materialBid.pricePerUnit)}
                                    {isLowest && <Star className="inline h-4 w-4 ml-1 text-green-600" />}
                                  </div>
                                  <div className="text-sm">
                                    Total: {formatPKR(materialBid.totalPrice)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {materialBid.deliveryDays} days
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-400 text-sm">No bid</div>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center">
                          {lowestPrices[material.id] && (
                            <Button
                              size="sm"
                              variant={selectedBids[material.id] ? "default" : "outline"}
                              onClick={() => {
                                setSelectedBids(prev => ({
                                  ...prev,
                                  [material.id]: lowestPrices[material.id].supplierId
                                }));
                              }}
                              className="gap-1"
                            >
                              {selectedBids[material.id] ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              {selectedBids[material.id] ? 'Selected' : 'Select'}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Summary Row */}
                    <TableRow className="bg-gray-50 border-t-2">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-blue-600" />
                          Total Bid Amount
                        </div>
                      </TableCell>
                      <TableCell colSpan={2} className="text-center text-sm text-gray-600">
                        Summary
                      </TableCell>
                      {rfqData.supplierBids.map((bid) => {
                        const isLowestTotal = bid.supplierId === lowestTotalBid.supplierId;
                        
                        return (
                          <TableCell 
                            key={bid.supplierId} 
                            className={`text-center ${isLowestTotal ? 'bg-green-100' : ''}`}
                          >
                            <div className={`font-medium text-lg ${isLowestTotal ? 'text-green-800' : ''}`}>
                              {formatPKR(bid.totalBidAmount)}
                              {isLowestTotal && <Star className="inline h-5 w-5 ml-1 text-green-600" />}
                            </div>
                            <div className="text-sm text-gray-600">
                              Valid for {bid.validityDays} days
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <Button
                          onClick={handleCreatePOFromBest}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          Create POs
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Details */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Submission Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rfqData.supplierBids.map((bid) => (
                <div key={bid.supplierId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{bid.supplierName}</h4>
                    {getBidStatusBadge(bid.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bid:</span>
                      <span className="font-medium">{formatPKR(bid.totalBidAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Submitted:</span>
                      <span>{new Date(bid.submissionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid for:</span>
                      <span>{bid.validityDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items quoted:</span>
                      <span>{Object.keys(bid.materialBids).length} of {rfqData.materials.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};