import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://admin-api.zatiq.tech/api/v1/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const promo_id = searchParams.get('promo_id');

  if (!from || !to) {
    return NextResponse.json(
      { error: 'from and to parameters are required' },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    from,
    to,
  });
  
  if (promo_id) {
    params.append('promo_id', promo_id);
  }

  try {
    const response = await fetch(`${BASE_URL}/commission/special?${params}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if promo_id was provided but no data returned
    if (promo_id && promo_id.trim() !== '') {
      // If we have a promo_id but no data, it's likely invalid
      if (!data.data || data.data.length === 0) {
        return NextResponse.json(
          { error: 'PROMO_NOT_FOUND' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching commission data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commission data' },
      { status: 500 }
    );
  }
}
