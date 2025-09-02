import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const { page, action, userId, metadata } = await request.json();

        // Validate required fields
        if (!page) {
            return NextResponse.json(
                { error: 'Page is required' },
                { status: 400 }
            );
        }

        // Insert analytics event into Supabase
        const { data, error } = await supabase
            .from('analytics_events')
            .insert([
                {
                    page,
                    action: action || 'view',
                    user_id: userId || null,
                    metadata: metadata || {},
                    ip_address: request.headers.get('x-forwarded-for') ||
                        request.headers.get('x-real-ip') ||
                        'unknown',
                    user_agent: request.headers.get('user-agent') || 'unknown'
                }
            ])
            .select();

            if (error) {
      console.error('Analytics error:', error);
      
      // If table doesn't exist, return success anyway (don't break user experience)
      const errorMessage = error.message || error.details || JSON.stringify(error);
      if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        console.log('Analytics table not found, skipping tracking');
        return NextResponse.json({ success: true, message: 'Event tracked (table not found)' });
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to track event',
          details: errorMessage
        },
        { status: 500 }
      );
    }

        return NextResponse.json(
            {
                success: true,
                message: 'Event tracked successfully',
                data
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page');
        const limit = parseInt(searchParams.get('limit') || '100');

        let query = supabase
            .from('analytics_events')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (page) {
            query = query.eq('page', page);
        }

        const { data, error } = await query;

            if (error) {
      console.error('Analytics fetch error:', error);
      const errorMessage = error.message || error.details || JSON.stringify(error);
      return NextResponse.json(
        { 
          error: 'Failed to fetch analytics',
          details: errorMessage
        },
        { status: 500 }
      );
    }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 