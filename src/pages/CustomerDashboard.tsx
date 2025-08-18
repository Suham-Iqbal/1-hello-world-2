import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Target, 
  HeadphonesIcon, 
  MessageSquare, 
  CreditCard, 
  Settings,
  Plus,
  Search,
  Eye,
  Download,
  Phone,
  Video,
  Send,
  Paperclip,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for customer
const mockCustomerData = {
  profile: {
    name: "John Smith",
    email: "john@client.com",
    company: "Acme Corporation",
    phone: "+1 (555) 123-4567",
    avatar: ""
  },
  projects: [
    { 
      id: 1, 
      name: "Website Redesign", 
      status: "In Progress", 
      progress: 65, 
      dueDate: "2024-09-15",
      description: "Complete redesign of company website with modern UI/UX",
      assignedTo: "Sarah Johnson"
    },
    { 
      id: 2, 
      name: "Mobile App Development", 
      status: "Planning", 
      progress: 25, 
      dueDate: "2024-10-01",
      description: "iOS and Android mobile application for customer portal",
      assignedTo: "Mike Davis"
    }
  ],
  tickets: [
    { 
      id: 1, 
      title: "Login issue with new portal", 
      status: "Open", 
      priority: "High", 
      createdAt: "2024-08-20",
      assignedTo: "Sarah Johnson",
      lastUpdate: "2 hours ago"
    },
    { 
      id: 2, 
      title: "Feature request for mobile app", 
      status: "In Progress", 
      priority: "Medium", 
      createdAt: "2024-08-18",
      assignedTo: "Mike Davis",
      lastUpdate: "1 day ago"
    }
  ],
  invoices: [
    { 
      id: 1, 
      number: "INV-001", 
      amount: 5000, 
      status: "Paid", 
      dueDate: "2024-08-15",
      description: "Website Redesign - Phase 1"
    },
    { 
      id: 2, 
      number: "INV-002", 
      amount: 3000, 
      status: "Pending", 
      dueDate: "2024-09-01",
      description: "Mobile App Development - Planning"
    }
  ],
  recentActivities: [
    { 
      id: 1, 
      action: "Project updated", 
      description: "Website Redesign progress updated to 65%", 
      timestamp: "2 hours ago" 
    },
    { 
      id: 2, 
      action: "Support ticket created", 
      description: "New ticket: Login issue with new portal", 
      timestamp: "1 day ago" 
    },
    { 
      id: 3, 
      action: "Invoice sent", 
      description: "Invoice INV-002 sent for Mobile App Development", 
      timestamp: "2 days ago" 
    }
  ]
};

export const CustomerDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "Medium"
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket Created",
      description: "Your support ticket has been submitted successfully",
    });

    setNewTicket({ title: "", description: "", priority: "Medium" });
    setShowNewTicketForm(false);
  };

  const handlePayment = (invoiceId: number) => {
    toast({
      title: "Payment Processing",
      description: "Redirecting to payment gateway...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {mockCustomerData.profile.name}</h1>
              <p className="text-gray-600">{mockCustomerData.profile.company}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockCustomerData.projects.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {mockCustomerData.projects.filter(p => p.status === "In Progress").length} in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                  <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockCustomerData.tickets.filter(t => t.status === "Open").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockCustomerData.tickets.filter(t => t.status === "In Progress").length} being worked on
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${mockCustomerData.invoices.filter(i => i.status === "Pending")
                      .reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockCustomerData.invoices.filter(i => i.status === "Pending").length} unpaid
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Due Date</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockCustomerData.projects.find(p => p.status === "In Progress")?.dueDate || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Website Redesign
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomerData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomerData.projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.description}</p>
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
                          <span>Assigned: {project.assignedTo}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat with Team
                        </Button>
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
                <div className="flex items-center justify-between">
                  <CardTitle>Support Tickets</CardTitle>
                  <Button onClick={() => setShowNewTicketForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showNewTicketForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-medium mb-4">Create New Support Ticket</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ticket-title">Title *</Label>
                        <Input
                          id="ticket-title"
                          placeholder="Brief description of the issue"
                          value={newTicket.title}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ticket-description">Description *</Label>
                        <Textarea
                          id="ticket-description"
                          placeholder="Detailed description of the issue..."
                          value={newTicket.description}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleCreateTicket}>
                          Submit Ticket
                        </Button>
                        <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {mockCustomerData.tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{ticket.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            ticket.priority === "High" ? "destructive" : 
                            ticket.priority === "Medium" ? "secondary" : "outline"
                          }>
                            {ticket.priority}
                          </Badge>
                          <Badge variant={
                            ticket.status === "Closed" ? "default" : 
                            ticket.status === "In Progress" ? "secondary" : "outline"
                          }>
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Created: {ticket.createdAt}</span>
                        <span>Assigned: {ticket.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Chat with Support
                        </Button>
                        <span className="text-sm text-gray-500">
                          Last update: {ticket.lastUpdate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoices & Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCustomerData.invoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{invoice.number}</h3>
                          <p className="text-sm text-gray-600">{invoice.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">${invoice.amount.toLocaleString()}</div>
                          <Badge variant={
                            invoice.status === "Paid" ? "default" : 
                            invoice.status === "Pending" ? "secondary" : "outline"
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600 mb-4">
                        <span>Due: {invoice.dueDate}</span>
                        <span>Invoice ID: {invoice.id}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download PDF
                        </Button>
                        {invoice.status === "Pending" && (
                          <Button onClick={() => handlePayment(invoice.id)}>
                            Pay Now
                          </Button>
                        )}
                        {invoice.status === "Paid" && (
                          <Badge variant="default">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{mockCustomerData.profile.name}</h3>
                      <p className="text-gray-600">{mockCustomerData.profile.company}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-sm text-gray-600">{mockCustomerData.profile.name}</p>
                    </div>
                    <div>
                      <Label>Email Address</Label>
                      <p className="text-sm text-gray-600">{mockCustomerData.profile.email}</p>
                    </div>
                    <div>
                      <Label>Company</Label>
                      <p className="text-sm text-gray-600">{mockCustomerData.profile.company}</p>
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <p className="text-sm text-gray-600">{mockCustomerData.profile.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
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
