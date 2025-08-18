import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Target, 
  MessageSquare, 
  HeadphonesIcon, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  Building,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API
const mockData = {
  metrics: {
    totalCustomers: 1247,
    activeProjects: 89,
    revenueThisMonth: 125000,
    pendingInvoices: 23,
    supportTickets: 45,
    activeChats: 67
  },
  users: [
    { id: 1, name: "John Smith", email: "john@company.com", role: "Manager", status: "Active", lastActive: "2 hours ago" },
    { id: 2, name: "Sarah Johnson", email: "sarah@company.com", role: "Agent", status: "Active", lastActive: "1 hour ago" },
    { id: 3, name: "Mike Davis", email: "mike@company.com", role: "Agent", status: "Offline", lastActive: "3 days ago" },
    { id: 4, name: "Lisa Wilson", email: "lisa@company.com", role: "Manager", status: "Active", lastActive: "30 min ago" }
  ],
  projects: [
    { id: 1, name: "Website Redesign", customer: "Acme Corp", status: "In Progress", progress: 65, dueDate: "2024-09-15" },
    { id: 2, name: "Mobile App Development", customer: "TechStart", status: "Planning", progress: 25, dueDate: "2024-10-01" },
    { id: 3, name: "E-commerce Platform", customer: "RetailPlus", status: "Completed", progress: 100, dueDate: "2024-08-20" }
  ],
  tickets: [
    { id: 1, title: "Login issue", customer: "john@client.com", status: "Open", priority: "High", assignedTo: "Sarah Johnson" },
    { id: 2, title: "Payment failed", customer: "mike@client.com", status: "In Progress", priority: "Medium", assignedTo: "John Smith" },
    { id: 3, title: "Feature request", customer: "lisa@client.com", status: "Closed", priority: "Low", assignedTo: "Mike Davis" }
  ]
};

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "User creation form will open here",
    });
  };

  const handleUserAction = (action: string, userId: number) => {
    toast({
      title: `${action} User`,
      description: `Action ${action} performed on user ${userId}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Control tower for your organization</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.totalCustomers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockData.metrics.activeProjects} ongoing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${mockData.metrics.revenueThisMonth.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.pendingInvoices}</div>
                  <p className="text-xs text-muted-foreground">
                    ${(mockData.metrics.pendingInvoices * 5000).toLocaleString()} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
                  <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.supportTickets}</div>
                  <p className="text-xs text-muted-foreground">
                    12 open, 33 closed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockData.metrics.activeChats}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockData.metrics.activeChats} conversations
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <UserPlus className="w-6 h-6 mb-2" />
                    Add User
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Building className="w-6 h-6 mb-2" />
                    Create Project
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Start Chat
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <BarChart3 className="w-6 h-6 mb-2" />
                    View Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <Button onClick={handleAddUser}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === "Manager" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                            <Badge variant={user.status === "Active" ? "default" : "outline"}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{user.lastActive}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleUserAction("View", user.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleUserAction("Edit", user.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleUserAction("Delete", user.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Control Center</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Private Chats */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Private Chats</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">John Smith</p>
                            <p className="text-sm text-gray-600">Last message 2 min ago</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group Chats */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Group Chats</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Project Alpha Team</p>
                            <p className="text-sm text-gray-600">8 members, 3 online</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Controls */}
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-3">Chat Controls</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Moderate Messages
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Groups
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Chat Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Management</CardTitle>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-600">Customer: {project.customer}</p>
                        </div>
                        <Badge variant={
                          project.status === "Completed" ? "default" : 
                          project.status === "In Progress" ? "secondary" : "outline"
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Due: {project.dueDate}</span>
                          <span>ID: #{project.id}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{ticket.title}</h3>
                        <Badge variant={
                          ticket.priority === "High" ? "destructive" : 
                          ticket.priority === "Medium" ? "secondary" : "outline"
                        }>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Customer: {ticket.customer}</span>
                        <span>Assigned: {ticket.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant={
                          ticket.status === "Closed" ? "default" : 
                          ticket.status === "In Progress" ? "secondary" : "outline"
                        }>
                          {ticket.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Sales Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Revenue by Month
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Top Customers
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Target className="w-4 h-4 mr-2" />
                        Sales Pipeline
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Support Reports</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <HeadphonesIcon className="w-4 h-4 mr-2" />
                        Tickets by Status
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Response Times
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolution Rates
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-3">Export Options</h4>
                  <div className="flex space-x-2">
                    <Button variant="outline">Export CSV</Button>
                    <Button variant="outline">Export PDF</Button>
                    <Button variant="outline">Schedule Reports</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
