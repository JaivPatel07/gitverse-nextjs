'use client'

export const dynamic = 'force-dynamic'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, GitBranch, Loader2, CheckCircle2 } from 'lucide-react'
import { Button, Input, Card, CardHeader, CardContent, toast } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

export default function Signup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup } = useAuth()
  const repoUrl = searchParams?.get('repoUrl') || ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    if (!email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      })
      return
    }

    if (!agreedToTerms) {
      toast({
        title: 'Error',
        description: 'Please agree to the terms of service',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await signup(name, email, password)
      toast({
        title: 'Success!',
        description: 'Account created successfully. Welcome to GitVerse!',
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Signup Card */}
      <Card className="w-full max-w-md glass glow-primary relative z-10 animate-fade-in-up">
        <CardHeader className="text-center pb-4">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4 group">
            <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
              <GitBranch className="text-primary-foreground" size={24} />
            </div>
            <span className="text-2xl font-heading font-bold text-gradient">GitVerse</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start exploring repositories today</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {repoUrl && (
              <div className="p-3 rounded-lg glass border-accent/30">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-accent">Repository Ready</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1 break-all">
                      {repoUrl}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-start text-sm cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 mt-0.5 rounded border-input"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <span className="text-muted-foreground">
                I agree to the{' '}
                <Link
                  href="/terms"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
