/**
 * Deal Error Boundary
 * Catches and handles errors in deal components
 */

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface DealErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface DealErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class DealErrorBoundary extends Component<DealErrorBoundaryProps, DealErrorBoundaryState> {
  constructor(props: DealErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<DealErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Deal Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="font-medium mb-2">Error in Deal Management System</div>
                  <p className="text-sm">
                    We encountered an unexpected error while processing your deal data. 
                    This might be due to corrupted data or a system issue.
                  </p>
                </AlertDescription>
              </Alert>

              {this.state.error && (
                <div className="bg-gray-100 rounded-lg p-4 overflow-auto">
                  <div className="text-sm font-medium mb-2">Error Details:</div>
                  <code className="text-xs text-red-600 block">
                    {this.state.error.toString()}
                  </code>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs font-medium cursor-pointer text-gray-600 hover:text-gray-900">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-gray-600 mt-2 overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                If this problem persists, please contact support or clear your browser cache.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
