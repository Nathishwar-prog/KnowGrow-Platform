"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { 
  Users, 
  Plus, 
  MessageCircle, 
  Search, 
  User, 
  Calendar,
  Hash,
  Globe,
  Lock
} from "lucide-react";

const StudyGroups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("discover"); // discover, myGroups, create

  // Mock study groups data
  const studyGroups = [
    {
      id: 1,
      name: "JavaScript Mastery",
      members: 24,
      topic: "Web Development",
      description: "Learn modern JavaScript frameworks and libraries",
      isPublic: true,
      lastActive: "2 hours ago",
      memberAvatars: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
      ]
    },
    {
      id: 2,
      name: "Data Science Enthusiasts",
      members: 18,
      topic: "Data Science",
      description: "Discuss machine learning, AI, and data analysis",
      isPublic: true,
      lastActive: "5 hours ago",
      memberAvatars: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom"
      ]
    },
    {
      id: 3,
      name: "Python Beginners",
      members: 32,
      topic: "Programming",
      description: "Learn Python from scratch with hands-on projects",
      isPublic: false,
      lastActive: "1 day ago",
      memberAvatars: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa"
      ]
    }
  ];

  const myGroups = studyGroups.slice(0, 2);

  const filteredGroups = studyGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

    return (
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-foreground">Study Groups</h2>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeTab === "discover" ? "default" : "outline"}
              onClick={() => setActiveTab("discover")}
              className="text-xs sm:text-sm"
            >
              Discover
            </Button>
            <Button 
              variant={activeTab === "myGroups" ? "default" : "outline"}
              onClick={() => setActiveTab("myGroups")}
              className="text-xs sm:text-sm"
            >
              My Groups
            </Button>
            <Button 
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              className="text-xs sm:text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>
  
        {activeTab === "discover" && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border/50"
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center text-foreground">
                          {group.name}
                          {!group.isPublic && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{group.topic}</p>
                      </div>
                      <div className="flex -space-x-2">
                        {group.memberAvatars.map((avatar, index) => (
                          <img
                            key={index}
                            src={avatar}
                            alt="Member"
                            className="w-8 h-8 rounded-full border-2 border-card"
                          />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                          <span className="text-[10px] font-bold text-muted-foreground">+{group.members - 3}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{group.description}</p>
                    <div className="flex justify-between items-center py-3 border-y border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-3.5 w-3.5" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        <span>{group.lastActive}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
  
        {activeTab === "myGroups" && (
          <div>
            {myGroups.length === 0 ? (
              <Card className="text-center py-12 border-dashed bg-card/50">
                <CardContent>
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No study groups yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Join or create a study group to connect with other learners
                  </p>
                  <Button onClick={() => setActiveTab("discover")}>
                    Discover Groups
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myGroups.map((group) => (
                  <Card key={group.id} className="bg-card border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center text-foreground">
                            {group.name}
                            {!group.isPublic && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{group.topic}</p>
                        </div>
                        <div className="flex -space-x-2">
                          {group.memberAvatars.map((avatar, index) => (
                            <img
                              key={index}
                              src={avatar}
                              alt="Member"
                              className="w-8 h-8 rounded-full border-2 border-card"
                            />
                          ))}
                          <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                            <span className="text-[10px] font-bold text-muted-foreground">+{group.members - 3}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{group.description}</p>
                      <div className="flex justify-between items-center py-3 border-y border-border/50">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Users className="mr-1 h-3.5 w-3.5" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          <span>{group.lastActive}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Open Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
  
        {activeTab === "create" && (
          <Card className="bg-card border-border/50 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-foreground">Create a New Study Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Group Name</label>
                  <Input placeholder="Enter group name" className="bg-background border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Topic</label>
                  <Input placeholder="Enter topic or subject" className="bg-background border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <Input placeholder="Describe your study group" className="bg-background border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Privacy</label>
                  <div className="flex space-x-4 mt-2">
                    <div className="flex items-center">
                      <input type="radio" id="public" name="privacy" className="mr-2 accent-primary" defaultChecked />
                      <label htmlFor="public" className="flex items-center text-sm text-foreground">
                        <Globe className="mr-1 h-4 w-4 text-muted-foreground" />
                        Public
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" id="private" name="privacy" className="mr-2 accent-primary" />
                      <label htmlFor="private" className="flex items-center text-sm text-foreground">
                        <Lock className="mr-1 h-4 w-4 text-muted-foreground" />
                        Private
                      </label>
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
};

export default StudyGroups;