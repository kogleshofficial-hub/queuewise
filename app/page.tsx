'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabase } from '@/lib/supabase'

type Location = {
  id: string
  name: string
  category: string
  address: string | null
  city: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  report_count: number
  estimated_wait_minutes: number | null
  last_reported_at: string | null
  confidence: string
}

type SearchPlace = { id: string; name: string; category: string; address: string; city: string; country: string; latitude: number; longitude: number }

const categories = ['all', 'healthcare', 'bank', 'government', 'education', 'immigration', 'other']
const labels: Record<string, string> = { healthcare: 'Healthcare', bank: 'Bank', government: 'Government', education: 'Education', immigration: 'Immigration', other: 'Other' }

function token() {
  const key = 'queuewise_reporter_token'
  let value = localStorage.getItem(key)
  if (!value) {
    value = crypto.randomUUID() + crypto.randomUUID()
    localStorage.setItem(key, value)
  }
  return value
}

function waitLabel(minutes: number | null) {
  if (minutes === null) return 'No recent data'
  if (minutes < 1) return '<1 min'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function freshness(iso: string | null) {
  if (!iso) return 'No reports yet'
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  return `${hours}h ago`
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([])
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [showReport, setShowReport] = useState<Location | SearchPlace | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchPlace[]>([])

  const supabase = useMemo(() => {
    try { return getSupabase() } catch { return null }
  }, [])

  async function loadNearby(latitude: number, longitude: number) {
    if (!supabase) { setMessage('Connect Supabase environment variables to load live data.'); return }
    setLoading(true)
    const { data, error } = await supabase.rpc('nearby_queue_locations', { p_lat: latitude, p_lng: longitude, p_radius_km: 25 })
    setLoading(false)
    if (error) { setMessage('Could not load nearby data. Please try again.'); return }
    setLocations((data ?? []) as Location[])
  }

  function useLocation() {
    setMessage('')
    if (!navigator.geolocation) { setMessage('Location is not available in this browser.'); return }
    navigator.geolocation.getCurrentPosition(
      (position) => { setLat(position.coords.latitude); setLng(position.coords.longitude); loadNearby(position.coords.latitude, position.coords.longitude) },
      () => setMessage('Location permission was not granted. You can still search for a real place below.')
    )
  }

  useEffect(() => { useLocation() }, [])

  async function searchPlaces() {
    if (query.trim().length < 2) return
    setLoading(true); setMessage('')
    try {
      const res = await fetch(`/api/search-places?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      setSearchResults((data.places ?? []) as SearchPlace[])
      if (!data.places?.length) setMessage('No matching places found. Try a fuller name or address.')
    } catch { setMessage('Place search is temporarily unavailable.') }
    finally { setLoading(false) }
  }

  async function addPlace(place: SearchPlace) {
    if (!supabase) return
    const { data, error } = await supabase.from('locations').upsert({
      external_id: place.id, name: place.name, category: place.category, address: place.address,
      city: place.city, country: place.country, latitude: place.latitude, longitude: place.longitude, source: 'openstreetmap'
    }, { onConflict: 'external_id' }).select().single()
    if (error) { setMessage('Could not save this place.'); return }
    setShowAdd(false); setSearchResults([]); setQuery('')
    setShowReport(data as Location)
  }

  const filtered = locations.filter((l) => category === 'all' || l.category === category)

  return (
    <main className="shell">
      <nav className="nav"><div className="brand">Queue<span>Wise</span></div><a className="nav-link" href="#how">How it works</a></nav>

      <section className="hero">
        <div>
          <span className="eyebrow">COMMUNITY-POWERED • REAL-TIME</span>
          <h1>Know the queue before you go.</h1>
          <p>See recent, community-reported waiting times at real-world services near you. No invented numbers. No official-looking guesses.</p>
          <div className="actions"><button className="btn btn-primary" onClick={useLocation}>Use my location</button><button className="btn btn-secondary" onClick={() => setShowAdd(true)}>Find a place</button></div>
          {message && <p className="muted" style={{fontSize:13, marginTop:15}}>{message}</p>}
        </div>
        <div className="hero-card"><small>LIVE DATA PRINCIPLE</small><div className="signal"><div><span className="dot" />Community reports</div><strong>24h</strong></div><p style={{fontSize:14,color:'#aaa',margin:0}}>Only reports from the last 24 hours contribute to a live estimate. Older observations fade out automatically.</p></div>
      </section>

      <section className="section" id="nearby">
        <div className="section-head"><div><h2>{lat !== null ? 'Nearby services' : 'Find a real place'}</h2><p className="muted">{loading ? 'Updating live data…' : 'Estimates are based on recent community reports.'}</p></div></div>
        <div className="search"><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchPlaces()} placeholder="Search a clinic, bank, government office…" /><button className="btn btn-primary" onClick={searchPlaces} disabled={loading}>Search</button></div>
        {searchResults.length > 0 && <div className="card" style={{marginBottom:18}}><strong>Real places found</strong>{searchResults.map(p => <div key={p.id} style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',padding:'14px 0',borderBottom:'1px solid #eee'}}><div><b>{p.name}</b><div className="meta">{p.address}</div></div><button className="btn btn-secondary" onClick={() => addPlace(p)}>View / report</button></div>)}</div>}
        <div className="filters">{categories.map(c => <button key={c} className={`filter ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c === 'all' ? 'All' : labels[c]}</button>)}</div>
        <div className="grid" style={{marginTop:14}}>
          {filtered.map(l => <article className="card" key={l.id}><div className="card-top"><div className="category">{labels[l.category] ?? l.category}</div><div className="status">{l.estimated_wait_minutes === null ? '—' : l.estimated_wait_minutes <= 20 ? 'QUIET' : l.estimated_wait_minutes <= 60 ? 'BUSY' : 'VERY BUSY'}</div></div><div className="wait">{waitLabel(l.estimated_wait_minutes)} <span>estimated</span></div><div className="meta">{l.name}<br />{l.address || l.city || l.country || 'Location details available'}</div><div className="meta" style={{marginTop:12}}>{l.report_count ? `${l.report_count} recent report${l.report_count === 1 ? '' : 's'} • ${freshness(l.last_reported_at)}` : 'No recent reports yet'}</div><button className="btn btn-primary" style={{width:'100%',marginTop:15}} onClick={() => setShowReport(l)}>Report current queue</button></article>)}
        </div>
        {!filtered.length && !loading && <div className="empty"><strong>No live queue data here yet.</strong><br />That means we don't have recent community reports — it does not mean the place is empty.<div style={{marginTop:16}}><button className="btn btn-primary" onClick={() => setShowAdd(true)}>Add a real place</button></div></div>}
      </section>

      <section className="section" id="how" style={{paddingTop:0}}><div className="card"><h2 style={{marginTop:0}}>How QueueWise stays honest</h2><div className="grid" style={{marginTop:20}}><div><b>1. Real places</b><p className="meta">Places come from OpenStreetMap search or are added from a user's real-world discovery.</p></div><div><b>2. Fresh observations</b><p className="meta">Reports are timestamped and only recent reports influence live estimates.</p></div><div><b>3. Transparent confidence</b><p className="meta">More recent reports increase confidence. No reports means no made-up estimate.</p></div></div></div></section>

      {showReport && <ReportModal place={showReport} supabase={supabase} reporterToken={token()} onClose={() => setShowReport(null)} onDone={() => { setShowReport(null); if (lat !== null && lng !== null) loadNearby(lat,lng) }} />}
      {showAdd && <AddModal query={query} setQuery={setQuery} results={searchResults} loading={loading} onSearch={searchPlaces} onSelect={addPlace} onClose={() => setShowAdd(false)} />}
      <footer className="footer"><div className="footer-inner"><span>QueueWise • Built for useful, trustworthy public information.</span><span>Community estimates are not official service information.</span></div></footer>
    </main>
  )
}

function ReportModal({ place, supabase, reporterToken, onClose, onDone }: { place: Location | SearchPlace; supabase: ReturnType<typeof getSupabase> | null; reporterToken: string; onClose: () => void; onDone: () => void }) {
  const [wait, setWait] = useState('30'); const [crowd, setCrowd] = useState('normal'); const [people, setPeople] = useState(''); const [note, setNote] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  async function submit() {
    if (!supabase) { setError('Supabase is not connected.'); return }
    setBusy(true); setError('')
    const { data: allowed, error: checkError } = await supabase.rpc('can_submit_report', { p_reporter_token: reporterToken })
    if (checkError || allowed !== true) { setBusy(false); setError('Please wait a few minutes before submitting another report from this browser.'); return }
    const { error: insertError } = await supabase.from('queue_reports').insert({ location_id: place.id, wait_minutes: Number(wait), crowd_level: crowd, people_ahead: people ? Number(people) : null, note: note.trim() || null, reporter_token: reporterToken })
    setBusy(false)
    if (insertError) { setError(insertError.message.includes('REPORT_RATE_LIMIT') ? 'Please wait a few minutes before another report.' : 'We could not submit this report. Please try again.'); return }
    onDone()
  }
  return <div className="modal-backdrop"><div className="modal"><button className="close" onClick={onClose}>×</button><h3>Report the queue</h3><p className="muted">{place.name}</p><div className="notice">Only report what you are actually seeing right now. Your report is community data, not an official statement from the service.</div><div className="form-row"><label>How long have you waited?</label><input type="number" min="0" max="720" value={wait} onChange={e=>setWait(e.target.value)} /></div><div className="form-row"><label>How busy is it?</label><select value={crowd} onChange={e=>setCrowd(e.target.value)}><option value="quiet">Quiet</option><option value="normal">Normal</option><option value="busy">Busy</option><option value="very_busy">Very busy</option></select></div><div className="form-row"><label>Approx. people ahead (optional)</label><input type="number" min="0" max="1000" value={people} onChange={e=>setPeople(e.target.value)} /></div><div className="form-row"><label>Short note (optional)</label><textarea maxLength={500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Anything useful for someone deciding whether to come now?" /></div>{error && <p style={{color:'#b42318',fontSize:13}}>{error}</p>}<button className="btn btn-primary" style={{width:'100%'}} onClick={submit} disabled={busy}>{busy ? 'Submitting…' : 'Submit real-time report'}</button></div></div>
}

function AddModal({ query, setQuery, results, loading, onSearch, onSelect, onClose }: { query:string; setQuery:(v:string)=>void; results:SearchPlace[]; loading:boolean; onSearch:()=>void; onSelect:(p:SearchPlace)=>void; onClose:()=>void }) {
  return <div className="modal-backdrop"><div className="modal"><button className="close" onClick={onClose}>×</button><h3>Find a real place</h3><p className="muted">Search the OpenStreetMap database for a clinic, bank, government office, school or other service.</p><div className="search"><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onSearch()} placeholder="e.g. Klinik Kesihatan…" /><button className="btn btn-primary" onClick={onSearch} disabled={loading}>Search</button></div>{results.map(p=><button key={p.id} onClick={()=>onSelect(p)} style={{display:'block',width:'100%',textAlign:'left',border:0,borderBottom:'1px solid #eee',background:'#fff',padding:'14px 0'}}><b>{p.name}</b><div className="meta">{p.address}</div></button>)}</div></div>
}
