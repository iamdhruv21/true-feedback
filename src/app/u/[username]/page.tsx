'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, User, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {toast} from "sonner"
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to sent message');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      // console.error('Error fetching messages:', error);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 p-4 md:p-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Anonymous Feedback</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Send Message
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your thoughts anonymously with <span className="font-semibold text-foreground">@{username}</span>
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Message Form */}
            <Card className="glass-effect border-0 shadow-xl animate-in slide-in-from-bottom duration-700 delay-200">
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                              <FormLabel className="text-lg font-semibold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Your Anonymous Message
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                    placeholder="Write your anonymous message here... Be kind, honest, and constructive."
                                    className="resize-none min-h-[120px] border-2 border-muted focus:border-primary/50 transition-all duration-300 text-base bg-background/50 backdrop-blur"
                                    {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center pt-4">
                      {isLoading ? (
                          <Button disabled size="lg" className="px-8 py-3 text-base font-semibold">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </Button>
                      ) : (
                          <Button
                              type="submit"
                              disabled={isLoading || !messageContent}
                              size="lg"
                              className="px-8 py-3 text-base font-semibold gradient-primary hover:scale-105 transition-all duration-300 glow-effect"
                          >
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Suggested Messages */}
            <Card className="glass-effect border-0 shadow-xl animate-in slide-in-from-bottom duration-700 delay-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Message Suggestions</h3>
                      <p className="text-sm text-muted-foreground">Click on any message to use it as a starting point</p>
                    </div>
                  </div>
                  <Button
                      onClick={fetchSuggestedMessages}
                      variant="outline"
                      disabled={isSuggestLoading}
                      className="border-primary/30 hover:bg-primary/10 hover:text-primary/90 transition-all duration-300"
                  >
                    {isSuggestLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {isSuggestLoading ? "Generating..." : "Generate New"}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {error ? (
                    <div className="text-center py-8">
                      <p className="text-destructive font-medium">Failed to load suggestions</p>
                      <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                      {parseStringMessages(completion).map((message, index) => (
                          <Button
                              key={index}
                              variant="ghost"
                              className="p-4 h-auto text-left justify-start bg-gradient-to-r from-muted/50 to-background hover:from-primary/10 hover:to-accent/10 border border-border/50 hover:border-primary/30 transition-all duration-300 card-hover group"
                              onClick={() => handleMessageClick(message)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex-1 text-sm leading-relaxed">{message}</div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                            </div>
                          </Button>
                      ))}
                    </div>
                )}
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="text-center space-y-6 animate-in fade-in duration-700 delay-500">
              <Separator className="my-8 bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 border border-primary/20">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Want Your Own Message Board?
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Create your account and start receiving anonymous feedback from your friends, colleagues, and community.
                  </p>
                  <Link href="/sign-up" className="inline-block">
                    <Button
                        size="lg"
                        className="px-8 py-3 text-base font-semibold gradient-primary hover:scale-105 transition-all duration-300 glow-effect"
                    >
                      Create Your Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}