import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, OperationOrder } from "@shared/schema";
import LanguageToggle from "@/components/LanguageToggle";
import HomeButton from "@/components/HomeButton";
import { Badge } from "@/components/ui/badge";
import { FileText, User as UserIcon, Car, FileCheck, Download, Calendar, MapPin, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import React from 'react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();

  // Existing queries...
  const { data: pendingDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-drivers"],
  });

  const { data: activeDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/active-drivers"],
  });

  const { data: suspendedDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/suspended-drivers"],
  });

  const { data: allOrders } = useQuery<(OperationOrder & { passengers: any[]; driver?: any })[]>({
    queryKey: ["/api/admin/all-orders"],
  });

  // Existing driver management functions...
  const approveDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/drivers/${driverId}/status`, { status: 'active' });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
  };

  const suspendDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/drivers/${driverId}/status`, { status: 'suspended' });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
  };

  const activateDriver = async (driverId: number) => {
    await apiRequest("POST", `/api/admin/drivers/${driverId}/status`, { status: 'active' });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
  };

  // Existing render functions...
  const renderDriverCard = (driver: User, actions: React.ReactNode) => (
    <div key={driver.id} className="flex flex-col space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {driver.profileImageUrl ? (
              <AvatarImage src={`/uploads/${driver.profileImageUrl}`} alt={driver.fullName || ''} />
            ) : (
              <AvatarFallback>
                <UserCircle2 className="h-10 w-10" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-primary" />
              <p className="font-medium">{driver.fullName}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('auth.idNumber')}: {driver.idNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('auth.licenseNumber')}: {driver.licenseNumber}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-2 pt-2 border-t">
        <p className="text-sm font-medium">Documents:</p>
        <div className="flex flex-wrap gap-2">
          {driver.idDocumentUrl && (
            <a
              href={`/uploads/${driver.idDocumentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline bg-muted px-3 py-2 rounded-md"
            >
              <FileCheck className="h-4 w-4 mr-1" />
              View ID Document
            </a>
          )}
          {driver.licenseDocumentUrl && (
            <a
              href={`/uploads/${driver.licenseDocumentUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline bg-muted px-3 py-2 rounded-md"
            >
              <FileCheck className="h-4 w-4 mr-1" />
              View License Document
            </a>
          )}
        </div>
      </div>

      {/* Status Information Section */}
      <div className="space-y-2 pt-2 border-t">
        <p className="text-sm font-medium">Status Information:</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
            {driver.status}
          </Badge>
          <Badge variant={driver.isApproved ? 'default' : 'destructive'}>
            {driver.isApproved ? 'Approved' : 'Not Approved'}
          </Badge>
        </div>
      </div>
    </div>
  );

  const renderOrderCard = (order: OperationOrder & { passengers: any[]; driver?: any }) => (
    <Card key={order.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <Car className="h-4 w-4" />
              {t('order.fromCity')}: {order.fromCity} → {order.toCity}
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date(order.departureTime).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              نوع التأشيرة / Visa Type: {order.visaType}
            </p>
            <p className="text-sm text-muted-foreground">
              رقم الرحلة / Trip No.: {order.tripNumber}
            </p>
            {order.driver && (
              <p className="text-sm text-muted-foreground mt-1">
                Driver: {order.driver.fullName} ({order.driver.idNumber})
              </p>
            )}
          </div>
          {order.pdfUrl && (
            <a
              href={`/uploads/${order.pdfUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-primary hover:underline bg-muted px-3 py-2 rounded-md w-full sm:w-auto justify-center sm:justify-start"
            >
              <FileText className="h-4 w-4 mr-1" />
              {t('order.downloadPdf')}
            </a>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            {t('order.passengers')}:
          </h4>
          <div className="grid gap-2">
            {order.passengers?.map((passenger, index) => (
              <div key={index} className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium">{passenger.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {t('order.idNumber')}: {passenger.idNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('order.nationality')}: {passenger.nationality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // New function to render PDF history item with detailed information
  const renderPDFHistoryItem = (order: OperationOrder & { passengers: any[]; driver?: any }) => (
    <Card key={order.id} className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('order.tripNumber')}: {order.tripNumber}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant={order.status === 'active' ? 'default' : 'secondary'}>
              {order.status}
            </Badge>
            {order.visaType && (
              <Badge variant="outline">
                {order.visaType}
              </Badge>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('order.route')}
            </h4>
            <p className="text-sm">
              {order.fromCity} → {order.toCity}
            </p>
          </div>

          {order.driver && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                {t('order.driver')}
              </h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  {order.driver.profileImageUrl ? (
                    <AvatarImage src={`/uploads/${order.driver.profileImageUrl}`} alt={order.driver.fullName} />
                  ) : (
                    <AvatarFallback>
                      <UserCircle2 className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm">{order.driver.fullName}</span>
              </div>
            </div>
          )}
        </div>

        {/* Passengers Section */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('order.passengers')} ({order.passengers?.length || 0})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {order.passengers?.map((passenger, index) => (
              <div key={index} className="text-sm bg-muted p-2 rounded-md">
                <p className="font-medium">{passenger.name}</p>
                <p className="text-muted-foreground text-xs">
                  {t('order.idNumber')}: {passenger.idNumber}
                </p>
                <p className="text-muted-foreground text-xs">
                  {t('order.nationality')}: {passenger.nationality}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <a
            href={`/uploads/${order.pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-primary hover:underline bg-muted px-3 py-2 rounded-md"
          >
            <FileText className="h-4 w-4 mr-1" />
            {t('order.viewPdf')}
          </a>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            {t('order.download')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <HomeButton />
          <div className="flex gap-4">
            <LanguageToggle />
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="pending">
              {t('admin.pendingDrivers')}
              {pendingDrivers?.length ? (
                <Badge variant="destructive" className="ml-2">{pendingDrivers.length}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="active">{t('admin.activeDrivers')}</TabsTrigger>
            <TabsTrigger value="suspended">{t('admin.suspendedDrivers')}</TabsTrigger>
            <TabsTrigger value="orders">{t('admin.orders')}</TabsTrigger>
            <TabsTrigger value="pdf-history">{t('admin.pdfHistory')}</TabsTrigger>
          </TabsList>

          {/* Existing tab content... */}
          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.pendingDrivers')}</h2>
                {pendingDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {pendingDrivers?.map((driver) => renderDriverCard(driver, (
                      <Button onClick={() => approveDriver(driver.id)}>{t('admin.approve')}</Button>
                    )))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.activeDrivers')}</h2>
                {activeDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noActiveDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {activeDrivers?.map((driver) => renderDriverCard(driver, (
                      <Button
                        variant="destructive"
                        onClick={() => suspendDriver(driver.id)}
                      >
                        {t('admin.suspend')}
                      </Button>
                    )))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suspended">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.suspendedDrivers')}</h2>
                {suspendedDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noSuspendedDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {suspendedDrivers?.map((driver) => renderDriverCard(driver, (
                      <Button
                        variant="outline"
                        onClick={() => activateDriver(driver.id)}
                      >
                        {t('admin.activate')}
                      </Button>
                    )))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.allOrders')}</h2>
                {allOrders?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noOrders')}</p>
                ) : (
                  <div className="space-y-4">
                    {allOrders?.map(renderOrderCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pdf-history">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.pdfHistory')}</h2>
                <div className="space-y-4">
                  {allOrders?.filter(order => order.pdfUrl).map(renderPDFHistoryItem)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}