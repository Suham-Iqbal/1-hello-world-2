import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Smile, 
  MoreHorizontal,
  Search,
  Filter,
  Users,
  Settings,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  MonitorOff,
  Volume2,
  VolumeX,
  ThumbsUp,
  Laugh,
  Angry,
  Clock,
  UserPlus,
  Edit,
  Trash2,
  Star,
  StarOff,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { activityService } from "@/services/activityService";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'voice';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  isRead: boolean;
  reactions?: { emoji: string; users: string[] }[];
  isEdited?: boolean;
  isStarred?: boolean;
}

interface Chat {
  id: string;
  name: string;
  type: 'private' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
  isPinned?: boolean;
  isMuted?: boolean;
}

// Enhanced mock data
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'John Smith',
    type: 'private',
    participants: ['user1', 'user2'],
    lastMessage: {
      id: 'msg1',
      sender: { id: 'user2', name: 'John Smith', role: 'Customer' },
      content: 'Thanks for the update!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'text',
      isRead: false
    },
    unreadCount: 2,
    isOnline: true,
    isPinned: true
  },
  {
    id: '2',
    name: 'Project Alpha Team',
    type: 'group',
    participants: ['user1', 'user2', 'user3', 'user4'],
    lastMessage: {
      id: 'msg2',
      sender: { id: 'user3', name: 'Sarah Johnson', role: 'Manager' },
      content: 'Meeting at 3 PM today',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text',
      isRead: true
    },
    unreadCount: 0,
    isOnline: true,
    isPinned: false
  },
  {
    id: '3',
    name: 'Support Team',
    type: 'group',
    participants: ['user1', 'user5', 'user6'],
    lastMessage: {
      id: 'msg3',
      sender: { id: 'user5', name: 'Mike Wilson', role: 'Support' },
      content: 'Ticket #1234 has been resolved',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: 'text',
      isRead: true
    },
    unreadCount: 0,
    isOnline: false,
    isPinned: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: { id: 'user2', name: 'John Smith', role: 'Customer' },
    content: 'Hi there! I have a question about the project.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    type: 'text',
    isRead: true,
    reactions: [{ emoji: '👍', users: ['user1'] }]
  },
  {
    id: '2',
    sender: { id: 'user1', name: 'You', role: 'Agent' },
    content: 'Hello John! I\'d be happy to help. What\'s your question?',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    type: 'text',
    isRead: true,
    reactions: [{ emoji: '❤️', users: ['user2'] }]
  },
  {
    id: '3',
    sender: { id: 'user2', name: 'John Smith', role: 'Customer' },
    content: 'I was wondering about the timeline for the next phase.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'text',
    isRead: false
  }
];

const emojiReactions = ['👍', '❤️', '😊', '😢', '😠', '🎉', '🔥', '💯'];

export const ChatSystem = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: { id: 'user1', name: 'You', role: 'Agent' },
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(false);

    // Log activity: outgoing message
    activityService.log({
      type: 'message',
      title: 'Message sent',
      description: `Sent to ${selectedChat.name}: ${message.content}`,
      priority: 'low',
      status: 'completed',
      user: { id: 'user1', name: 'You', role: 'Agent' },
      metadata: { chatId: selectedChat.id }
    });

    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: message, unreadCount: 0 }
        : chat
    ));

    // Simulate typing indicator and reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: { 
          id: selectedChat.participants.find(p => p !== 'user1') || 'user2', 
          name: selectedChat.name, 
          role: 'Customer' 
        },
        content: getRandomReply(),
        timestamp: new Date(),
        type: 'text',
        isRead: true
      };
      setMessages(prev => [...prev, reply]);
      // Toast for incoming message
      toast({ title: `New message from ${selectedChat.name}`, description: reply.content });
      // Log activity: incoming message
      activityService.log({
        type: 'message',
        title: `New message from ${selectedChat.name}`,
        description: reply.content,
        priority: 'low',
        status: 'completed',
        user: { id: reply.sender.id, name: reply.sender.name, role: reply.sender.role },
        metadata: { chatId: selectedChat.id }
      });
      
      // Update chat's last message
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: reply }
          : chat
      ));
    }, 2000 + Math.random() * 3000);
  };

  const getRandomReply = () => {
    const replies = [
      'Thanks for your message! I\'ll get back to you soon.',
      'Got it! Let me check on that for you.',
      'Perfect, I\'ll look into this right away.',
      'Thanks for the update!',
      'I understand your concern. Let me help you with that.',
      'Great question! Here\'s what I found...',
      'I\'ll forward this to the right team member.',
      'Thanks for bringing this to my attention!'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: { id: 'user1', name: 'You', role: 'Agent' },
      content: `Sent: ${file.name}`,
      timestamp: new Date(),
      type: 'file',
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: message, unreadCount: 0 }
        : chat
    ));

    toast({
      title: "File Sent",
      description: `${file.name} has been sent successfully`,
    });
    if (selectedChat) {
      activityService.log({
        type: 'file',
        title: `File sent to ${selectedChat.name}`,
        description: file.name,
        priority: 'medium',
        status: 'completed',
        user: { id: 'user1', name: 'You', role: 'Agent' },
        metadata: { chatId: selectedChat.id, fileSize: file.size }
      });
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes('user1')) {
            // Remove reaction
            return {
              ...msg,
              reactions: msg.reactions?.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: r.users.filter(u => u !== 'user1') }
                  : r
              ).filter(r => r.users.length > 0)
            };
          } else {
            // Add user to reaction
            return {
              ...msg,
              reactions: msg.reactions?.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, 'user1'] }
                  : r
              )
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, users: ['user1'] }]
          };
        }
      }
      return msg;
    }));
  };

  const togglePinChat = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isPinned: !chat.isPinned }
        : chat
    ));
  };

  const toggleMuteChat = (chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, isMuted: !chat.isMuted }
        : chat
    ));
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    if (type === 'voice') {
      setIsVoiceCall(true);
      toast({
        title: "Voice Call Started",
        description: "Connecting to the call...",
      });
    } else {
      setIsVideoCall(true);
      toast({
        title: "Video Call Started",
        description: "Connecting to the call...",
      });
    }
    if (selectedChat) {
      activityService.log({
        type: 'call',
        title: `${type === 'voice' ? 'Voice' : 'Video'} call started`,
        description: `With ${selectedChat.name}`,
        priority: 'low',
        status: 'in-progress',
        user: { id: 'user1', name: 'You', role: 'Agent' },
        metadata: { chatId: selectedChat.id, callType: type }
      });
    }
  };

  const handleEndCall = () => {
    setIsVoiceCall(false);
    setIsVideoCall(false);
    setIsScreenSharing(false);
    toast({
      title: "Call Ended",
      description: "The call has been disconnected",
    });
    if (selectedChat) {
      activityService.log({
        type: 'call',
        title: 'Call ended',
        description: `With ${selectedChat.name}`,
        priority: 'low',
        status: 'completed',
        user: { id: 'user1', name: 'You', role: 'Agent' },
        metadata: { chatId: selectedChat.id }
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Unmuted" : "Muted",
      description: isMuted ? "Your microphone is now active" : "Your microphone is now muted",
    });
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast({
      title: isVideoOff ? "Video On" : "Video Off",
      description: isVideoOff ? "Your camera is now active" : "Your camera is now disabled",
    });
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen Share Stopped" : "Screen Share Started",
      description: isScreenSharing ? "Screen sharing has been stopped" : "You are now sharing your screen",
    });
  };

  const filteredChats = chats
    .filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Sort by pinned first, then by last message time
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.lastMessage?.timestamp.getTime() || 0) - (a.lastMessage?.timestamp.getTime() || 0);
    });

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(messageSearchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/activities'}
                className="text-blue-600 hover:text-blue-700"
              >
                <Activity className="w-4 h-4 mr-2" />
                Activities
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
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Chat List */}
        <TabsContent value="chats" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === chat.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>
                          {chat.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm truncate">{chat.name}</p>
                          {chat.isPinned && <Star className="w-3 h-3 text-yellow-500" />}
                          {chat.isMuted && <VolumeX className="w-3 h-3 text-gray-400" />}
                        </div>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage?.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage?.content}
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Actions */}
                  <div className="flex items-center justify-end space-x-1 mt-2 opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinChat(chat.id);
                      }}
                    >
                      {chat.isPinned ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMuteChat(chat.id);
                      }}
                    >
                      {chat.isMuted ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-2">Recent Activities</h3>
                <p className="text-sm text-gray-600">Chat and system activities</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New message from John Smith</p>
                    <p className="text-xs text-gray-600">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Johnson joined Project Alpha Team</p>
                    <p className="text-xs text-gray-600">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Voice call with Mike Wilson</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </div>

      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>
                      {selectedChat.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {selectedChat.type === 'group' ? `${selectedChat.participants.length} members` : 'Online'}
                      </span>
                      {selectedChat.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartCall('voice')}
                    disabled={isVoiceCall || isVideoCall}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartCall('video')}
                    disabled={isVoiceCall || isVideoCall}
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Message Search */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search in conversation..."
                  value={messageSearchTerm}
                  onChange={(e) => setMessageSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === 'user1' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${message.sender.id === 'user1' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.sender.id === 'user1' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-900'
                      }`}>
                        {message.type === 'file' ? (
                          <div className="space-y-2">
                            <p className="font-medium">{message.fileName}</p>
                            <p className="text-sm opacity-80">{message.fileSize}</p>
                            <Button variant="outline" size="sm" className="w-full">
                              Download File
                            </Button>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>
                      
                      {/* Message Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleReaction(message.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.users.length}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs text-gray-500 mt-1 flex items-center justify-between ${
                        message.sender.id === 'user1' ? 'text-right' : 'text-left'
                      }`}>
                        <span>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {message.isEdited && <span className="ml-1">(edited)</span>}
                        </span>
                        {message.sender.id === 'user1' && (
                          <span className="ml-2">
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                    {message.sender.id !== 'user1' && (
                      <Avatar className="w-8 h-8 ml-2 order-2">
                        <AvatarImage src={message.sender.avatar} />
                        <AvatarFallback>
                          {message.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-900 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (!isTyping && e.target.value.length > 0) {
                      setIsTyping(true);
                      setTimeout(() => setIsTyping(false), 3000);
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-8 gap-2">
                    {emojiReactions.map((emoji, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => {
                          setNewMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Call Interface */}
      {(isVoiceCall || isVideoCall) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader className="text-center">
              <CardTitle>
                {isVoiceCall ? 'Voice Call' : 'Video Call'} with {selectedChat?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isVoiceCall ? (
                    <Phone className="w-12 h-12 text-blue-600" />
                  ) : (
                    <Video className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Call in progress...</p>
              </div>
              
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                {isVideoCall && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleVideo}
                    >
                      {isVideoOff ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleScreenShare}
                    >
                      {isScreenSharing ? <MonitorOff className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndCall}
                >
                  End Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
