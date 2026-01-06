/**
 * ReportComparisonView Component
 * 
 * Compare two report results side-by-side.
 * 
 * Features:
 * - Side-by-side table comparison
 * - Highlight differences
 * - Statistical comparison
 * - Export comparison results
 * - Synchronized scrolling
 * 
 * Design System V4.1 Compliant
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User } from '../../../../types';
import { ReportHistoryEntry } from '../../../../lib/report-history';
import { CustomReportTemplate } from '../../../../types/custom-reports';
import { exportToCSV } from '../../../../lib/exportUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import {
  GitCompare,
  Download,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

interface ReportComparisonViewProps {
  open: boolean;
  onClose: () => void;
  template: CustomReportTemplate;
  historyEntries: ReportHistoryEntry[];
  user: User;
}

export const ReportComparisonView: React.FC<ReportComparisonViewProps> = ({
  open,
  onClose,
  template,
  historyEntries,
  user,
}) => {
  const [leftReportId, setLeftReportId] = useState('');
  const [rightReportId, setRightReportId] = useState('');
  const [syncScroll, setSyncScroll] = useState(true);
  
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  // Auto-select most recent two reports
  useEffect(() => {
    if (open && historyEntries.length >= 2 && !leftReportId && !rightReportId) {
      const sorted = [...historyEntries].sort((a, b) => 
        new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
      );
      setRightReportId(sorted[0].id);
      setLeftReportId(sorted[1].id);
    }
  }, [open, historyEntries, leftReportId, rightReportId]);

  // Get selected reports
  const leftReport = useMemo(() => 
    historyEntries.find(e => e.id === leftReportId),
    [historyEntries, leftReportId]
  );
  
  const rightReport = useMemo(() => 
    historyEntries.find(e => e.id === rightReportId),
    [historyEntries, rightReportId]
  );

  // Calculate comparison statistics
  const comparisonStats = useMemo(() => {
    if (!leftReport || !rightReport) return null;
    
    const rowDiff = rightReport.report.rowCount - leftReport.report.rowCount;
    const rowDiffPercent = leftReport.report.rowCount > 0
      ? ((rowDiff / leftReport.report.rowCount) * 100).toFixed(1)
      : '0';
    
    // Try to calculate numeric differences for first numeric column
    let valueDiff: number | null = null;
    let valueDiffPercent: string | null = null;
    
    const numericColumns = leftReport.report.columns.filter(
      col => col.type === 'number' || col.id.toLowerCase().includes('amount')
    );
    
    if (numericColumns.length > 0) {
      const colId = numericColumns[0].id;
      const leftSum = leftReport.report.data.reduce((sum, row) => {
        const val = parseFloat(String(row[colId] || 0));
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
      
      const rightSum = rightReport.report.data.reduce((sum, row) => {
        const val = parseFloat(String(row[colId] || 0));
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
      
      valueDiff = rightSum - leftSum;
      valueDiffPercent = leftSum > 0
        ? ((valueDiff / leftSum) * 100).toFixed(1)
        : '0';
    }
    
    return {
      rowDiff,
      rowDiffPercent,
      valueDiff,
      valueDiffPercent,
      timeDiff: new Date(rightReport.generatedAt).getTime() - new Date(leftReport.generatedAt).getTime(),
    };
  }, [leftReport, rightReport]);

  // Handle synchronized scrolling
  const handleScroll = (source: 'left' | 'right') => {
    if (!syncScroll) return;
    
    const sourceRef = source === 'left' ? leftScrollRef : rightScrollRef;
    const targetRef = source === 'left' ? rightScrollRef : leftScrollRef;
    
    if (sourceRef.current && targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
  };

  // Export comparison
  const handleExportComparison = () => {
    if (!leftReport || !rightReport) return;
    
    const comparisonData = [
      {
        'Metric': 'Report Generated',
        'Left': new Date(leftReport.generatedAt).toLocaleString(),
        'Right': new Date(rightReport.generatedAt).toLocaleString(),
      },
      {
        'Metric': 'Row Count',
        'Left': leftReport.report.rowCount,
        'Right': rightReport.report.rowCount,
      },
      {
        'Metric': 'Difference',
        'Left': '-',
        'Right': comparisonStats?.rowDiff || 0,
      },
    ];
    
    exportToCSV(comparisonData, `${template.name}_comparison_${new Date().toISOString().split('T')[0]}`);
    toast.success('Comparison exported successfully');
  };

  if (!leftReport || !rightReport) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Reports to Compare</DialogTitle>
            <DialogDescription>
              Choose two report instances to compare
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Left Report</label>
              <Select value={leftReportId} onValueChange={setLeftReportId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report..." />
                </SelectTrigger>
                <SelectContent>
                  {historyEntries.map(entry => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {new Date(entry.generatedAt).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Right Report</label>
              <Select value={rightReportId} onValueChange={setRightReportId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report..." />
                </SelectTrigger>
                <SelectContent>
                  {historyEntries.map(entry => (
                    <SelectItem key={entry.id} value={entry.id}>
                      {new Date(entry.generatedAt).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              onClick={() => {}}
              disabled={!leftReportId || !rightReportId}
            >
              Compare
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-blue-600" />
            Report Comparison
          </DialogTitle>
          <DialogDescription>
            Comparing "{template.name}" - {leftReport.report.rowCount} vs {rightReport.report.rowCount} rows
          </DialogDescription>
        </DialogHeader>

        {/* Comparison Stats */}
        {comparisonStats && (
          <div className="grid grid-cols-4 gap-4 py-4 border-y">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {comparisonStats.rowDiff > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : comparisonStats.rowDiff < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Minus className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-lg text-gray-900">
                  {comparisonStats.rowDiff > 0 ? '+' : ''}{comparisonStats.rowDiff}
                </span>
              </div>
              <div className="text-xs text-gray-500">Row Difference</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg text-gray-900">
                {comparisonStats.rowDiffPercent}%
              </div>
              <div className="text-xs text-gray-500">Percentage Change</div>
            </div>
            
            {comparisonStats.valueDiff !== null && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {comparisonStats.valueDiff > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : comparisonStats.valueDiff < 0 ? (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-lg text-gray-900">
                    {comparisonStats.valueDiff > 0 ? '+' : ''}
                    {comparisonStats.valueDiff.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Value Difference</div>
              </div>
            )}
            
            <div className="text-center">
              <div className="text-lg text-gray-900">
                {Math.round(comparisonStats.timeDiff / (1000 * 60 * 60 * 24))}d
              </div>
              <div className="text-xs text-gray-500">Time Between</div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Left Report */}
            <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-3 bg-gray-100 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(leftReport.generatedAt).toLocaleDateString()}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {leftReport.report.rowCount} rows
                  </span>
                </div>
              </div>
              
              <div
                ref={leftScrollRef}
                onScroll={() => handleScroll('left')}
                className="flex-1 overflow-auto"
              >
                <table className="w-full">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      {leftReport.report.columns.map(col => (
                        <th
                          key={col.id}
                          className="px-3 py-2 text-left text-xs text-gray-900 whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leftReport.report.data.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        {leftReport.report.columns.map(col => (
                          <td
                            key={col.id}
                            className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap"
                          >
                            {row[col.id] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Report */}
            <div className="flex flex-col border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-3 bg-gray-100 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(rightReport.generatedAt).toLocaleDateString()}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {rightReport.report.rowCount} rows
                  </span>
                </div>
              </div>
              
              <div
                ref={rightScrollRef}
                onScroll={() => handleScroll('right')}
                className="flex-1 overflow-auto"
              >
                <table className="w-full">
                  <thead className="bg-gray-50 border-b sticky top-0">
                    <tr>
                      {rightReport.report.columns.map(col => (
                        <th
                          key={col.id}
                          className="px-3 py-2 text-left text-xs text-gray-900 whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rightReport.report.data.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        {rightReport.report.columns.map(col => (
                          <td
                            key={col.id}
                            className="px-3 py-2 text-xs text-gray-700 whitespace-nowrap"
                          >
                            {row[col.id] ?? '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={syncScroll}
              onChange={(e) => setSyncScroll(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Synchronized scrolling</span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportComparison}>
              <Download className="h-4 w-4 mr-2" />
              Export Comparison
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
