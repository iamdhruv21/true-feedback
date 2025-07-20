'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {toast} from "sonner"
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Link2, MessageSquare, Settings, User2, Eye, EyeOff, Share } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to fetch message settings');
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
      async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
          const response = await axios.get<ApiResponse>('/api/get-messages');
          setMessages(response.data.messages || []);
          if (refresh) {
            toast.info('Refreshed Messages');
          }
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages');
        } finally {
          setIsLoading(false);
          setIsSwitchLoading(false);
        }
      },
      [setIsLoading, setMessages]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to update message settings');
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile URL has been copied to clipboard.');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="glass-effect rounded-2xl p-6 card-hover">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center glow-effect">
                  <User2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-muted-foreground">Welcome back, @{username}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span>{messages.length} total messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${acceptMessages ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <span className="text-sm font-medium">
                  {acceptMessages ? 'Accepting Messages' : 'Messages Disabled'}
                </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-effect rounded-xl p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                  <p className="text-2xl font-bold text-primary">{messages.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary/60" />
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold text-accent">
                    {acceptMessages ? 'Active' : 'Inactive'}
                  </p>
                </div>
                {acceptMessages ? <Eye className="w-8 h-8 text-accent/60" /> : <EyeOff className="w-8 h-8 text-accent/60" />}
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold text-green-500">Live</p>
                </div>
                <Share className="w-8 h-8 text-green-500/60" />
              </div>
            </div>
          </div>

          {/* Share Profile Section */}
          <div className="glass-effect rounded-2xl p-6 mb-8 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Share Your Profile</h2>
                <p className="text-sm text-muted-foreground">Let others send you anonymous feedback</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="w-full h-12 px-4 pr-12 bg-background/50 border border-border/50 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <Button
                  onClick={copyToClipboard}
                  className="h-12 px-6 gradient-primary hover:opacity-90 transition-all duration-200"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="glass-effect rounded-2xl p-6 mb-8 card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Message Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    {acceptMessages ? 'Currently accepting new messages' : 'New messages are disabled'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="data-[state=checked]:bg-primary"
                />
                {isSwitchLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </div>
            </div>
          </div>

          <Separator className="my-6 bg-border/50" />

          {/* Messages Section */}
          <div className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Messages</h2>
              <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                  className="flex items-center gap-2 hover:bg-primary/10 hover:border-primary/50 hover:text-primary/70 transition-all duration-200"
                  disabled={isLoading}
              >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {messages.length > 0 ? (
                  messages.map((message, index) => (
                      <div
                          key={index+45}
                          className="animate-in fade-in-0 slide-in-from-bottom-4"
                          style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <MessageCard
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                      </div>
                  ))
              ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Share your profile link to start receiving anonymous feedback and messages from others.
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default UserDashboard;