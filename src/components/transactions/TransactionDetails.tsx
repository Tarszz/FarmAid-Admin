
import React from 'react';
import { Transaction, formatCurrency } from '@/types/transaction';
import { Calendar, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface TransactionDetailsProps {
  transaction: Transaction;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction }) => {
  return (
    <div className="px-4 pb-4">
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Transaction Details</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Information</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-admin-textSecondary mb-1">Date</p>
                  <p className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-admin-secondary" />
                    {transaction.date}
                  </p>
                </div>
                
                {transaction.transactionType === 'Donation' && transaction.recipientOrganization && (
                  <div>
                    <p className="text-sm font-medium text-admin-textSecondary mb-1">Recipient Organization</p>
                    <p className="text-sm">{transaction.recipientOrganization}</p>
                  </div>
                )}
                
                {transaction.transactionType === 'Sold to Market' && transaction.marketName && (
                  <div>
                    <p className="text-sm font-medium text-admin-textSecondary mb-1">Market Name</p>
                    <p className="text-sm">{transaction.marketName}</p>
                  </div>
                )}
                
                {transaction.priceBreakdown && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-admin-textSecondary mb-2">Price Breakdown</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Base Price:</div>
                      <div className="text-right">{formatCurrency(transaction.priceBreakdown.basePrice)}</div>
                      <div>Taxes:</div>
                      <div className="text-right">{formatCurrency(transaction.priceBreakdown.taxes)}</div>
                      <div>Delivery Fee:</div>
                      <div className="text-right">{formatCurrency(transaction.priceBreakdown.delivery)}</div>
                      <div className="font-medium">Total:</div>
                      <div className="text-right font-medium">{formatCurrency(transaction.priceBreakdown.total)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery">
          <Card>
            <CardContent className="pt-6">
              {transaction.deliveryDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-admin-textSecondary mb-1">Delivery Address</p>
                    <p className="text-sm">{transaction.deliveryDetails.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-admin-textSecondary mb-1">Courier</p>
                    <p className="text-sm">{transaction.deliveryDetails.courier}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-admin-textSecondary mb-1">Tracking Number</p>
                    <p className="text-sm">{transaction.deliveryDetails.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-admin-textSecondary mb-1">Estimated Delivery</p>
                    <p className="text-sm">{transaction.deliveryDetails.estimatedDelivery}</p>
                  </div>
                  
                  {transaction.proofOfDelivery && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-admin-textSecondary mb-2">Proof of Delivery</p>
                      <div className="relative aspect-video w-full max-w-md rounded-md overflow-hidden bg-admin-background">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="h-8 w-8 text-admin-textSecondary" />
                        </div>
                        <img 
                          src={transaction.proofOfDelivery} 
                          alt="Proof of delivery" 
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-admin-textSecondary">No delivery information available for this transaction.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionDetails;
