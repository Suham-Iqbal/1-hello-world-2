import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell,
  MessageSquare, 
  Phone, 
  Video, 
  Search,
  Filter,
  Users,
  Settings,
  Clock,
  UserPlus,
  Edit,
  Trash2,
  Star,
  StarOff,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  MoreHorizontal,
  Mail,
  Shield,
  Zap,
  Target,
  Award,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { activityService, ActivityItem } from "@/services/activityService";

interface Activity {
  id: string;
  type: 'message' | 'call' | 'file' | 'user' | 'system' | 'project' | 'support' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'failed' | 'in-progress';
  user?: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  metadata?: {
    duration?: string;
    fileSize?: string;
    amount?: string;
    ticketId?: string;
    projectName?: string;
  };
  isRead: boolean;
  actions?: string[];
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: string;
}

// Mock data for activities
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message from John Smith',
    description: 'John sent a message in Project Alpha Team chat',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    priority: 'medium',
    status: 'completed',
    user: {
      id: 'user2',
      name: 'John Smith',
      role: 'Customer'
    },
    isRead: false,
    actions: ['Reply', 'Mark as read', 'Archive']
  },
  {
    id: '2',
    type: 'call',
    title: 'Voice call with Sarah Johnson',
    description: 'Call duration: 15 minutes 32 seconds',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    priority: 'low',
    status: 'completed',
    user: {
      id: 'user3',
      name: 'Sarah Johnson',
      role: 'Manager'
    },
    metadata: {
      duration: '15:32'
    },
    isRead: true,
    actions: ['Call back', 'Send message', 'Schedule follow-up']
  },
  {
    id: '3',
    type: 'file',
    title: 'Document uploaded: Project_Proposal.pdf',
    description: 'Sarah uploaded a new project proposal document',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    priority: 'high',
    status: 'completed',
    user: {
      id: 'user3',
      name: 'Sarah Johnson',
      role: 'Manager'
    },
    metadata: {
      fileSize: '2.4 MB'
    },
    isRead: false,
    actions: ['Download', 'Preview', 'Share']
  },
  {
    id: '4',
    type: 'user',
    title: 'New team member joined',
    description: 'Mike Wilson joined the Support Team',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    priority: 'low',
    status: 'completed',
    user: {
      id: 'user5',
      name: 'Mike Wilson',
      role: 'Support'
    },
    isRead: true,
    actions: ['Send welcome message', 'Assign mentor', 'View profile']
  },
  {
    id: '5',
    type: 'support',
    title: 'Support ticket #1234 resolved',
    description: 'Customer inquiry about billing has been resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    priority: 'medium',
    status: 'completed',
    metadata: {
      ticketId: '#1234'
    },
    isRead: false,
    actions: ['View details', 'Send feedback', 'Close ticket']
  },
  {
    id: '6',
    type: 'project',
    title: 'Project milestone completed',
    description: 'Phase 2 of Project Alpha has been completed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    priority: 'high',
    status: 'completed',
    metadata: {
      projectName: 'Project Alpha'
    },
    isRead: false,
    actions: ['View progress', 'Schedule review', 'Update client']
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment received',
    description: 'Invoice #INV-2024-001 has been paid',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    priority: 'high',
    status: 'completed',
    metadata: {
      amount: '$2,500.00'
    },
    isRead: false,
    actions: ['View invoice', 'Send receipt', 'Update records']
  },
  {
    id: '8',
    type: 'system',
    title: 'System maintenance completed',
    description: 'Scheduled maintenance has been completed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    priority: 'low',
    status: 'completed',
    isRead: true,
    actions: ['View logs', 'Test system', 'Update status']
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Login successful',
    message: 'You have successfully logged in from a new device',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false
  },
  {
    id: '2',
    type: 'info',
    title: 'System update available',
    message: 'A new version of the system is available for download',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage space low',
    message: 'You are running low on storage space. Consider cleaning up files.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false
  },
  {
    id: '4',
    type: 'error',
    title: 'Connection lost',
    message: 'Connection to the server was temporarily lost',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isRead: true
  }
];

export const ActivitiesSystem = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('activities');
  const [showFilters, setShowFilters] = useState(false);

  // Subscribe to activity service (real-time updates)
  useEffect(() => {
    const unsubscribe = activityService.subscribe((items) => {
      // Map service items to local Activity type with Date conversion
      const mapped: Activity[] = items.map((a) => ({
        id: a.id,
        type: a.type as Activity['type'],
        title: a.title,
        description: a.description,
        timestamp: new Date(a.timestamp),
        priority: a.priority as Activity['priority'],
        status: a.status as Activity['status'],
        user: a.user,
        metadata: a.metadata as any,
        isRead: a.isRead,
        actions: []
      }));
      setActivities(mapped.length ? mapped : mockActivities);
    });
    return unsubscribe;
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'file': return <FileText className="w-4 h-4" />;
      case 'user': return <UserPlus className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'project': return <Target className="w-4 h-4" />;
      case 'support': return <Shield className="w-4 h-4" />;
      case 'payment': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const markAsRead = (id: string, type: 'activity' | 'notification') => {
    if (type === 'activity') {
      setActivities(prev => prev.map(activity => 
        activity.id === id ? { ...activity, isRead: true } : activity
      ));
    } else {
      setNotifications(prev => prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    }
  };

  const handleAction = (action: string, item: Activity | Notification) => {
    toast({
      title: "Action Executed",
      description: `${action} action performed for ${item.title}`,
    });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesPriority = filterPriority === 'all' || activity.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadActivities = activities.filter(activity => !activity.isRead).length;
  const unreadNotifications = notifications.filter(notification => !notification.isRead).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Activities Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Activities & Notifications</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/chat'}
                className="text-blue-600 hover:text-blue-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activities" className="relative">
              Activities
              {unreadActivities > 0 && (
                <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {unreadActivities}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {unreadNotifications > 0 && (
                <Badge variant="default" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="px-4 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {showFilters && (
          <div className="px-4 py-2 space-y-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="message">Messages</option>
              <option value="call">Calls</option>
              <option value="file">Files</option>
              <option value="user">Users</option>
              <option value="system">System</option>
              <option value="project">Projects</option>
              <option value="support">Support</option>
              <option value="payment">Payments</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-md text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        )}

        {/* Activities List */}
        <TabsContent value="activities" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    !activity.isRead ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => markAsRead(activity.id, 'activity')}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      !activity.isRead ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium text-sm ${!activity.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>
                            {activity.priority}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                      <p className={`text-sm ${!activity.isRead ? 'text-blue-700' : 'text-gray-600'}`}>
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {activity.user && (
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={activity.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {activity.user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">{activity.user.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      {activity.actions && (
                        <div className="flex items-center space-x-2 mt-2">
                          {activity.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(action, activity);
                              }}
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Notifications List */}
        <TabsContent value="notifications" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    !notification.isRead ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => markAsRead(notification.id, 'notification')}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium text-sm ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <Badge className={`text-xs ${getPriorityColor(notification.type === 'error' ? 'high' : 'low')}`}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className={`text-sm ${!notification.isRead ? 'text-blue-700' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {notification.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(notification.action!, notification);
                            }}
                          >
                            {notification.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {activeTab === 'activities' ? 'System Activities' : 'System Notifications'}
              </h3>
              <p className="text-sm text-gray-600">
                {activeTab === 'activities' 
                  ? `Showing ${filteredActivities.length} activities`
                  : `Showing ${filteredNotifications.length} notifications`
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  activityService.markAllRead();
                  setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Export CSV from activity service
                  const csv = activityService.exportCSV();
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `activities_${new Date().toISOString().slice(0,10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeTab === 'activities' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Activity Summary Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {unreadActivities} unread
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {activities.filter(a => a.priority === 'high' || a.priority === 'urgent').length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Today's Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {activities.filter(a => 
                      a.timestamp.toDateString() === new Date().toDateString()
                    ).length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last 24 hours
                  </p>
                </CardContent>
              </Card>

              {/* Recent Activity Timeline */}
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredActivities.slice(0, 5).map((activity, index) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <Badge className={`text-xs ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Notification Summary Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {unreadNotifications} unread
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">System Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {notifications.filter(n => n.type === 'error' || n.type === 'warning').length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Requires action
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Success Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {notifications.filter(n => n.type === 'success').length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Completed tasks
                  </p>
                </CardContent>
              </Card>

              {/* Notification Types Chart */}
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Types Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {['success', 'info', 'warning', 'error'].map((type) => {
                      const count = notifications.filter(n => n.type === type).length;
                      const total = notifications.length;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      
                      return (
                        <div key={type} className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{count}</div>
                          <div className="text-sm text-gray-600 capitalize">{type}</div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
