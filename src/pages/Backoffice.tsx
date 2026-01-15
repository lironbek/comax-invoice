import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  Plus,
  Pencil,
  Trash2,
  ArrowRight,
  Loader2,
  Search,
  Check,
  X,
  Building,
  GitBranch,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  userService,
  organizationService,
  companyService,
  branchService,
  warehouseService,
  User,
  Organization,
  Company,
  Branch,
  Warehouse as WarehouseType,
} from "@/lib/supabase";

export default function Backoffice() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("companies");
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // User dialog state
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    full_name: "",
    email: "",
    organization_id: "",
    company_id: "",
    branch_id: "",
    warehouse_id: "",
    role: "user",
    is_active: true,
  });

  // Organization dialog state
  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [orgForm, setOrgForm] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    company_id: "",
    is_active: true,
  });

  // Company dialog state
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    is_active: true,
  });

  // Branch dialog state
  const [isBranchDialogOpen, setIsBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branchForm, setBranchForm] = useState({
    company_id: "",
    name: "",
    code: "",
    address: "",
    phone: "",
    email: "",
    is_active: true,
  });

  // Warehouse dialog state
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseType | null>(null);
  const [warehouseForm, setWarehouseForm] = useState({
    branch_id: "",
    name: "",
    code: "",
    address: "",
    is_active: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, orgsData, companiesData, branchesData, warehousesData] = await Promise.all([
        userService.getAll(),
        organizationService.getAll(),
        companyService.getAll(),
        branchService.getAll(),
        warehouseService.getAll(),
      ]);
      setUsers(usersData);
      setOrganizations(orgsData);
      setCompanies(companiesData);
      setBranches(branchesData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // User handlers
  const openUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        username: user.username,
        full_name: user.full_name || "",
        email: user.email || "",
        organization_id: user.organization_id || "",
        company_id: user.company_id || "",
        branch_id: user.branch_id || "",
        warehouse_id: user.warehouse_id || "",
        role: user.role || "user",
        is_active: user.is_active ?? true,
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: "",
        full_name: "",
        email: "",
        organization_id: "",
        company_id: "",
        branch_id: "",
        warehouse_id: "",
        role: "user",
        is_active: true,
      });
    }
    setIsUserDialogOpen(true);
  };

  const saveUser = async () => {
    setIsSaving(true);
    try {
      if (editingUser?.id) {
        await userService.update(editingUser.id, userForm);
      } else {
        await userService.create(userForm);
      }
      await loadData();
      setIsUserDialogOpen(false);
    } catch (error) {
      console.error("Failed to save user:", error);
      alert("שגיאה בשמירת המשתמש");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) return;
    try {
      await userService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("שגיאה במחיקת המשתמש");
    }
  };

  // Organization handlers
  const openOrgDialog = (org?: Organization) => {
    if (org) {
      setEditingOrg(org);
      setOrgForm({
        name: org.name,
        code: org.code || "",
        address: org.address || "",
        phone: org.phone || "",
        email: org.email || "",
        is_active: org.is_active ?? true,
      });
    } else {
      setEditingOrg(null);
      setOrgForm({
        name: "",
        code: "",
        address: "",
        phone: "",
        email: "",
        is_active: true,
      });
    }
    setIsOrgDialogOpen(true);
  };

  const saveOrg = async () => {
    setIsSaving(true);
    try {
      if (editingOrg?.id) {
        await organizationService.update(editingOrg.id, orgForm);
      } else {
        await organizationService.create(orgForm);
      }
      await loadData();
      setIsOrgDialogOpen(false);
    } catch (error) {
      console.error("Failed to save organization:", error);
      alert("שגיאה בשמירת הארגון");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOrg = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק ארגון זה?")) return;
    try {
      await organizationService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete organization:", error);
      alert("שגיאה במחיקת הארגון. ייתכן שיש משתמשים משויכים.");
    }
  };

  // Company handlers
  const openCompanyDialog = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setCompanyForm({
        name: company.name,
        code: company.code || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        is_active: company.is_active ?? true,
      });
    } else {
      setEditingCompany(null);
      setCompanyForm({
        name: "",
        code: "",
        address: "",
        phone: "",
        email: "",
        is_active: true,
      });
    }
    setIsCompanyDialogOpen(true);
  };

  const saveCompany = async () => {
    setIsSaving(true);
    try {
      if (editingCompany?.id) {
        await companyService.update(editingCompany.id, companyForm);
      } else {
        await companyService.create(companyForm);
      }
      await loadData();
      setIsCompanyDialogOpen(false);
    } catch (error) {
      console.error("Failed to save company:", error);
      alert("שגיאה בשמירת החברה");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק חברה זו?")) return;
    try {
      await companyService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete company:", error);
      alert("שגיאה במחיקת החברה. ייתכן שיש סניפים משויכים.");
    }
  };

  // Branch handlers
  const openBranchDialog = (branch?: Branch) => {
    if (branch) {
      setEditingBranch(branch);
      setBranchForm({
        company_id: branch.company_id,
        name: branch.name,
        code: branch.code || "",
        address: branch.address || "",
        phone: branch.phone || "",
        email: branch.email || "",
        is_active: branch.is_active ?? true,
      });
    } else {
      setEditingBranch(null);
      setBranchForm({
        company_id: "",
        name: "",
        code: "",
        address: "",
        phone: "",
        email: "",
        is_active: true,
      });
    }
    setIsBranchDialogOpen(true);
  };

  const saveBranch = async () => {
    setIsSaving(true);
    try {
      if (editingBranch?.id) {
        await branchService.update(editingBranch.id, branchForm);
      } else {
        await branchService.create(branchForm);
      }
      await loadData();
      setIsBranchDialogOpen(false);
    } catch (error) {
      console.error("Failed to save branch:", error);
      alert("שגיאה בשמירת הסניף");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBranch = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק סניף זה?")) return;
    try {
      await branchService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete branch:", error);
      alert("שגיאה במחיקת הסניף. ייתכן שיש מחסנים משויכים.");
    }
  };

  // Warehouse handlers
  const openWarehouseDialog = (warehouse?: WarehouseType) => {
    if (warehouse) {
      setEditingWarehouse(warehouse);
      setWarehouseForm({
        branch_id: warehouse.branch_id,
        name: warehouse.name,
        code: warehouse.code || "",
        address: warehouse.address || "",
        is_active: warehouse.is_active ?? true,
      });
    } else {
      setEditingWarehouse(null);
      setWarehouseForm({
        branch_id: "",
        name: "",
        code: "",
        address: "",
        is_active: true,
      });
    }
    setIsWarehouseDialogOpen(true);
  };

  const saveWarehouse = async () => {
    setIsSaving(true);
    try {
      if (editingWarehouse?.id) {
        await warehouseService.update(editingWarehouse.id, warehouseForm);
      } else {
        await warehouseService.create(warehouseForm);
      }
      await loadData();
      setIsWarehouseDialogOpen(false);
    } catch (error) {
      console.error("Failed to save warehouse:", error);
      alert("שגיאה בשמירת המחסן");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteWarehouse = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק מחסן זה?")) return;
    try {
      await warehouseService.delete(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
      alert("שגיאה במחיקת המחסן");
    }
  };

  // Filter data based on search
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrgs = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get filtered branches by company
  const getBranchesByCompany = (companyId: string) => {
    return branches.filter((b) => b.company_id === companyId);
  };

  // Get filtered warehouses by branch
  const getWarehousesByBranch = (branchId: string) => {
    return warehouses.filter((w) => w.branch_id === branchId);
  };

  // Get add button text based on active tab
  const getAddButtonText = () => {
    switch (activeTab) {
      case "companies":
        return "הוסף חברה";
      case "branches":
        return "הוסף סניף";
      case "warehouses":
        return "הוסף מחסן";
      case "organizations":
        return "הוסף ארגון";
      case "users":
        return "הוסף משתמש";
      default:
        return "הוסף";
    }
  };

  // Handle add button click based on active tab
  const handleAddClick = () => {
    switch (activeTab) {
      case "companies":
        openCompanyDialog();
        break;
      case "branches":
        openBranchDialog();
        break;
      case "warehouses":
        openWarehouseDialog();
        break;
      case "organizations":
        openOrgDialog();
        break;
      case "users":
        openUserDialog();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background font-assistant rtl-container">
      {/* Header */}
      <header className="bg-receipt-green h-16 flex items-center justify-between px-6 text-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה למערכת
          </Button>
        </div>
        <h1 className="text-xl font-bold">בק אופיס - ניהול מערכת</h1>
      </header>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
          <TabsList className="grid w-full max-w-4xl grid-cols-5 mb-6">
            <TabsTrigger value="companies" className="gap-2">
              <Building className="w-4 h-4" />
              חברות
            </TabsTrigger>
            <TabsTrigger value="branches" className="gap-2">
              <GitBranch className="w-4 h-4" />
              סניפים
            </TabsTrigger>
            <TabsTrigger value="warehouses" className="gap-2">
              <Warehouse className="w-4 h-4" />
              מחסנים
            </TabsTrigger>
            <TabsTrigger value="organizations" className="gap-2">
              <Building2 className="w-4 h-4" />
              ארגונים
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              משתמשים
            </TabsTrigger>
          </TabsList>

          {/* Search and Add */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="חיפוש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              onClick={handleAddClick}
              className="bg-receipt-green hover:bg-receipt-green/90 gap-2"
            >
              <Plus className="w-4 h-4" />
              {getAddButtonText()}
            </Button>
          </div>

          {/* Companies Tab */}
          <TabsContent value="companies">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-receipt-green" />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם חברה</TableHead>
                      <TableHead className="text-right">קוד</TableHead>
                      <TableHead className="text-right">טלפון</TableHead>
                      <TableHead className="text-right">אימייל</TableHead>
                      <TableHead className="text-right">כתובת</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          לא נמצאו חברות
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.code || "-"}</TableCell>
                          <TableCell>{company.phone || "-"}</TableCell>
                          <TableCell>{company.email || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">{company.address || "-"}</TableCell>
                          <TableCell>
                            {company.is_active ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                פעיל
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <X className="w-4 h-4" />
                                לא פעיל
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openCompanyDialog(company)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteCompany(company.id!)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Branches Tab */}
          <TabsContent value="branches">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-receipt-green" />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם סניף</TableHead>
                      <TableHead className="text-right">חברה</TableHead>
                      <TableHead className="text-right">קוד</TableHead>
                      <TableHead className="text-right">טלפון</TableHead>
                      <TableHead className="text-right">אימייל</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBranches.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          לא נמצאו סניפים
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBranches.map((branch) => (
                        <TableRow key={branch.id}>
                          <TableCell className="font-medium">{branch.name}</TableCell>
                          <TableCell>{branch.company?.name || "-"}</TableCell>
                          <TableCell>{branch.code || "-"}</TableCell>
                          <TableCell>{branch.phone || "-"}</TableCell>
                          <TableCell>{branch.email || "-"}</TableCell>
                          <TableCell>
                            {branch.is_active ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                פעיל
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <X className="w-4 h-4" />
                                לא פעיל
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openBranchDialog(branch)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteBranch(branch.id!)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Warehouses Tab */}
          <TabsContent value="warehouses">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-receipt-green" />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם מחסן</TableHead>
                      <TableHead className="text-right">סניף</TableHead>
                      <TableHead className="text-right">חברה</TableHead>
                      <TableHead className="text-right">קוד</TableHead>
                      <TableHead className="text-right">כתובת</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWarehouses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          לא נמצאו מחסנים
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredWarehouses.map((warehouse) => (
                        <TableRow key={warehouse.id}>
                          <TableCell className="font-medium">{warehouse.name}</TableCell>
                          <TableCell>{warehouse.branch?.name || "-"}</TableCell>
                          <TableCell>{warehouse.branch?.company?.name || "-"}</TableCell>
                          <TableCell>{warehouse.code || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">{warehouse.address || "-"}</TableCell>
                          <TableCell>
                            {warehouse.is_active ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                פעיל
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <X className="w-4 h-4" />
                                לא פעיל
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={() => openWarehouseDialog(warehouse)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => deleteWarehouse(warehouse.id!)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-receipt-green" />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם משתמש</TableHead>
                      <TableHead className="text-right">שם מלא</TableHead>
                      <TableHead className="text-right">אימייל</TableHead>
                      <TableHead className="text-right">ארגון</TableHead>
                      <TableHead className="text-right">תפקיד</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          לא נמצאו משתמשים
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.username}
                          </TableCell>
                          <TableCell>{user.full_name || "-"}</TableCell>
                          <TableCell>{user.email || "-"}</TableCell>
                          <TableCell>
                            {user.organization?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {user.role === "admin" ? "מנהל" : "משתמש"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.is_active ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                פעיל
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <X className="w-4 h-4" />
                                לא פעיל
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openUserDialog(user)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteUser(user.id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Organizations Tab */}
          <TabsContent value="organizations">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-receipt-green" />
              </div>
            ) : (
              <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם ארגון</TableHead>
                      <TableHead className="text-right">קוד</TableHead>
                      <TableHead className="text-right">טלפון</TableHead>
                      <TableHead className="text-right">אימייל</TableHead>
                      <TableHead className="text-right">כתובת</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrgs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          לא נמצאו ארגונים
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrgs.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell className="font-medium">
                            {org.name}
                          </TableCell>
                          <TableCell>{org.code || "-"}</TableCell>
                          <TableCell>{org.phone || "-"}</TableCell>
                          <TableCell>{org.email || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {org.address || "-"}
                          </TableCell>
                          <TableCell>
                            {org.is_active ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                פעיל
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <X className="w-4 h-4" />
                                לא פעיל
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => openOrgDialog(org)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteOrg(org.id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="rtl-container" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "עריכת משתמש" : "הוספת משתמש חדש"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>שם משתמש *</Label>
              <Input
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
                placeholder="הזן שם משתמש"
              />
            </div>
            <div className="space-y-2">
              <Label>שם מלא</Label>
              <Input
                value={userForm.full_name}
                onChange={(e) =>
                  setUserForm({ ...userForm, full_name: e.target.value })
                }
                placeholder="הזן שם מלא"
              />
            </div>
            <div className="space-y-2">
              <Label>אימייל</Label>
              <Input
                type="email"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
                placeholder="הזן אימייל"
              />
            </div>
            <div className="space-y-2">
              <Label>חברה</Label>
              <Select
                value={userForm.company_id}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, company_id: value, branch_id: "", warehouse_id: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר חברה" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id!}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>סניף</Label>
              <Select
                value={userForm.branch_id}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, branch_id: value, warehouse_id: "" })
                }
                disabled={!userForm.company_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סניף" />
                </SelectTrigger>
                <SelectContent>
                  {getBranchesByCompany(userForm.company_id).map((branch) => (
                    <SelectItem key={branch.id} value={branch.id!}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>מחסן</Label>
              <Select
                value={userForm.warehouse_id}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, warehouse_id: value })
                }
                disabled={!userForm.branch_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר מחסן" />
                </SelectTrigger>
                <SelectContent>
                  {getWarehousesByBranch(userForm.branch_id).map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id!}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ארגון</Label>
              <Select
                value={userForm.organization_id}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, organization_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר ארגון" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id!}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>תפקיד</Label>
              <Select
                value={userForm.role}
                onValueChange={(value) =>
                  setUserForm({ ...userForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">משתמש</SelectItem>
                  <SelectItem value="admin">מנהל</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="user-active"
                checked={userForm.is_active}
                onChange={(e) =>
                  setUserForm({ ...userForm, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="user-active">משתמש פעיל</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsUserDialogOpen(false)}
            >
              ביטול
            </Button>
            <Button
              onClick={saveUser}
              disabled={isSaving || !userForm.username}
              className="bg-receipt-green hover:bg-receipt-green/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "שמור"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Organization Dialog */}
      <Dialog open={isOrgDialogOpen} onOpenChange={setIsOrgDialogOpen}>
        <DialogContent className="rtl-container" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingOrg ? "עריכת ארגון" : "הוספת ארגון חדש"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>שם ארגון *</Label>
              <Input
                value={orgForm.name}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, name: e.target.value })
                }
                placeholder="הזן שם ארגון"
              />
            </div>
            <div className="space-y-2">
              <Label>קוד ארגון</Label>
              <Input
                value={orgForm.code}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, code: e.target.value })
                }
                placeholder="הזן קוד ארגון"
              />
            </div>
            <div className="space-y-2">
              <Label>טלפון</Label>
              <Input
                value={orgForm.phone}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, phone: e.target.value })
                }
                placeholder="הזן מספר טלפון"
              />
            </div>
            <div className="space-y-2">
              <Label>אימייל</Label>
              <Input
                type="email"
                value={orgForm.email}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, email: e.target.value })
                }
                placeholder="הזן אימייל"
              />
            </div>
            <div className="space-y-2">
              <Label>כתובת</Label>
              <Input
                value={orgForm.address}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, address: e.target.value })
                }
                placeholder="הזן כתובת"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="org-active"
                checked={orgForm.is_active}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="org-active">ארגון פעיל</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsOrgDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={saveOrg}
              disabled={isSaving || !orgForm.name}
              className="bg-receipt-green hover:bg-receipt-green/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "שמור"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Dialog */}
      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent className="rtl-container" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "עריכת חברה" : "הוספת חברה חדשה"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>שם חברה *</Label>
              <Input
                value={companyForm.name}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, name: e.target.value })
                }
                placeholder="הזן שם חברה"
              />
            </div>
            <div className="space-y-2">
              <Label>קוד חברה</Label>
              <Input
                value={companyForm.code}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, code: e.target.value })
                }
                placeholder="הזן קוד חברה"
              />
            </div>
            <div className="space-y-2">
              <Label>טלפון</Label>
              <Input
                value={companyForm.phone}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, phone: e.target.value })
                }
                placeholder="הזן מספר טלפון"
              />
            </div>
            <div className="space-y-2">
              <Label>אימייל</Label>
              <Input
                type="email"
                value={companyForm.email}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, email: e.target.value })
                }
                placeholder="הזן אימייל"
              />
            </div>
            <div className="space-y-2">
              <Label>כתובת</Label>
              <Input
                value={companyForm.address}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, address: e.target.value })
                }
                placeholder="הזן כתובת"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="company-active"
                checked={companyForm.is_active}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="company-active">חברה פעילה</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsCompanyDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={saveCompany}
              disabled={isSaving || !companyForm.name}
              className="bg-receipt-green hover:bg-receipt-green/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "שמור"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Branch Dialog */}
      <Dialog open={isBranchDialogOpen} onOpenChange={setIsBranchDialogOpen}>
        <DialogContent className="rtl-container" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingBranch ? "עריכת סניף" : "הוספת סניף חדש"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>חברה *</Label>
              <Select
                value={branchForm.company_id}
                onValueChange={(value) =>
                  setBranchForm({ ...branchForm, company_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר חברה" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id!}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>שם סניף *</Label>
              <Input
                value={branchForm.name}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, name: e.target.value })
                }
                placeholder="הזן שם סניף"
              />
            </div>
            <div className="space-y-2">
              <Label>קוד סניף</Label>
              <Input
                value={branchForm.code}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, code: e.target.value })
                }
                placeholder="הזן קוד סניף"
              />
            </div>
            <div className="space-y-2">
              <Label>טלפון</Label>
              <Input
                value={branchForm.phone}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, phone: e.target.value })
                }
                placeholder="הזן מספר טלפון"
              />
            </div>
            <div className="space-y-2">
              <Label>אימייל</Label>
              <Input
                type="email"
                value={branchForm.email}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, email: e.target.value })
                }
                placeholder="הזן אימייל"
              />
            </div>
            <div className="space-y-2">
              <Label>כתובת</Label>
              <Input
                value={branchForm.address}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, address: e.target.value })
                }
                placeholder="הזן כתובת"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="branch-active"
                checked={branchForm.is_active}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="branch-active">סניף פעיל</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsBranchDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={saveBranch}
              disabled={isSaving || !branchForm.name || !branchForm.company_id}
              className="bg-receipt-green hover:bg-receipt-green/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "שמור"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warehouse Dialog */}
      <Dialog open={isWarehouseDialogOpen} onOpenChange={setIsWarehouseDialogOpen}>
        <DialogContent className="rtl-container" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? "עריכת מחסן" : "הוספת מחסן חדש"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>סניף *</Label>
              <Select
                value={warehouseForm.branch_id}
                onValueChange={(value) =>
                  setWarehouseForm({ ...warehouseForm, branch_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סניף" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id!}>
                      {branch.company?.name} - {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>שם מחסן *</Label>
              <Input
                value={warehouseForm.name}
                onChange={(e) =>
                  setWarehouseForm({ ...warehouseForm, name: e.target.value })
                }
                placeholder="הזן שם מחסן"
              />
            </div>
            <div className="space-y-2">
              <Label>קוד מחסן</Label>
              <Input
                value={warehouseForm.code}
                onChange={(e) =>
                  setWarehouseForm({ ...warehouseForm, code: e.target.value })
                }
                placeholder="הזן קוד מחסן"
              />
            </div>
            <div className="space-y-2">
              <Label>כתובת</Label>
              <Input
                value={warehouseForm.address}
                onChange={(e) =>
                  setWarehouseForm({ ...warehouseForm, address: e.target.value })
                }
                placeholder="הזן כתובת"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="warehouse-active"
                checked={warehouseForm.is_active}
                onChange={(e) =>
                  setWarehouseForm({ ...warehouseForm, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="warehouse-active">מחסן פעיל</Label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsWarehouseDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={saveWarehouse}
              disabled={isSaving || !warehouseForm.name || !warehouseForm.branch_id}
              className="bg-receipt-green hover:bg-receipt-green/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "שמור"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
