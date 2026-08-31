import { NextRequest, NextResponse } from 'next/server'

function category(tags: Record<string,string> = {}) {
  if (tags.amenity === 'clinic' || tags.amenity === 'hospital' || tags.healthcare) return 'healthcare'
  if (tags.amenity === 'bank' || tags.amenity === 'bureau_de_change') return 'bank'
  if (tags.office === 'government' || tags.government || tags.amenity === 'townhall') return 'government'
  if (tags.amenity === 'school' || tags.amenity === 'college' || tags.amenity === 'university') return 'education'
  if (tags.amenity === 'post_office' || tags.office === 'immigration') return 'other'
  return 'other'
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2 || q.length > 120) return NextResponse.json({ places: [] }, { status: 400 })

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '8')
  url.searchParams.set('dedupe', '1')

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'QueueWise/1.0 (community queue information service)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 300 },
    })
    if (!response.ok) return NextResponse.json({ places: [] }, { status: 502 })
    const results = await response.json()
    const places = results.map((item: any) => {
      const a = item.address ?? {}
      return {
        id: `osm:${item.osm_type}:${item.osm_id}`,
        name: item.name || item.display_name?.split(',')[0] || 'Unnamed place',
        category: category(item.extratags ?? {}),
        address: item.display_name || '',
        city: a.city || a.town || a.village || a.municipality || '',
        country: a.country || '',
        latitude: Number(item.lat),
        longitude: Number(item.lon),
      }
    }).filter((p: any) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
    return NextResponse.json({ places })
  } catch {
    return NextResponse.json({ places: [] }, { status: 503 })
  }
}
