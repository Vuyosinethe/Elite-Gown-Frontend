"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Copy, ExternalLink } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function DatabaseSetupGuide() {
  const [databaseReady, setDatabaseReady] = useState(false)
  const [checking, setChecking] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    try {
      // Try to query the profiles table
      const { error } = await supabase.from("profiles").select("id").limit(1)
      setDatabaseReady(!error)
    } catch (error) {
      setDatabaseReady(false)
    } finally {
      setChecking(false)
    }
  }

  const copySQL = async () => {
    const sql = `-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();`

    try {
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy SQL:", error)
    }
  }

  if (checking) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            <span className="text-yellow-800">Checking database setup...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (databaseReady) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Database is ready!</span>
          </div>
          <p className="text-green-700 text-sm mt-2">Your Supabase database is properly configured and ready to use.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>Database Setup Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-red-700 text-sm">
          Your Supabase database needs to be set up before authentication will work properly.
        </p>

        <div className="space-y-3">
          <h4 className="font-medium text-red-800">Steps to fix this:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-red-700">
            <li>Go to your Supabase dashboard</li>
            <li>Click on "SQL Editor" in the sidebar</li>
            <li>Click "New Query"</li>
            <li>Copy and paste the SQL script below</li>
            <li>Click "Run" to execute the script</li>
            <li>Refresh this page</li>
          </ol>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-red-800">SQL Script:</h4>
            <Button onClick={copySQL} variant="outline" size="sm" className="text-xs">
              <Copy className="h-3 w-3 mr-1" />
              {copied ? "Copied!" : "Copy SQL"}
            </Button>
          </div>
          <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto max-h-40">
            <pre>{`-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies...
-- (Click "Copy SQL" for the complete script)`}</pre>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Supabase Dashboard
          </Button>
          <Button onClick={checkDatabase} variant="outline">
            Check Again
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
