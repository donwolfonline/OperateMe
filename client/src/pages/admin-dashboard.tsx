import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, OperationOrder, InsertUser } from "@shared/schema";
import LanguageToggle from "@/components/LanguageToggle";
import HomeButton from "@/components/HomeButton";
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
import { insertUserSchema } from "@shared/schema";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const { toast } = useToast();

  const { data: pendingDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-drivers"],
    enabled: !!user && user.role === "admin",
  });

  const { data: activeDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/active-drivers"],
    enabled: !!user && user.role === "admin",
  });

  const { data: suspendedDrivers } = useQuery<User[]>({
    queryKey: ["/api/admin/suspended-drivers"],
    enabled: !!user && user.role === "admin",
  });

  const { data: allOrders } = useQuery<(OperationOrder & { passengers: any[]; driver?: any })[]>({
    queryKey: ["/api/admin/all-orders"],
    enabled: !!user && user.role === "admin",
  });

  // If not authenticated or not admin, show the login page
  if (!user || user.role !== "admin") {
    return <Redirect to="/auth" />;
  }

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

  const addDriver = async (data: InsertUser) => {
    await apiRequest("POST", "/api/admin/drivers", data);
    queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-drivers"] });
    toast({
      title: t('notifications.success'),
      description: t('admin.addDriverSuccess'),
      variant: "default"
    });
  };

  const removeDriver = async (driverId: number) => {
    if (window.confirm(t('admin.removeConfirm'))) {
      await apiRequest("DELETE", `/api/admin/drivers/${driverId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/active-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/suspended-drivers"] });
      toast({
        title: t('notifications.success'),
        description: t('admin.removeDriverSuccess'),
        variant: "default"
      });
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
            {order.driver && order.driver.fullName && (
              <p className="text-sm text-muted-foreground mt-1">
                {t('order.driver')}: {order.driver.fullName}
                {order.driver.uid && ` (${order.driver.uid})`}
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
            return true; // Implement if you have specific document types
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


  const exportToExcel = async () => {
    try {
      const driversData = [
        ...filteredPendingDrivers || [],
        ...filteredActiveDrivers || [],
        ...filteredSuspendedDrivers || []
      ].map(driver => ({
        'Driver ID': driver.uid,
        'Full Name': driver.fullName,
        'ID Number': driver.idNumber,
        'License Number': driver.licenseNumber,
        'Status': driver.status,
        'Is Approved': driver.isApproved ? 'Yes' : 'No',
        'Created At': new Date(driver.createdAt).toLocaleString(),
        'Last Updated': new Date(driver.updatedAt || driver.createdAt).toLocaleString(),
        'Document Status': driver.idDocumentUrl && driver.licenseDocumentUrl ? 'Complete' : 'Incomplete',
        'Profile Status': driver.profileImageUrl ? 'Complete' : 'Incomplete',
        'ID Document URL': driver.idDocumentUrl ? `${window.location.origin}/uploads/${driver.idDocumentUrl}` : 'N/A',
        'License Document URL': driver.licenseDocumentUrl ? `${window.location.origin}/uploads/${driver.licenseDocumentUrl}` : 'N/A',
        'Profile Image URL': driver.profileImageUrl ? `${window.location.origin}/uploads/${driver.profileImageUrl}` : 'N/A'
      }));

      const ordersData = (filteredOrders || []).map(order => ({
        'Trip Number': order.tripNumber,
        'From City': order.fromCity,
        'To City': order.toCity,
        'Departure Time': new Date(order.departureTime).toLocaleString(),
        'Creation Date': new Date(order.createdAt).toLocaleString(),
        'Last Update': new Date(order.updatedAt || order.createdAt).toLocaleString(),
        'Visa Type': order.visaType,
        'Status': order.status,
        'Driver Name': order.driver?.fullName || 'N/A',
        'Driver ID': order.driver?.uid || 'N/A',
        'Passengers Count': order.passengers?.length || 0,
        'Vehicle Type': order.vehicle?.type || 'N/A',
        'Vehicle Plate': order.vehicle?.plateNumber || 'N/A',
        'PDF Status': order.pdfUrl ? 'Generated' : 'Pending',
        'PDF Link': order.pdfUrl ? `=HYPERLINK("${window.location.origin}/uploads/${order.pdfUrl}", "Click to View PDF")` : 'N/A',
        'QR Code': order.qrCode ? `=HYPERLINK("${window.location.origin}/uploads/${order.qrCode}", "View QR Code")` : 'N/A'
      }));

      const passengersData = (filteredOrders || []).flatMap(order =>
        (order.passengers || []).map(passenger => ({
          'Trip Number': order.tripNumber,
          'Passenger Name': passenger.name,
          'ID Number': passenger.idNumber,
          'Nationality': passenger.nationality,
          'From City': order.fromCity,
          'To City': order.toCity,
          'Departure Time': new Date(order.departureTime).toLocaleString(),
          'Driver': order.driver?.fullName || 'N/A',
          'Driver ID': order.driver?.uid || 'N/A',
          'Visa Type': order.visaType,
          'Order Created': new Date(order.createdAt).toLocaleString(),
          'PDF Available': order.pdfUrl ? 'Yes' : 'No',
          'PDF Link': order.pdfUrl ? `=HYPERLINK("${window.location.origin}/uploads/${order.pdfUrl}", "Download Trip PDF")` : 'N/A'
        }))
      );

      const documentsData = (filteredOrders || [])
        .filter(order => order.pdfUrl)
        .map(order => ({
          'Document ID': order.tripNumber,
          'Type': 'Operation Order',
          'Generated Date': new Date(order.updatedAt || order.createdAt).toLocaleString(),
          'Driver': order.driver?.fullName || 'N/A',
          'Driver ID': order.driver?.uid || 'N/A',
          'Driver Contact': order.driver?.phoneNumber || 'N/A',
          'Status': 'Generated',
          'Download PDF': `=HYPERLINK("${window.location.origin}/uploads/${order.pdfUrl}", "Download PDF")`,
          'View Online': `=HYPERLINK("${window.location.origin}/uploads/${order.pdfUrl}", "View in Browser")`,
          'Associated Trip': order.tripNumber,
          'Route': `${order.fromCity} → ${order.toCity}`,
          'Passenger Count': order.passengers?.length || 0,
          'QR Code': order.qrCode ? `=HYPERLINK("${window.location.origin}/uploads/${order.qrCode}", "View QR Code")` : 'N/A'
        }));

      const dailyTripsData = (filteredOrders || []).reduce((acc: any, order) => {
        const date = new Date(order.departureTime).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = {
            'Date': date,
            'Total Trips': 0,
            'Total Passengers': 0,
            'Active Drivers': 0,
            'Generated PDFs': 0,
            'Routes': new Set(),
            'Unique Drivers': new Set(),
            'Completed Orders': 0,
            'Pending Orders': 0,
            'PDF Links': new Set()
          };
        }
        acc[date]['Total Trips']++;
        acc[date]['Total Passengers'] += order.passengers?.length || 0;
        acc[date]['Generated PDFs'] += order.pdfUrl ? 1 : 0;
        acc[date]['Routes'].add(`${order.fromCity} → ${order.toCity}`);
        if (order.driver?.uid) acc[date]['Unique Drivers'].add(order.driver.uid);
        if (order.status === 'completed') acc[date]['Completed Orders']++;
        if (order.status === 'pending') acc[date]['Pending Orders']++;
        if (order.pdfUrl) acc[date]['PDF Links'].add(`=HYPERLINK("${window.location.origin}/uploads/${order.pdfUrl}", "PDF ${order.tripNumber}")`);
        return acc;
      }, {});

      const dailyTripsArray = Object.values(dailyTripsData).map((day: any) => ({
        'Date': day.Date,
        'Total Trips': day['Total Trips'],
        'Total Passengers': day['Total Passengers'],
        'Generated PDFs': day['Generated PDFs'],
        'Routes': Array.from(day.Routes).join(', '),
        'Active Drivers Count': day['Unique Drivers'].size,
        'Completed Orders': day['Completed Orders'],
        'Pending Orders': day['Pending Orders'],
        'Completion Rate': `${((day['Completed Orders'] / day['Total Trips']) * 100).toFixed(1)}%`,
        'PDF Documents': Array.from(day['PDF Links']).join(', ')
      }));

      const wb = utils.book_new();

      const sheets = [
        { name: "Daily Summary", data: dailyTripsArray },
        { name: "Orders", data: ordersData },
        { name: "Drivers", data: driversData },
        { name: "Passengers", data: passengersData },
        { name: "Documents", data: documentsData }
      ];

      sheets.forEach(sheet => {
        const ws = utils.json_to_sheet(sheet.data);
        utils.book_append_sheet(wb, ws, sheet.name);
      });

      const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: t('notifications.success'),
        description: t('notifications.exportSuccess'),
        variant: "default"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: t('admin.exportError'),
        description: t('admin.exportErrorMessage'),
        variant: "destructive"
      });
    }
  };

  const AddDriverForm = () => {
    const form = useForm<InsertUser>({
      resolver: zodResolver(insertUserSchema),
      defaultValues: {
        role: "driver",
        status: "pending",
        isApproved: false
      }
    });

    const onSubmit = async (data: InsertUser) => {
      try {
        await addDriver(data);
        form.reset();
      } catch (error) {
        toast({
          title: t('notifications.error'),
          description: error.message,
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
                <FormLabel>{t('auth.username')} <span className="text-red-500">*</span></FormLabel>
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
                <FormLabel>{t('auth.password')} <span className="text-red-500">*</span></FormLabel>
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
                <FormLabel>{t('auth.fullName')} <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>{t('auth.idNumber')} <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>{t('auth.licenseNumber')} <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <HomeButton />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('admin.exportData')}
            </Button>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        {t('admin.addDriver')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.formTitle')}</DialogTitle>
                      </DialogHeader>
                      <AddDriverForm />
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        {t('admin.addDriver')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('admin.formTitle')}</DialogTitle>
                      </DialogHeader>
                      <AddDriverForm />
                    </DialogContent>
                  </Dialog>
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
                  <p className="text-muted-foreground textcenter py-4">{t('admin.noDocuments')}</p>
                ) : (
                  <div className="grid gap-6">
                    {filteredDocuments.map((order) => (
                      <Card key={order.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="text-lg font-semibold">
                                  {t('order.tripNumber')}: {order.tripNumber}
                                </h3>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {order.fromCity} → {order.toCity}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  {t('order.passengerCount')}: {order.passengers?.length || 0}
                                </p>
                                {order.driver && order.driver.fullName && (
                                  <p className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4" />
                                    {t('order.issuedBy')}: {order.driver.fullName}
                                    {order.driver.uid && ` (${order.driver.uid})`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={`/uploads/${order.pdfUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <FileText className="h-4 w-4" />
                                  {t('order.viewDocument')}
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/uploads/${order.pdfUrl}`, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {t('order.download')}
                              </Button>
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