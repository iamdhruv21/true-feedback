'use client';

import { Button } from '@/components/ui/button';
import { Mail, Shield, Users, MessageSquare, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
      <>
        {/* Hero Section */}
        <main className="flex-grow">
          {/* Hero Banner */}
          <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

            <div className="relative container mx-auto px-4 py-20 md:py-32">
              <div className="text-center max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-pulse">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">100% Anonymous & Secure</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight mb-6">
                  Dive into the World of
                  <span className="block gradient-primary bg-clip-text text-transparent">
                  Anonymous Feedback
                </span>
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  True Feedback - Where your identity remains a secret. Share honest thoughts,
                  receive genuine insights, and grow without judgment.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Get Started Today
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" className="hover:bg-muted/50 transition-all duration-300">
                    Learn More
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-sm text-muted-foreground">Anonymous Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-accent mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">Privacy Protected</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose True Feedback?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience the power of honest communication without fear of judgment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all duration-300">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Complete Privacy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your identity is never revealed. Share and receive feedback with complete anonymity.
                  </p>
                </div>

                <div className="group text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-all duration-300">
                    <MessageSquare className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Honest Insights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Get genuine feedback that helps you grow personally and professionally.
                  </p>
                </div>

                <div className="group text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-all duration-300">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Safe Community</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Join a supportive community focused on constructive and meaningful feedback.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Real feedback from real people who&apos;ve transformed their lives through honest communication
                </p>
              </div>

              {/* Enhanced Carousel */}
              <Carousel
                  plugins={[Autoplay({ delay: 4000 })]}
                  className="w-full max-w-4xl mx-auto"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {messages.map((message, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/2">
                        <Card className="h-full card-hover border-0 shadow-lg bg-gradient-to-br from-card to-muted/30 hover:shadow-xl transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight">
                              {message.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <p className="text-muted-foreground leading-relaxed">
                                {`"${message.content}"`}
                              </p>
                              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <p className="text-xs text-muted-foreground">
                                  {message.received}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-8">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <div className="container mx-auto px-4 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Start Your Feedback Journey?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Join thousands of users who are already benefiting from honest, anonymous feedback.
                  Your growth story starts here.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Create Your Account
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="lg" className="hover:bg-muted/50 transition-all duration-300">
                    View Demo
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-card border-t border-border/50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4">True Feedback</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Empowering honest communication through anonymous feedback.
                  Build better relationships and grow together.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Privacy Policy</Button>
                  <Button variant="outline" size="sm">Terms of Service</Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Anonymous Messaging</li>
                  <li>Secure Platform</li>
                  <li>User Dashboard</li>
                  <li>Feedback Analytics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Community</li>
                  <li>Documentation</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2024 True Feedback. All rights reserved. Made with ❤️ for honest communication.
              </p>
            </div>
          </div>
        </footer>
      </>
  );
}