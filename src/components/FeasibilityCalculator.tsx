import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Download,
  Calculator,
  DollarSign,
  TrendingUp,
  PieChart,
  Building,
  FileText,
  Banknote
} from 'lucide-react';
import { User } from '../types';
import { formatPKR } from '../lib/currency';
import { toast } from 'sonner';

interface FeasibilityData {
  // Land Costs
  acquisitionCost: number;
  legalFees: number;
  registrationFees: number;
  
  // Construction Costs
  materialsCost: number;
  laborCost: number;
  marketingCost: number;
  
  // Revenue Projections
  residentialUnits: number;
  residentialPricePerUnit: number;
  commercialUnits: number;
  commercialPricePerUnit: number;
}

interface CalculatedResults {
  totalLandCosts: number;
  totalConstructionCosts: number;
  totalEstimatedCost: number;
  totalResidentialRevenue: number;
  totalCommercialRevenue: number;
  totalProjectedRevenue: number;
  projectedProfit: number;
  profitMargin: number;
  roi: number;
}

interface FeasibilityCalculatorProps {
  user: User;
  onBack: () => void;
}

export const FeasibilityCalculator: React.FC<FeasibilityCalculatorProps> = ({
  user,
  onBack
}) => {
  const [data, setData] = useState<FeasibilityData>({
    acquisitionCost: 0,
    legalFees: 0,
    registrationFees: 0,
    materialsCost: 0,
    laborCost: 0,
    marketingCost: 0,
    residentialUnits: 0,
    residentialPricePerUnit: 0,
    commercialUnits: 0,
    commercialPricePerUnit: 0
  });

  const [results, setResults] = useState<CalculatedResults>({
    totalLandCosts: 0,
    totalConstructionCosts: 0,
    totalEstimatedCost: 0,
    totalResidentialRevenue: 0,
    totalCommercialRevenue: 0,
    totalProjectedRevenue: 0,
    projectedProfit: 0,
    profitMargin: 0,
    roi: 0
  });

  const [loading, setLoading] = useState(false);

  // Real-time calculations
  useEffect(() => {
    const totalLandCosts = data.acquisitionCost + data.legalFees + data.registrationFees;
    const totalConstructionCosts = data.materialsCost + data.laborCost + data.marketingCost;
    const totalEstimatedCost = totalLandCosts + totalConstructionCosts;
    
    const totalResidentialRevenue = data.residentialUnits * data.residentialPricePerUnit;
    const totalCommercialRevenue = data.commercialUnits * data.commercialPricePerUnit;
    const totalProjectedRevenue = totalResidentialRevenue + totalCommercialRevenue;
    
    const projectedProfit = totalProjectedRevenue - totalEstimatedCost;
    const profitMargin = totalProjectedRevenue > 0 ? (projectedProfit / totalProjectedRevenue) * 100 : 0;
    const roi = totalEstimatedCost > 0 ? (projectedProfit / totalEstimatedCost) * 100 : 0;

    setResults({
      totalLandCosts,
      totalConstructionCosts,
      totalEstimatedCost,
      totalResidentialRevenue,
      totalCommercialRevenue,
      totalProjectedRevenue,
      projectedProfit,
      profitMargin,
      roi
    });
  }, [data]);

  const handleInputChange = (field: keyof FeasibilityData, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleSaveAnalysis = async () => {
    setLoading(true);
    try {
      // Save analysis logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Feasibility analysis saved successfully');
    } catch (error) {
      toast.error('Failed to save analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    toast.success('PDF export started - download will begin shortly');
    // PDF export logic would go here
  };

  const getProfitColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getProfitBadgeColor = (value: number) => {
    if (value > 20) return 'bg-green-100 text-green-800 border-green-200';
    if (value > 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (value > 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Feasibility Calculator</h1>
              <p className="text-gray-600 mt-1">
                Analyze the financial viability of your development project
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
            <Button onClick={handleSaveAnalysis} disabled={loading} className="bg-blue-600 hover:bg-blue-700 gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            
            {/* Land Costs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Land Costs
                </CardTitle>
                <CardDescription>
                  Enter all costs related to land acquisition
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="acquisitionCost">Acquisition Cost (PKR)</Label>
                    <Input
                      id="acquisitionCost"
                      type="number"
                      value={data.acquisitionCost || ''}
                      onChange={(e) => handleInputChange('acquisitionCost', e.target.value)}
                      placeholder="0"
                      className="text-right"
                    />
                    {data.acquisitionCost > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(data.acquisitionCost)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legalFees">Legal Fees (PKR)</Label>
                    <Input
                      id="legalFees"
                      type="number"
                      value={data.legalFees || ''}
                      onChange={(e) => handleInputChange('legalFees', e.target.value)}
                      placeholder="0"
                      className="text-right"
                    />
                    {data.legalFees > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(data.legalFees)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registrationFees">Registration Fees (PKR)</Label>
                    <Input
                      id="registrationFees"
                      type="number"
                      value={data.registrationFees || ''}
                      onChange={(e) => handleInputChange('registrationFees', e.target.value)}
                      placeholder="0"
                      className="text-right"
                    />
                    {data.registrationFees > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(data.registrationFees)}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">Total Land Costs:</span>
                  <span className="font-bold text-blue-900">{formatPKR(results.totalLandCosts)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Construction Costs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Projected Construction Costs
                </CardTitle>
                <CardDescription>
                  Estimate all construction and development expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="materialsCost">Materials Cost (PKR)</Label>
                    <Input
                      id="materialsCost"
                      type="number"
                      value={data.materialsCost || ''}
                      onChange={(e) => handleInputChange('materialsCost', e.target.value)}
                      placeholder="0"
                      className="text-right"
                    />
                    {data.materialsCost > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(data.materialsCost)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="laborCost">Labor Cost (PKR)</Label>
                    <Input
                      id="laborCost"
                      type="number"
                      value={data.laborCost || ''}
                      onChange={(e) => handleInputChange('laborCost', e.target.value)}
                      placeholder="0"
                      className="text-right"
                    />
                    {data.laborCost > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(data.laborCost)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="marketingCost">Marketing Cost (PKR)</Label>
                    <Input
                      id="marketingCost"
                      type="number"
                      value={data.marketingCost || ''}
                      onChange={(e) => handleInputChange('marketingCost', e.target.value)}
                      placeholder="0"
                      className="text-right"
                    />
                    {data.marketingCost > 0 && (
                      <p className="text-sm text-gray-600">{formatPKR(data.marketingCost)}</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-orange-900">Total Construction Costs:</span>
                  <span className="font-bold text-orange-900">{formatPKR(results.totalConstructionCosts)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Projections Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Projected Revenue
                </CardTitle>
                <CardDescription>
                  Estimate revenue from residential and commercial units
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Residential Units</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="residentialUnits">Total Units</Label>
                      <Input
                        id="residentialUnits"
                        type="number"
                        value={data.residentialUnits || ''}
                        onChange={(e) => handleInputChange('residentialUnits', e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="residentialPricePerUnit">Price per Unit (PKR)</Label>
                      <Input
                        id="residentialPricePerUnit"
                        type="number"
                        value={data.residentialPricePerUnit || ''}
                        onChange={(e) => handleInputChange('residentialPricePerUnit', e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                    </div>
                  </div>
                  
                  {data.residentialUnits > 0 && data.residentialPricePerUnit > 0 && (
                    <div className="p-2 bg-green-50 rounded text-sm">
                      <span className="text-green-700">
                        Residential Revenue: {formatPKR(results.totalResidentialRevenue)}
                      </span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Commercial Units</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commercialUnits">Total Units</Label>
                      <Input
                        id="commercialUnits"
                        type="number"
                        value={data.commercialUnits || ''}
                        onChange={(e) => handleInputChange('commercialUnits', e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="commercialPricePerUnit">Price per Unit (PKR)</Label>
                      <Input
                        id="commercialPricePerUnit"
                        type="number"
                        value={data.commercialPricePerUnit || ''}
                        onChange={(e) => handleInputChange('commercialPricePerUnit', e.target.value)}
                        placeholder="0"
                        className="text-right"
                      />
                    </div>
                  </div>
                  
                  {data.commercialUnits > 0 && data.commercialPricePerUnit > 0 && (
                    <div className="p-2 bg-green-50 rounded text-sm">
                      <span className="text-green-700">
                        Commercial Revenue: {formatPKR(results.totalCommercialRevenue)}
                      </span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-900">Total Projected Revenue:</span>
                  <span className="font-bold text-green-900">{formatPKR(results.totalProjectedRevenue)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Total Estimated Cost */}
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                    <DollarSign className="h-5 w-5" />
                    Total Estimated Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900 mb-2">
                    {formatPKR(results.totalEstimatedCost)}
                  </div>
                  <div className="text-sm text-red-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Land Costs:</span>
                      <span>{formatPKR(results.totalLandCosts)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Construction:</span>
                      <span>{formatPKR(results.totalConstructionCosts)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Projected Revenue */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                    <TrendingUp className="h-5 w-5" />
                    Total Projected Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900 mb-2">
                    {formatPKR(results.totalProjectedRevenue)}
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Residential:</span>
                      <span>{formatPKR(results.totalResidentialRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commercial:</span>
                      <span>{formatPKR(results.totalCommercialRevenue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4">
              {/* Projected Profit */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                    <Banknote className="h-5 w-5" />
                    Projected Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getProfitColor(results.projectedProfit)}`}>
                    {formatPKR(results.projectedProfit)}
                  </div>
                  <Badge className={getProfitBadgeColor(results.profitMargin)}>
                    {results.projectedProfit >= 0 ? 'Profitable' : 'Loss'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Profit Margin */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                    <PieChart className="h-5 w-5" />
                    Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getProfitColor(results.profitMargin)}`}>
                    {results.profitMargin.toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-700">
                    {results.profitMargin > 20 ? 'Excellent' : 
                     results.profitMargin > 10 ? 'Good' : 
                     results.profitMargin > 0 ? 'Fair' : 'Poor'} margin
                  </div>
                </CardContent>
              </Card>

              {/* ROI */}
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-800">
                    <Calculator className="h-5 w-5" />
                    Return on Investment (ROI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getProfitColor(results.roi)}`}>
                    {results.roi.toFixed(1)}%
                  </div>
                  <div className="text-sm text-indigo-700">
                    {results.roi > 25 ? 'Excellent' : 
                     results.roi > 15 ? 'Good' : 
                     results.roi > 5 ? 'Fair' : 'Poor'} returns
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Break-even Point:</span>
                    <span className="font-medium">
                      {results.totalEstimatedCost > 0 ? formatPKR(results.totalEstimatedCost) : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue Multiple:</span>
                    <span className="font-medium">
                      {results.totalEstimatedCost > 0 ? 
                        `${(results.totalProjectedRevenue / results.totalEstimatedCost).toFixed(2)}x` : 
                        'N/A'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost per Unit (Avg):</span>
                    <span className="font-medium">
                      {(data.residentialUnits + data.commercialUnits) > 0 ? 
                        formatPKR(results.totalEstimatedCost / (data.residentialUnits + data.commercialUnits)) : 
                        'N/A'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue per Unit (Avg):</span>
                    <span className="font-medium">
                      {(data.residentialUnits + data.commercialUnits) > 0 ? 
                        formatPKR(results.totalProjectedRevenue / (data.residentialUnits + data.commercialUnits)) : 
                        'N/A'
                      }
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                  <p className="text-sm text-gray-700">
                    {results.roi > 20 ? 
                      'Highly recommended - Excellent returns with strong profit margins.' :
                     results.roi > 10 ? 
                      'Recommended - Good investment opportunity with solid returns.' :
                     results.roi > 0 ? 
                      'Consider carefully - Modest returns, review cost structure.' :
                      'Not recommended - Project shows negative returns. Reconsider pricing or reduce costs.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};