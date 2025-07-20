'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {toast} from "sonner"
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { Shield, Mail, ArrowRight, Sparkles, AlertCircle, Eye, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  // Fetch verification code when component mounts
  useEffect(() => {
    const fetchVerificationCode = async () => {
      if (!params.username) return;

      setIsLoadingCode(true);
      try {
        const response = await axios.get(`/api/get-verification-code/${params.username}`);
        if (response.data.success) {
          setVerificationCode(response.data.code);
        }
      } catch (error) {
        // console.error('Failed to fetch verification code:', error);
        toast.error('Failed to load verification code');
      } finally {
        setIsLoadingCode(false);
      }
    };

    fetchVerificationCode();
  }, [params.username]);

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success(response.data.message);
      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (verificationCode) {
      try {
        await navigator.clipboard.writeText(verificationCode);
        toast.success('Code copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy code');
      }
    }
  };

  const autoFillCode = () => {
    if (verificationCode) {
      form.setValue('code', verificationCode);
      toast.success('Code auto-filled!');
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative">
          {/* Main card with glass effect */}
          <div className="glass-effect rounded-2xl p-8 card-hover relative">
            {/* Decorative top border */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 gradient-primary rounded-full"></div>

            <div className="text-center mb-8">
              {/* Icon with animation */}
              <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6 glow-effect animate-bounce">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Title with gradient */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                Verify Your Account
              </h1>

              {/* Subtitle with icon */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <p className="text-sm">Enter the verification code sent to your email</p>
              </div>

              {/* Username display */}
              <div className="mt-4 px-4 py-2 bg-muted/50 rounded-lg inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">@{params.username}</span>
              </div>
            </div>

            {/* Verification Code Display Section */}
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Email Service Temporarily Unavailable
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Your verification code is displayed below:
                </p>

                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border">
                  <div className="flex-1">
                    {isLoadingCode ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-sm text-muted-foreground">Loading code...</span>
                        </div>
                    ) : verificationCode ? (
                        <code className="text-lg font-mono font-bold text-primary tracking-widest">
                          {verificationCode}
                        </code>
                    ) : (
                        <span className="text-sm text-muted-foreground">Code not available</span>
                    )}
                  </div>

                  {verificationCode && (
                      <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="h-8 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={autoFillCode}
                            className="h-8 px-2"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                  )}
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-medium">Verification Code</FormLabel>
                          <div className="relative">
                            <Input
                                {...field}
                                className="h-12 text-center text-lg font-mono tracking-widest bg-background/50 border-2 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                placeholder="Enter 6-digit code"
                                maxLength={6}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full h-12 gradient-primary hover:opacity-90 transition-all duration-200 font-medium relative overflow-hidden group"
                    disabled={isLoading}
                >
                  {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                  ) : (
                      <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                        Verify Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Footer info */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive the code?{' '}
                <button className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium">
                  Resend Code
                </button>
              </p>
            </div>
          </div>

          {/* Bottom decorative element */}
          <div className="mt-4 flex justify-center">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/30"></div>
              <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
  );
}