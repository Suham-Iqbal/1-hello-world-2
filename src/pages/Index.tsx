import { CRMSidebar } from "@/components/CRMSidebar";
import { TopBar } from "@/components/TopBar";
import { MetricCard } from "@/components/MetricCard";
import { TaskItem } from "@/components/TaskItem";
import { ActivityItem } from "@/components/ActivityItem";
import { LeadItem } from "@/components/LeadItem";
import { DealItem } from "@/components/DealItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCRMData } from "@/hooks/useCRMData";
import { Rocket, Target, CheckCircle, DollarSign, Loader2, MessageSquare, Users, Trophy, TrendingUp, Star, Crown, Medal, Award, Home, Search, Grid3X3, BarChart3, Settings, RefreshCw, User, MoreHorizontal, Send, Eye, Maximize2, MoreVertical, Clock, Wallet, TrendingDown, ExternalLink, Brain, Package, ArrowRight, ArrowLeft, Paperclip, Smile, Bell, Shield, Lock, Smartphone, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { activityService } from "@/services/activityService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { data: crmData, isLoading, error } = useCRMData();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState("overview");
  const [chatMode, setChatMode] = useState<"private" | "general">("general");
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userScores, setUserScores] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Mock user data for chat
  const mockUsers = [
    { id: "user1", name: "You", role: "Admin", avatar: "", isOnline: true },
    { id: "user2", name: "John Smith", role: "Manager", avatar: "", isOnline: true },
    { id: "user3", name: "Sarah Johnson", role: "Agent", avatar: "", isOnline: false },
    { id: "user4", name: "Mike Wilson", role: "Support", avatar: "", isOnline: true },
  ];

  // Mock messages for general chat
  const mockGeneralMessages = [
    { id: 1, sender: "user2", content: "Good morning team! How's everyone doing?", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 2, sender: "user4", content: "Morning! Ready for another productive day.", timestamp: new Date(Date.now() - 1000 * 60 * 25) },
    { id: 3, sender: "user1", content: "Great! Let's focus on closing those deals today.", timestamp: new Date(Date.now() - 1000 * 60 * 20) },
    { id: 4, sender: "user3", content: "I'll be joining in a bit. Working on some leads.", timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  ];

  // Mock private messages
  const mockPrivateMessages = {
    user2: [
      { id: 1, sender: "user2", content: "Hi! Can we discuss the new project proposal?", timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { id: 2, sender: "user1", content: "Of course! What's on your mind?", timestamp: new Date(Date.now() - 1000 * 60 * 40) },
      { id: 3, sender: "user2", content: "I think we should focus on the mobile app first.", timestamp: new Date(Date.now() - 1000 * 60 * 35) },
    ],
    user3: [
      { id: 1, sender: "user3", content: "The new leads look promising!", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
      { id: 4, sender: "user1", content: "Agreed! Let's follow up with them today.", timestamp: new Date(Date.now() - 1000 * 60 * 55) },
    ],
    user4: [
      { id: 1, sender: "user4", content: "Support tickets are all resolved.", timestamp: new Date(Date.now() - 1000 * 60 * 90) },
      { id: 5, sender: "user1", content: "Excellent work! Keep it up.", timestamp: new Date(Date.now() - 1000 * 60 * 85) },
    ],
  };

  // Mock user scores
  const mockUserScores = [
    { id: "user1", name: "You", role: "Admin", score: 1250, level: "Master", avatar: "", rank: 1 },
    { id: "user2", name: "John Smith", role: "Manager", score: 980, level: "Expert", avatar: "", rank: 2 },
    { id: "user3", name: "Sarah Johnson", role: "Agent", score: 750, level: "Advanced", avatar: "", rank: 3 },
    { id: "user4", name: "Mike Wilson", role: "Support", score: 620, level: "Intermediate", avatar: "", rank: 4 },
  ];

  useEffect(() => {
    // Initialize messages based on mode
    if (chatMode === "general") {
      setMessages(mockGeneralMessages);
    } else if (selectedUser) {
      setMessages(mockPrivateMessages[selectedUser as keyof typeof mockPrivateMessages] || []);
    }
    
    // Initialize user scores
    setUserScores(mockUserScores);
  }, [chatMode, selectedUser]);

  // Simulate typing indicator when user starts typing
  useEffect(() => {
    if (newMessage.length > 0 && !isTyping) {
      setIsTyping(true);
      setTypingUser("user1");
      
      // Clear typing indicator after 3 seconds
      const timer = setTimeout(() => {
        setIsTyping(false);
        setTypingUser(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [newMessage, isTyping]);

  const handleMarkTaskDone = (taskId: number) => {
    toast({
      title: "Task completed!",
      description: "Task has been marked as done.",
    });

    // Update user score for completing task
    setUserScores(prev => prev.map(user => 
      user.id === "user1" 
        ? { ...user, score: user.score + 50 }
        : user
    ));

    // Update leaderboard ranking
    setUserScores(prev => {
      const updated = [...prev];
      updated.sort((a, b) => b.score - a.score);
      return updated.map((user, index) => ({ ...user, rank: index + 1 }));
    });

    // Log activity for task completion
    activityService.log({
      type: 'project',
      title: 'Task completed',
      description: 'Marked a task as done',
      priority: 'medium',
      status: 'completed',
      user: { id: 'user1', name: 'You', role: 'Admin' },
      metadata: { taskId, pointsEarned: 50 }
    });

    // Show score update notification
    toast({
      title: "Points earned!",
      description: "+50 points for completing a task",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: "user1",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setIsTyping(false);
    setTypingUser(null);

    // Update user score for sending message
    setUserScores(prev => prev.map(user => 
      user.id === "user1" 
        ? { ...user, score: user.score + 25 }
        : user
    ));

    // Update leaderboard ranking
    setUserScores(prev => {
      const updated = [...prev];
      updated.sort((a, b) => b.score - a.score);
      return updated.map((user, index) => ({ ...user, rank: index + 1 }));
    });

    // Log activity for scoring
    activityService.log({
      type: 'message',
      title: 'Message sent',
      description: `Sent message in ${chatMode === 'general' ? 'General Chat' : `Private chat with ${selectedUser}`}`,
      priority: 'low',
      status: 'completed',
      user: { id: 'user1', name: 'You', role: 'Admin' },
      metadata: { chatMode, recipient: selectedUser, pointsEarned: 25 }
    });

    // Show score update notification
    toast({
      title: "Points earned!",
      description: "+25 points for sending a message",
    });

    // Simulate reply after 2-5 seconds
    setTimeout(() => {
      const replyUser = chatMode === "general" ? mockUsers[Math.floor(Math.random() * 3) + 1] : mockUsers.find(u => u.id === selectedUser);
      if (replyUser) {
        // Show typing indicator
        setTypingUser(replyUser.id);
        setIsTyping(true);
        
        // Hide typing and show reply after 2-4 seconds
        setTimeout(() => {
          const replies = [
            "Got it!",
            "Thanks for the update!",
            "I'll look into that.",
            "Perfect!",
            "Great idea!",
            "Let me check on that.",
          ];
          const reply = {
            id: Date.now() + 1,
            sender: replyUser.id,
            content: replies[Math.floor(Math.random() * replies.length)],
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, reply]);
          setIsTyping(false);
          setTypingUser(null);
        }, 2000 + Math.random() * 2000);
      }
    }, 2000 + Math.random() * 3000);
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Master": return <Crown className="w-4 h-4 text-yellow-500" />;
      case "Expert": return <Trophy className="w-4 h-4 text-orange-500" />;
      case "Advanced": return <Medal className="w-4 h-4 text-blue-500" />;
      case "Intermediate": return <Award className="w-4 h-4 text-green-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Master": return "bg-yellow-100 text-yellow-800";
      case "Expert": return "bg-orange-100 text-orange-800";
      case "Advanced": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderOverview = () => (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Sales Analysis</h1>
            <p className="text-muted-foreground">Comprehensive overview of your business performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              + Add Widget
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="outline">
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-900 to-purple-900 text-white border-0 shadow-xl">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">AI Assistant</h3>
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
              </div>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Analyze product sales over last year. Compare revenue, quality, sales and brand performance.
              </p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 border-0">
                Analyze product sales
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Total Sales Widget */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Total Sales</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="week">
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Mon</span>
                <span className="text-muted-foreground">Tue</span>
                <span className="text-muted-foreground">Wed</span>
                <span className="text-muted-foreground">Thur</span>
                <span className="text-muted-foreground">Fri</span>
                <span className="text-muted-foreground">Sat</span>
              </div>
              <div className="flex justify-between items-end h-32">
                <div className="w-8 bg-gray-200 rounded-t-sm h-16"></div>
                <div className="w-8 bg-gray-200 rounded-t-sm h-20"></div>
                <div className="w-8 bg-orange-500 rounded-t-sm h-28 relative">
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-orange-600">$890.5</span>
                </div>
                <div className="w-8 bg-gray-200 rounded-t-sm h-18"></div>
                <div className="w-8 bg-gray-200 rounded-t-sm h-22"></div>
                <div className="w-8 bg-gray-200 rounded-t-sm h-14"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Revenue Widget */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Sales Revenue</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">24% for 1 day</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">$1,609.18</div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Received Amount</span>
                </div>
                <div className="h-16 bg-green-100 rounded mt-2 flex items-end justify-center">
                  <div className="w-full bg-green-500 rounded h-12"></div>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">8%</span>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">$2,189.21</div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Ordered Amount</span>
                </div>
                <div className="h-16 bg-red-100 rounded mt-2 flex items-end justify-center">
                  <div className="w-full bg-red-500 rounded h-8"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales Widget */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Recent Sales</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Select defaultValue="week">
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Timothy Williams", time: "Today", status: "New", amount: "+$324.99", statusColor: "bg-green-100 text-green-800" },
                { name: "Glen Wood", time: "2 Days Ago", status: "New", amount: "+$200.00", statusColor: "bg-green-100 text-green-800" },
                { name: "Raymond Johnson", time: "1 Day Ago", status: "Cancelled", amount: "", statusColor: "bg-red-100 text-red-800" },
                { name: "Kenneth Henderson", time: "2 Days Ago", status: "Completed", amount: "+$840.99", statusColor: "bg-purple-100 text-purple-800" },
              ].map((sale, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gray-100">
                        {sale.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{sale.name}</p>
                      <p className="text-xs text-muted-foreground">{sale.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={sale.statusColor}>{sale.status}</Badge>
                    {sale.amount && <span className="text-sm font-medium text-green-600">{sale.amount}</span>}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth Widget */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-lg">Growth</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset="67.8"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-purple-600">+73.1%</div>
                <div className="text-xs text-muted-foreground">Growth rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Item Sales Widget */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Top Item Sales</CardTitle>
              </div>
              <Button variant="ghost" className="text-sm text-blue-600 hover:text-blue-700">
                View All &gt;
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "DualSense", category: "Technique", amount: "$320.24", change: "+12%", changeColor: "text-green-600" },
                { name: "Gamepad", category: "Accessories", amount: "$180.90", change: "-23%", changeColor: "text-red-600" },
                { name: "VR2", category: "Accessories", amount: "$124.00", change: "+42%", changeColor: "text-green-600" },
                { name: "Steam codes", category: "Subscription", amount: "$100.40", change: "+29%", changeColor: "text-green-600" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{item.amount}</p>
                      <p className={`text-xs ${item.changeColor}`}>{item.change}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, 60 + index * 10)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderLeads = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Leads</h1>
        <p className="text-muted-foreground">Manage your lead pipeline</p>
      </div>

      <div className="space-y-4">
        {crmData?.leads.map((lead) => (
          <LeadItem
            key={lead.id}
            name={lead.name}
            email={lead.email}
            company={lead.company}
            status={lead.status}
            value={lead.value}
            source={lead.source}
          />
        ))}
      </div>
    </>
  );

  const renderDeals = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Deals</h1>
        <p className="text-muted-foreground">Track your sales opportunities</p>
      </div>

      <div className="space-y-4">
        {crmData?.deals.map((deal) => (
          <DealItem
            key={deal.id}
            title={deal.title}
            company={deal.company}
            value={deal.value}
            stage={deal.stage}
            probability={deal.probability}
            closeDate={deal.closeDate}
            owner={deal.owner}
          />
        ))}
      </div>
    </>
  );

  const renderTasks = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Tasks</h1>
        <p className="text-muted-foreground">Manage your daily tasks</p>
      </div>

      <div className="space-y-4">
        {crmData?.tasks.map((task) => (
          <TaskItem
            key={task.id}
            title={task.title}
            dueDate={task.dueDate}
            onMarkDone={() => handleMarkTaskDone(task.id)}
          />
        ))}
      </div>
    </>
  );

  const renderChat = () => {
    
    return (
      <>
        {/* Full-Screen Chat Mode - No CRM Sidebar/Header */}
        <div className={`fixed inset-0 bg-white z-50`}>
          {/* Chat Header */}
          <div className={`h-16 bg-white border-b flex items-center justify-between px-6`}>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentView("overview")}
                className={`hover:bg-gray-100`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                <h1 className={`text-xl font-bold text-gray-900`}>Team Chat</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" className={`hover:bg-gray-100`}>
                <Search className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className={`hover:bg-gray-100`}>
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Full-Screen Chat Layout */}
          <div className="flex h-[calc(100vh-64px)]">
            {/* Left Navigation Sidebar - Dark Blue */}
            <div className="w-20 bg-blue-900 flex flex-col items-center py-6 space-y-6">
              {/* Navigation Icons - All Functional */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentView("overview")}
                className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <Home className="w-6 h-6 text-white" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="w-12 h-12 bg-blue-700 rounded-xl transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentView("activities")}
                className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <Star className="w-6 h-6 text-white" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentView("leads")}
                className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <Grid3X3 className="w-6 h-6 text-white" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentView("deals")}
                className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors relative"
              >
                <BarChart3 className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentView("settings")}
                className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <Settings className="w-6 h-6 text-white" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <RefreshCw className="w-6 h-6 text-white" />
              </Button>
              
              {/* Profile Icon at Bottom */}
              <div className="mt-auto">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-12 h-12 bg-blue-800 hover:bg-blue-700 rounded-full transition-colors"
                >
                  <User className="w-6 h-6 text-white" />
                </Button>
              </div>
            </div>

            {/* Middle Panel - Chat List & Search */}
            <div className={`w-80 bg-gray-50 border-gray-200 border-r flex flex-col`}>
              {/* Search Bar */}
              <div className={`p-4 border-b bg-white border-gray-200`}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 text-gray-900 placeholder-gray-500`}
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {mockUsers.filter(user => user.id !== "user1").map((user, index) => (
                  <div
                    key={user.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedUser === user.id 
                        ? 'bg-blue-100 border-r-2 border-blue-500'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedUser(user.id);
                      setChatMode("private");
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium truncate text-gray-900`}>
                            {user.name}
                          </h3>
                          <span className={`text-xs text-gray-500`}>
                            01.01.22
                          </span>
                        </div>
                        <p className={`text-sm truncate mt-1 text-gray-600`}>
                          Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {selectedUser === user.id && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                        {!user.isOnline && (
                          <div className={`w-2 h-2 rounded-full bg-gray-400`}></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Chat Window */}
            <div className={`flex-1 bg-white flex flex-col`}>
              {/* Chat Header */}
              <div className={`p-4 border-b bg-white border-gray-200 flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={mockUsers.find(u => u.id === selectedUser)?.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {selectedUser ? mockUsers.find(u => u.id === selectedUser)?.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className={`font-semibold text-gray-900`}>
                      {selectedUser ? mockUsers.find(u => u.id === selectedUser)?.name : 'Select a user'}
                    </h2>
                    <p className={`text-sm text-gray-500`}>
                      {selectedUser && mockUsers.find(u => u.id === selectedUser)?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className={`hover:bg-gray-100`}>
                    <Search className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className={`hover:bg-gray-100`}>
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50`}>
                {!selectedUser ? (
                  <div className={`text-center py-20 text-gray-500`}>
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                    <p className="text-sm">Choose a user from the left to start chatting</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className={`text-center py-20 text-gray-500`}>
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-sm">Start the conversation by sending a message</p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const sender = mockUsers.find(u => u.id === message.sender);
                    const isOwnMessage = message.sender === "user1";
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-2xl ${
                            isOwnMessage 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-200'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className={`flex items-center space-x-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs text-gray-500`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {isOwnMessage && (
                              <CheckCircle className="w-3 h-3 text-blue-500" />
                            )}
                          </div>
                        </div>
                        {!isOwnMessage && (
                          <Avatar className="w-8 h-8 ml-2 order-2">
                            <AvatarFallback className="text-xs">
                              {sender?.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Typing Indicator */}
                {isTyping && typingUser && typingUser !== "user1" && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md order-1">
                      <div className={`p-3 rounded-2xl bg-white border border-gray-200`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                    <Avatar className="w-8 h-8 ml-2 order-2">
                      <AvatarFallback className="text-xs">
                        {mockUsers.find(u => u.id === typingUser)?.name?.charAt(0).toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className={`p-4 border-t bg-white border-gray-200`}>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className={`hover:bg-gray-100`}>
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="icon" className={`hover:bg-gray-100`}>
                    <Smile className="w-5 h-5 text-gray-500" />
                  </Button>
                  <input
                    type="text"
                    placeholder="Message...."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-200 text-gray-900 placeholder-gray-500`}
                    disabled={!selectedUser}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!newMessage.trim() || !selectedUser}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderActivities = () => (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Activity Scoring & Leaderboard</h1>
        <p className="text-muted-foreground">Track team performance and engagement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your Score Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Your Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {userScores.find(u => u.id === "user1")?.score || 0}
            </div>
            <Badge className={`text-sm ${getLevelColor(userScores.find(u => u.id === "user1")?.level || "Beginner")}`}>
              {getLevelIcon(userScores.find(u => u.id === "user1")?.level || "Beginner")}
              {userScores.find(u => u.id === "user1")?.level || "Beginner"}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Rank #{userScores.find(u => u.id === "user1")?.rank || 0} of {userScores.length}
            </p>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Messages Sent</span>
                <span className="text-sm text-muted-foreground">+25 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tasks Completed</span>
                <span className="text-sm text-muted-foreground">+50 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deals Closed</span>
                <span className="text-sm text-muted-foreground">+100 points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Daily Login</span>
                <span className="text-sm text-muted-foreground">+10 points</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Team Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userScores.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0 ? 'bg-yellow-50 border border-yellow-200' : 
                    index === 1 ? 'bg-gray-50 border border-gray-200' : 
                    index === 2 ? 'bg-orange-50 border border-orange-200' : 
                    'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-500 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getLevelColor(user.level)}>
                      {getLevelIcon(user.level)}
                      {user.level}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold text-lg">{user.score}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderSettings = () => {
    
    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                    S
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground">Sales Manager</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Photo
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue="Sarah Johnson" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue="sarah.johnson@company.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input defaultValue="Sales Manager" className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bell className="w-5 h-5 mr-2 text-green-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chat Alerts</p>
                    <p className="text-sm text-muted-foreground">New message notifications</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Key className="w-4 h-4 mr-2" />
                  API Keys
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-600" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Light mode
                     </p>
                   </div>
                   <Select value="light" onValueChange={() => {}}>
                     <SelectTrigger className="w-32">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="light">
                         <div className="flex items-center space-x-2">
                           <span>🌞</span>
                           <span>Light</span>
                         </div>
                       </SelectItem>
                       <SelectItem value="dark">
                         <div className="flex items-center space-x-2">
                           <span>🌙</span>
                           <span>Dark</span>
                         </div>
                       </SelectItem>
                       <SelectItem value="system">
                         <div className="flex items-center space-x-2">
                           <span>🌓</span>
                           <span>System</span>
                         </div>
                       </SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-medium">Language</p>
                     <p className="text-sm text-muted-foreground">English (US)</p>
                   </div>
                   <Button variant="outline" size="sm">Change</Button>
                 </div>
                 
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="font-medium">Time Zone</p>
                     <p className="text-sm text-muted-foreground">UTC-5 (Eastern Time)</p>
                   </div>
                   <Button variant="outline" size="sm">Change</Button>
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return renderOverview();
      case "leads":
        return renderLeads();
      case "deals":
        return renderDeals();
      case "tasks":
        return renderTasks();
      case "chat":
        return renderChat();
      case "activities":
        return renderActivities();
      case "settings":
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-destructive">Error loading CRM data</h1>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <CRMSidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="flex-1">
        <TopBar />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
