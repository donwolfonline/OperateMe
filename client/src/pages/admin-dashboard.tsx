import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { User, OperationOrder, InsertUser, insertUserSchema } from "@shared/schema";
import LanguageToggle from "@/components/LanguageToggle";
import { Badge } from "@/components/ui/badge";
import { FileText, User as UserIcon, Car, FileCheck, Download, Calendar, MapPin, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { Redirect } from "wouter";
import React, { useState, useMemo } from 'react';
import SearchAndFilter from "@/components/SearchAndFilter";
import { utils, write } from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Logo } from "@/components/Logo";

const getPublicUrl = (path: string) => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://operit.replit.app'
    : window.location.origin;
  return `${baseUrl}/uploads/${path}`;
};

const AddDriverForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      idNumber: "",
      licenseNumber: "",
      role: "driver",
      status: "active",
      isApproved: true
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await apiRequest("POST", "/api/register", {
        ...data,
        role: "driver",
        status: "active",
        isApproved: true
      });

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });

      form.reset();
      onSuccess();

      toast({
        title: t('notifications.success'),
        description: t('admin.addDriverSuccess'),
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: t('notifications.error'),
        description: error.message || t('admin.addDriverError'),
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.username')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.fullName')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.idNumber')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.licenseNumber')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t('admin.addDriver')}
        </Button>
      </form>
    </Form>
  );
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pendingDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-drivers"],
    enabled: !!user && user.role === "admin"
  });

  const { data: activeDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/active-drivers"],
    enabled: !!user && user.role === "admin"
  });

  const { data: suspendedDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/suspended-drivers"],
    enabled: !!user && user.role === "admin"
  });

  const { data: allOrders } = useQuery<(OperationOrder & { passengers: any[]; driver?: any })[]>({
    queryKey: ["/api/admin/all-orders"],
    enabled: !!user && user.role === "admin"
  });

  if (!user || user.role !== "admin") {
    return <Redirect to="/auth" />;
  }

  const handleAddDriverSuccess = () => {
    setDialogOpen(false);
  };

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

  const removeDriver = async (driverId: number) => {
    if (window.confirm(t('admin.removeConfirm'))) {
      try {
        // Show loading state
        toast({
          title: t('notifications.deletingDriver'),
          description: t('notifications.pleaseWait'),
          variant: "default"
        });

        // Attempt to delete the driver
        const response = await apiRequest("DELETE", `/api/admin/drivers/${driverId}`);

        if (!response.ok) {
          throw new Error(t('admin.deleteDriverFailed'));
        }

        // Invalidate all related queries to refresh the UI
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] }),
          queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] }),
          queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-drivers"] }),
          queryClient.invalidateQueries({ queryKey: ["/api/admin/all-orders"] })
        ]);

        // Show success message
        toast({
          title: t('notifications.success'),
          description: t('notifications.driverDeleted'),
          variant: "default"
        });
      } catch (error: any) {
        console.error('Error deleting driver:', error);
        toast({
          title: t('notifications.error'),
          description: error.message || t('admin.removeDriverError'),
          variant: "destructive"
        });
      }
    }
  };

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
              UID: {driver.uid}
            </p>
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
          <Button
            variant="destructive"
            size="sm"
            onClick={() => removeDriver(driver.id)}
          >
            {t('admin.removeDriver')}
          </Button>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t">
        <p className="text-sm font-medium">Documents:</p>
        <div className="flex flex-wrap gap-2">
          {driver.idDocumentUrl && (
            <a
              href={getPublicUrl(driver.idDocumentUrl)}
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
              href={getPublicUrl(driver.licenseDocumentUrl)}
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
            {order.driver && order.driver.fullName && (
              <p className="text-sm text-muted-foreground mt-1">
                {t('order.driver')}: {order.driver.fullName}
                {order.driver.uid && ` (${order.driver.uid})`}
              </p>
            )}
          </div>
          {order.pdfUrl && (
            <a
              href={getPublicUrl(order.pdfUrl)}
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

  const filterDrivers = (drivers: User[] | undefined) => {
    if (!drivers) return [];

    return drivers.filter(driver => {
      const matchesSearch = searchTerm === "" ||
        driver.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.uid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.idNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.keys(activeFilters).length === 0 ||
        Object.entries(activeFilters).every(([key, value]) => {
          if (key === 'registrationDate') {
            const driverDate = new Date(driver.createdAt);
            const today = new Date();
            switch (value) {
              case 'today':
                return driverDate.toDateString() === today.toDateString();
              case 'week':
                const weekAgo = new Date(today.setDate(today.getDate() - 7));
                return driverDate >= weekAgo;
              case 'month':
                const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                return driverDate >= monthAgo;
              default:
                return true;
            }
          }
          if (key === 'driverName') {
            return driver.fullName === value;
          }
          return true;
        });

      return matchesSearch && matchesFilters;
    });
  };

  const filterOrders = (orders: (OperationOrder & { passengers: any[]; driver?: any })[] | undefined) => {
    if (!orders) return [];

    return orders.filter(order => {
      const matchesSearch = searchTerm === "" ||
        order.tripNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.fromCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.toCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.driver?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.visaType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.keys(activeFilters).length === 0 ||
        Object.entries(activeFilters).every(([key, value]) => {
          if (key === 'status') return order.status === value;
          if (key === 'date') {
            const orderDate = new Date(order.departureTime);
            const filterDate = new Date(value as string);
            return orderDate.toDateString() === filterDate.toDateString();
          }
          if (key === 'driverName') {
            return order.driver?.fullName === value;
          }
          return true;
        });

      return matchesSearch && matchesFilters;
    });
  };

  const filterDocuments = (orders: (OperationOrder & { passengers: any[]; driver?: any })[] | undefined) => {
    if (!orders) return [];

    const documentsWithPdf = orders.filter(order => order.pdfUrl);

    return documentsWithPdf.filter(doc => {
      const matchesSearch = searchTerm === "" ||
        doc.driver?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tripNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.keys(activeFilters).length === 0 ||
        Object.entries(activeFilters).every(([key, value]) => {
          if (key === 'driverName') {
            return doc.driver?.fullName === value;
          }
          if (key === 'documentType') {
            return true;
          }
          return true;
        });

      return matchesSearch && matchesFilters;
    });
  };

  const filteredPendingDrivers = useMemo(() =>
    filterDrivers(pendingDrivers), [pendingDrivers, searchTerm, activeFilters]);

  const filteredActiveDrivers = useMemo(() =>
    filterDrivers(activeDrivers), [activeDrivers, searchTerm, activeFilters]);

  const filteredSuspendedDrivers = useMemo(() =>
    filterDrivers(suspendedDrivers), [suspendedDrivers, searchTerm, activeFilters]);

  const filteredOrders = useMemo(() =>
    filterOrders(allOrders), [allOrders, searchTerm, activeFilters]);

  const filteredDocuments = useMemo(() =>
    filterDocuments(allOrders), [allOrders, searchTerm, activeFilters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="pending">
              {t('admin.pendingDrivers')}
              {pendingDrivers?.length ? (
                <Badge variant="destructive" className="ml-2">{pendingDrivers.length}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="active">{t('admin.activeDrivers')}</TabsTrigger>
            <TabsTrigger value="suspended">{t('admin.suspendedDrivers')}</TabsTrigger>
            <TabsTrigger value="orders">{t('admin.orders')}</TabsTrigger>
            <TabsTrigger value="documents">{t('admin.documents')}</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin.pendingDrivers')}</h2>
                <SearchAndFilter
                  type="drivers"
                  onSearch={setSearchTerm}
                  onFilter={setActiveFilters}
                  className="mb-4"
                  driversList={pendingDrivers}
                />
                {filteredPendingDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {filteredPendingDrivers?.map((driver) => renderDriverCard(driver, (
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('admin.activeDrivers')}</h2>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserIcon className="w-4 h-4 mr-2" />
                        {t('admin.addDriver')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.addNewDriver')}</DialogTitle>
                      </DialogHeader>
                      <AddDriverForm onSuccess={handleAddDriverSuccess} />
                    </DialogContent>
                  </Dialog>
                </div>
                <SearchAndFilter
                  type="drivers"
                  onSearch={setSearchTerm}
                  onFilter={setActiveFilters}
                  className="mb-4"
                  driversList={activeDrivers}
                />
                {filteredActiveDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noActiveDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {filteredActiveDrivers?.map((driver) => renderDriverCard(driver, (
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{t('admin.suspendedDrivers')}</h2>
                </div>
                <SearchAndFilter
                  type="drivers"
                  onSearch={setSearchTerm}
                  onFilter={setActiveFilters}
                  className="mb-4"
                  driversList={suspendedDrivers}
                />
                {filteredSuspendedDrivers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noSuspendedDrivers')}</p>
                ) : (
                  <div className="space-y-4">
                    {filteredSuspendedDrivers?.map((driver) => renderDriverCard(driver, (
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
                <SearchAndFilter
                  type="orders"
                  onSearch={setSearchTerm}
                  onFilter={setActiveFilters}
                  className="mb-4"
                />
                {filteredOrders?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noOrders')}</p>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders?.map(renderOrderCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">{t('admin.documents')}</h2>
                <SearchAndFilter
                  type="documents"
                  onSearch={setSearchTerm}
                  onFilter={setActiveFilters}
                  className="mb-4"
                  driversList={[...(activeDrivers || []), ...(suspendedDrivers || [])]}
                />
                {filteredDocuments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">{t('admin.noDocuments')}</p>
                ) : (
                  <div className="grid gap-6">
                    {filteredDocuments.map((doc) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                  {t('order.tripNumber')}: {doc.tripNumber}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {doc.driver?.fullName ? `${t('order.driver')}: ${doc.driver.fullName}` : ''}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t('order.fromCity')}: {doc.fromCity} → {doc.toCity}
                              </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {doc.pdfUrl && (
                                <a
                                  href={getPublicUrl(doc.pdfUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  {t('order.downloadPdf')}
                                </a>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}