'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

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
import axios, { AxiosError } from 'axios';
import { Loader2, CheckCircle, XCircle, Mail, User, Lock, ArrowLeft, Shield, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { Card, CardContent } from '@/components/ui/card';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounce = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
              `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
              axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success(response.data.message);

      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      // console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-primary relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">True Feedback</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Join the Future of
              <span className="block">Anonymous Feedback</span>
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-md">
              Connect with others through honest, anonymous conversations.
              Your identity stays secret, your impact stays real.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-white/80" />
                <span className="text-white/90">100% Anonymous & Secure</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-white/80" />
                <span className="text-white/90">Instant Feedback Sharing</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-white/80" />
                <span className="text-white/90">Growing Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-8">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
              <p className="text-muted-foreground">
                Start your anonymous feedback journey today
              </p>
            </div>

            {/* Form Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username Field */}
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Username</FormLabel>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    {...field}
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary"
                                    placeholder="Choose a unique username"
                                    onChange={(e) => {
                                      field.onChange(e);
                                      debounce(e.target.value);
                                    }}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  {isCheckingUsername && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                                  {!isCheckingUsername && usernameMessage && (
                                      <>
                                        {usernameMessage === 'Username is unique' ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                      </>
                                  )}
                                </div>
                              </div>
                              {!isCheckingUsername && usernameMessage && (
                                  <p className={`text-xs flex items-center gap-2 ${
                                      usernameMessage === 'Username is unique'
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                  }`}>
                                    {usernameMessage}
                                  </p>
                              )}
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    {...field}
                                    type="email"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary"
                                    placeholder="your.email@example.com"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Shield className="w-3 h-3" />
                                We&#39;ll send you a verification code
                              </p>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Password</FormLabel>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    {...field}
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary"
                                    placeholder="Create a strong password"
                                />
                              </div>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 font-medium text-base shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                          </div>
                      ) : (
                          'Create Account'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/sign-in" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:no-underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:no-underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
  );
}