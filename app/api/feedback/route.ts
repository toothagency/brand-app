import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Use service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const { name, email, feedback } = await request.json();

        // Validate required fields
        if (!feedback || !feedback.trim()) {
            return NextResponse.json(
                { error: 'Feedback is required' },
                { status: 400 }
            );
        }

        // Insert feedback into Supabase
        const { data, error } = await supabase
            .from('feedback')
            .insert([
                {
                    name: name?.trim() || null,
                    email: email?.trim() || null,
                    feedback: feedback.trim()
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);

            // Check if table doesn't exist - safely check error message
            const errorMessage = error.message || error.details || JSON.stringify(error);
            if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
                return NextResponse.json(
                    {
                        error: 'Feedback table not found',
                        details: 'Please create the feedback table in your Supabase project using the provided SQL.',
                        sql: `
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts
CREATE POLICY "Allow public inserts" ON feedback
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (optional, for admin purposes)
CREATE POLICY "Allow public reads" ON feedback
  FOR SELECT USING (true);
            `
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                {
                    error: 'Failed to save feedback',
                    details: errorMessage
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Feedback submitted successfully',
                data
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Optional: Get all feedback (for admin purposes)
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            const errorMessage = error.message || error.details || JSON.stringify(error);
            return NextResponse.json(
                {
                    error: 'Failed to fetch feedback',
                    details: errorMessage
                },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 