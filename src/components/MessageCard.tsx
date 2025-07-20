'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Clock, Trash2, AlertTriangle } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
          `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
            axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const timeAgo = dayjs(message.createdAt).format('MMM D, YYYY h:mm A');
  const isRecent = dayjs().diff(dayjs(message.createdAt), 'hours') < 24;

  return (
      <Card className="glass-effect border-0 card-hover group relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-60"></div>

        {/* Recent indicator */}
        {isRecent && (
            <div className="absolute top-3 right-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-3">
            <CardTitle className="text-base leading-relaxed text-foreground/90 line-clamp-3 flex-1">
              {message.content}
            </CardTitle>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive shrink-0"
                    disabled={isDeleting}
                >
                  {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                  ) : (
                      <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glass-effect border-0">
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-xl">Delete Message</AlertDialogTitle>
                  </div>
                  <AlertDialogDescription className="text-base leading-relaxed">
                    Are you sure you want to delete this message? This action cannot be undone and the message will be permanently removed from your dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel className="hover:bg-muted/50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                      onClick={handleDeleteConfirm}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Delete Message
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <time dateTime={message.createdAt.toString()}>
              {timeAgo}
            </time>
            {isRecent && (
                <>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <span className="text-green-500 font-medium">Recent</span>
                </>
            )}
          </div>
        </CardContent>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </Card>
  );
}