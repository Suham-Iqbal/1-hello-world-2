import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, User } from "lucide-react";

export const TopBar = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-background">
      {/* Left Section - Logo & Search */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">*</span>
          </div>
          <h1 className="text-xl font-bold">CRM Dashboard</h1>
        </div>
        
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Start searching here..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Right Section - Notifications, Date, Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
        
        {/* Current Date */}
        <div className="text-sm text-muted-foreground">
          {currentDate}
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/api/placeholder/40/40" />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              SJ
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium">Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">Sales Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};