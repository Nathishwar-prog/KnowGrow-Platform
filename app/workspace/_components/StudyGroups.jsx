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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Study Groups</h2>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "discover" ? "default" : "outline"}
            onClick={() => setActiveTab("discover")}
          >
            Discover
          </Button>
          <Button 
            variant={activeTab === "myGroups" ? "default" : "outline"}
            onClick={() => setActiveTab("myGroups")}
          >
            My Groups
          </Button>
          <Button 
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create
          </Button>
        </div>
      </div>

      {activeTab === "discover" && (
        <div>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search study groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {group.name}
                        {!group.isPublic && <Lock className="ml-2 h-4 w-4 text-gray-500" />}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{group.topic}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {group.memberAvatars.map((avatar, index) => (
                        <img
                          key={index}
                          src={avatar}
                          alt="Member"
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                        <span className="text-xs text-gray-500">+{group.members - 3}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{group.lastActive}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
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
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No study groups yet</h3>
                <p className="text-gray-500 mb-4">
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
                <Card key={group.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {group.name}
                          {!group.isPublic && <Lock className="ml-2 h-4 w-4 text-gray-500" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500">{group.topic}</p>
                      </div>
                      <div className="flex -space-x-2">
                        {group.memberAvatars.map((avatar, index) => (
                          <img
                            key={index}
                            src={avatar}
                            alt="Member"
                            className="w-8 h-8 rounded-full border-2 border-white"
                          />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                          <span className="text-xs text-gray-500">+{group.members - 3}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{group.lastActive}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
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
        <Card>
          <CardHeader>
            <CardTitle>Create a New Study Group</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Group Name</label>
                <Input placeholder="Enter group name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Topic</label>
                <Input placeholder="Enter topic or subject" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input placeholder="Describe your study group" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Privacy</label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input type="radio" id="public" name="privacy" className="mr-2" defaultChecked />
                    <label htmlFor="public" className="flex items-center">
                      <Globe className="mr-1 h-4 w-4" />
                      Public
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="private" name="privacy" className="mr-2" />
                    <label htmlFor="private" className="flex items-center">
                      <Lock className="mr-1 h-4 w-4" />
                      Private
                    </label>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">
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