import { useState, useMemo } from 'react'
import {
  Trophy,
  Award,
  Flame,
  Users,
  Sliders,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  Filter,
  CheckCircle2,
  ThumbsUp,
  BarChart2,
  Atom,
  Cpu,
  Wrench,
  Palette,
  Binary
} from 'lucide-react'

interface TeamProject {
  id: string
  title: string
  lead: string
  institution: string
  track: 'AI & Research' | 'Simulasi & Fisika' | 'Geospasial & Iklim' | '3D & Komputasi' | 'Smart IoT'
  description: string
  science: number // 0 - 100
  technology: number
  engineering: number
  art: number
  math: number
  votes: number
  reviewsCount: number
  badge: string
}

const INITIAL_PROJECTS: TeamProject[] = [
  {
    id: 'proj-1',
    title: 'PaperCraft AI — Multi-Agent Academic Synthesis',
    lead: 'Muhammad Naza Firmansyah',
    institution: 'Universitas PGRI Adi Buana Surabaya',
    track: 'AI & Research',
    description: 'Arsitektur agen ganda sintesis literatur otomatis dengan verifikasi sitasi DOI murni dan anti-halusinasi.',
    science: 96,
    technology: 94,
    engineering: 92,
    art: 88,
    math: 90,
    votes: 342,
    reviewsCount: 48,
    badge: '🏆 Grand Champion Nominee'
  },
  {
    id: 'proj-2',
    title: 'SteamGeo Intelligence — Spatial GWR & Early-Warning',
    lead: 'Muhammad Naza Firmansyah',
    institution: 'Civitas Sains Data Jatim',
    track: 'Geospasial & Iklim',
    description: 'Pemodelan Geographically Weighted Regression dan autokorelasi spasial Moran I untuk mitigasi epidemiologi DBD 38 Kab/Kota.',
    science: 95,
    technology: 92,
    engineering: 90,
    art: 91,
    math: 98,
    votes: 289,
    reviewsCount: 39,
    badge: '🌟 Best Mathematical Model'
  },
  {
    id: 'proj-3',
    title: 'SteamSim Lab — Interactive WebGL Physics Engine',
    lead: 'Muhammad Naza Firmansyah',
    institution: 'Laboratorium Komputasi Sains',
    track: 'Simulasi & Fisika',
    description: 'Simulasi diferensial balistik Runge-Kutta orde-4, pendulum ganda chaotik, dan titrasi kinetika kimia secara real-time.',
    science: 94,
    technology: 96,
    engineering: 93,
    art: 89,
    math: 95,
    votes: 265,
    reviewsCount: 34,
    badge: '⚡ High Performance Engine'
  },
  {
    id: 'proj-4',
    title: 'MakerCraft 3D — Mathematical Geometry Studio',
    lead: 'Muhammad Naza Firmansyah',
    institution: 'Studio Desain Parametrik',
    track: '3D & Komputasi',
    description: 'Studio parametrik WebGL Three.js untuk surface Möbius strip, spherical harmonics, dan generator file .OBJ client-side.',
    science: 89,
    technology: 95,
    engineering: 91,
    art: 97,
    math: 93,
    votes: 238,
    reviewsCount: 31,
    badge: '🎨 Best Visual & Aesthetic'
  },
  {
    id: 'proj-5',
    title: 'AgriSense — Edge-AI Sensor Jaringan Tanah Presisi',
    lead: 'Budi Santoso & Tim Agrotek',
    institution: 'Institut Pertanian Tropika',
    track: 'Smart IoT',
    description: 'Jaringan LoRaWAN sensor NPK dan kelembaban tanah dengan inferensi model regresi TinyML pada mikrokontroler ESP32.',
    science: 88,
    technology: 89,
    engineering: 94,
    art: 76,
    math: 82,
    votes: 184,
    reviewsCount: 22,
    badge: '🌱 Field Innovation'
  },
  {
    id: 'proj-6',
    title: 'BioSpectra — Deteksi Spektrofotometri Daun Kopi',
    lead: 'Anisa Rahmawati & Tim Rekopi',
    institution: 'Fakultas Bioteknologi Pertanian',
    track: 'AI & Research',
    description: 'Klasifikasi tingkat kematangan ceri kopi dan defisiensi nitrogen daun menggunakan computer vision MobileNet-V3.',
    science: 91,
    technology: 88,
    engineering: 86,
    art: 82,
    math: 85,
    votes: 167,
    reviewsCount: 19,
    badge: '🔬 Agricultural Biotech'
  }
]

export default function App() {
  const [projects, setProjects] = useState<TeamProject[]>(INITIAL_PROJECTS)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1')
  const [filterTrack, setFilterTrack] = useState<string>('All')
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({})

  // Review Form State
  const [userScience, setUserScience] = useState<number>(90)
  const [userTech, setUserTech] = useState<number>(90)
  const [userEng, setUserEng] = useState<number>(90)
  const [userArt, setUserArt] = useState<number>(90)
  const [userMath, setUserMath] = useState<number>(90)
  const [reviewComment, setReviewComment] = useState<string>('')
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false)

  // Current selected project
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0]
  }, [projects, selectedProjectId])

  // Filtered & Sorted Projects by STEAM composite score
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => filterTrack === 'All' || p.track === filterTrack)
      .map((p) => ({
        ...p,
        steamScore: Math.round((p.science + p.technology + p.engineering + p.art + p.math) / 5)
      }))
      .sort((a, b) => b.steamScore - a.steamScore)
  }, [projects, filterTrack])

  // Calculate Radar Polygon Points (Center at 150, 150; Radius 110)
  const radarPoints = useMemo(() => {
    const center = 150
    const maxR = 110
    const angles = [-90, -18, 54, 126, 198] // 5 vertices in degrees
    const metrics = [
      currentProject.science / 100,
      currentProject.technology / 100,
      currentProject.engineering / 100,
      currentProject.art / 100,
      currentProject.math / 100,
    ]

    const points = angles.map((deg, i) => {
      const rad = (deg * Math.PI) / 180
      const r = metrics[i] * maxR
      const x = center + r * Math.cos(rad)
      const y = center + r * Math.sin(rad)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })

    return points.join(' ')
  }, [currentProject])

  // Handle Vote
  const handleVote = (id: string) => {
    if (hasVoted[id]) return
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p))
    )
    setHasVoted((prev) => ({ ...prev, [id]: true }))
  }

  // Handle Submit Peer Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === selectedProjectId) {
          const newScience = Math.round((p.science * p.reviewsCount + userScience) / (p.reviewsCount + 1))
          const newTech = Math.round((p.technology * p.reviewsCount + userTech) / (p.reviewsCount + 1))
          const newEng = Math.round((p.engineering * p.reviewsCount + userEng) / (p.reviewsCount + 1))
          const newArt = Math.round((p.art * p.reviewsCount + userArt) / (p.reviewsCount + 1))
          const newMath = Math.round((p.math * p.reviewsCount + userMath) / (p.reviewsCount + 1))
          return {
            ...p,
            science: newScience,
            technology: newTech,
            engineering: newEng,
            art: newArt,
            math: newMath,
            reviewsCount: p.reviewsCount + 1
          }
        }
        return p
      })
    )
    setReviewSubmitted(true)
    setTimeout(() => setReviewSubmitted(false), 3500)
    setReviewComment('')
  }

  const currentSteamAvg = Math.round(
    (currentProject.science +
      currentProject.technology +
      currentProject.engineering +
      currentProject.art +
      currentProject.math) /
      5
  )

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-[#111d2d] flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-xl shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  SteamArena
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 font-semibold rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600 fill-amber-400" />
                  Season 2026 Live
                </span>
              </div>
              <p className="text-xs text-slate-500">Competitive STEAM Innovation & Peer-Review Arena</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://steamcraft.online"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 hover:text-slate-200 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800 border border-slate-800"
            >
              <span>Ecosystem Hub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>1,217 Total Evaluasi Dinilai</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-slate-100/60 border-b border-slate-200 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>National STEAM Innovation Hackathon</span>
              <Sparkles className="w-5 h-5 text-amber-600" />
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Arena evaluasi berbasis rubrik 5 dimensi interaktif: <strong>Science</strong>, <strong>Technology</strong>, <strong>Engineering</strong>, <strong>Art & Design</strong>, dan <strong>Mathematics</strong> dengan algoritma pembobotan peer-review terverifikasi.
            </p>
          </div>

          {/* Filter Tracks */}
          <div className="flex items-center gap-2 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {(['All', 'AI & Research', 'Simulasi & Fisika', 'Geospasial & Iklim', '3D & Komputasi', 'Smart IoT'] as const).map((track) => (
              <button
                key={track}
                onClick={() => setFilterTrack(track)}
                className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  filterTrack === track
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leaderboard & Project Cards */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Leaderboard Proyek Unggulan ({filteredProjects.length})</span>
            </h2>
            <span className="text-xs text-slate-500">Urut berdasarkan Skor Komposit STEAM</span>
          </div>

          <div className="space-y-3">
            {filteredProjects.map((p, index) => {
              const isSelected = p.id === selectedProjectId
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                          index === 0
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                            : index === 1
                            ? 'bg-slate-300 text-slate-950'
                            : index === 2
                            ? 'bg-amber-700 text-slate-100'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm font-bold">{p.title}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.lead} • <span className="text-slate-500">{p.institution}</span>
                        </p>
                      </div>
                    </div>

                    {/* Composite STEAM Score */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-amber-600">{p.steamScore}</div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">STEAM Score</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{p.description}</p>

                  {/* 5-Metrics mini bar */}
                  <div className="grid grid-cols-5 gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                    <div className="text-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <div className="text-slate-700 text-[10px] font-semibold">Sci</div>
                      <div className="font-bold text-sky-700 font-mono font-bold">{p.science}</div>
                    </div>
                    <div className="text-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <div className="text-slate-700 text-[10px] font-semibold">Tech</div>
                      <div className="font-bold text-teal-700 font-mono font-bold">{p.technology}</div>
                    </div>
                    <div className="text-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <div className="text-slate-700 text-[10px] font-semibold">Eng</div>
                      <div className="font-bold text-amber-800 font-mono font-bold">{p.engineering}</div>
                    </div>
                    <div className="text-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <div className="text-slate-700 text-[10px] font-semibold">Art</div>
                      <div className="font-bold text-rose-700 font-mono font-bold">{p.art}</div>
                    </div>
                    <div className="text-center bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <div className="text-slate-700 text-[10px] font-semibold">Math</div>
                      <div className="font-bold text-indigo-700 font-mono font-bold">{p.math}</div>
                    </div>
                  </div>

                  {/* Vote and review counts */}
                  <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleVote(p.id)
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          hasVoted[p.id]
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{p.votes} Upvotes</span>
                      </button>

                      <div className="flex items-center gap-1 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span>{p.reviewsCount} Penilai</span>
                      </div>
                    </div>

                    <span className="text-[11px] text-amber-600/80 flex items-center gap-0.5">
                      <span>Buka Radar Metrik</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Right Column: Dynamic STEAM Radar Chart & Peer Review Panel */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          {/* Radar Chart Display */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 flex flex-col items-center shadow-xs">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-amber-600" />
                  <span>STEAM 5-Axis Radar Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">{currentProject.title}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-600">{currentSteamAvg}</span>
                <span className="text-xs text-slate-500">/100</span>
              </div>
            </div>

            {/* SVG Pentagonal Radar Chart */}
            <div className="w-full max-w-[320px] aspect-square relative my-2">
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
                {/* Background concentric reference webs (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                  const r = 110 * scale
                  const center = 150
                  const angles = [-90, -18, 54, 126, 198]
                  const pts = angles
                    .map((deg) => {
                      const rad = (deg * Math.PI) / 180
                      return `${(center + r * Math.cos(rad)).toFixed(1)},${(center + r * Math.sin(rad)).toFixed(1)}`
                    })
                    .join(' ')
                  return (
                    <polygon
                      key={sIdx}
                      points={pts}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                      strokeDasharray={scale === 1.0 ? 'none' : '2,2'}
                    />
                  )
                })}

                {/* Axis lines from center to outer vertices */}
                {[-90, -18, 54, 126, 198].map((deg, aIdx) => {
                  const rad = (deg * Math.PI) / 180
                  const x = 150 + 110 * Math.cos(rad)
                  const y = 150 + 110 * Math.sin(rad)
                  return <line key={aIdx} x1="150" y1="150" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="0.8" />
                })}

                {/* Filled Radar Polygon of Selected Project */}
                <polygon
                  points={radarPoints}
                  fill="rgba(245, 158, 11, 0.18)"
                  stroke="#ea580c"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Vertices points */}
                {[-90, -18, 54, 126, 198].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180
                  const metrics = [
                    currentProject.science / 100,
                    currentProject.technology / 100,
                    currentProject.engineering / 100,
                    currentProject.art / 100,
                    currentProject.math / 100,
                  ]
                  const r = metrics[i] * 110
                  const cx = 150 + r * Math.cos(rad)
                  const cy = 150 + r * Math.sin(rad)
                  return <circle key={i} cx={cx} cy={cy} r="4" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />
                })}

                {/* Axis Labels */}
                <text x="150" y="24" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="800">
                  SCIENCE ({currentProject.science})
                </text>
                <text x="272" y="115" textAnchor="start" fill="#0f766e" fontSize="11" fontWeight="800">
                  TECH ({currentProject.technology})
                </text>
                <text x="235" y="260" textAnchor="middle" fill="#b45309" fontSize="11" fontWeight="800">
                  ENG ({currentProject.engineering})
                </text>
                <text x="65" y="260" textAnchor="middle" fill="#be123c" fontSize="11" fontWeight="800">
                  ART ({currentProject.art})
                </text>
                <text x="28" y="115" textAnchor="end" fill="#4338ca" fontSize="11" fontWeight="800">
                  MATH ({currentProject.math})
                </text>
              </svg>
            </div>

            {/* Radar Legend Breakdown */}
            <div className="w-full grid grid-cols-2 gap-2 text-xs text-slate-700 mt-2">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <Atom className="w-3.5 h-3.5 text-sky-700" />
                <span>Science: <strong>{currentProject.science}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <Cpu className="w-3.5 h-3.5 text-teal-700" />
                <span>Technology: <strong>{currentProject.technology}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                <span>Engineering: <strong>{currentProject.engineering}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <Palette className="w-3.5 h-3.5 text-rose-700" />
                <span>Art & UX: <strong>{currentProject.art}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                <Binary className="w-3.5 h-3.5 text-indigo-700" />
                <span>Mathematics: <strong>{currentProject.math}%</strong> (Rigor & Formulasi)</span>
              </div>
            </div>
          </div>

          {/* Gamified Peer Review Submission */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Beri Nilai Peer-Review</h3>
              </div>
              <span className="text-[11px] text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Rubrik Juri Resmi
              </span>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              {/* Science Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">1. Ketajaman Ilmiah (Science):</span>
                  <span className="font-bold text-sky-700 font-mono font-bold">{userScience}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userScience}
                  onChange={(e) => setUserScience(Number(e.target.value))}
                  className="w-full accent-sky-400 bg-slate-200 cursor-pointer"
                />
              </div>

              {/* Technology Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">2. Inovasi Perangkat Lunak (Tech):</span>
                  <span className="font-bold text-teal-700 font-mono font-bold">{userTech}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userTech}
                  onChange={(e) => setUserTech(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-200 cursor-pointer"
                />
              </div>

              {/* Engineering Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">3. Keandalan Rekayasa (Eng):</span>
                  <span className="font-bold text-amber-800 font-mono font-bold">{userEng}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userEng}
                  onChange={(e) => setUserEng(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-200 cursor-pointer"
                />
              </div>

              {/* Art Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">4. Desain & Ergonomi UX (Art):</span>
                  <span className="font-bold text-rose-700 font-mono font-bold">{userArt}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userArt}
                  onChange={(e) => setUserArt(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-slate-200 cursor-pointer"
                />
              </div>

              {/* Math Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">5. Kerapian Matematis (Math):</span>
                  <span className="font-bold text-indigo-700 font-mono font-bold">{userMath}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={userMath}
                  onChange={(e) => setUserMath(Number(e.target.value))}
                  className="w-full accent-indigo-400 bg-slate-200 cursor-pointer"
                />
              </div>

              {/* Catatan Reviewer */}
              <div>
                <label className="text-xs text-slate-500 block mb-1">Ulasan Evaluator (Opsional):</label>
                <textarea
                  rows={2}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Catatan kekuatan metodologi, arsitektur, atau saran pengembangan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-xs hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Kirimkan Skor Peer-Review</span>
              </button>

              {reviewSubmitted && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Skor Anda berhasil dihitung ke dalam bobot agregat radar!</span>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/50 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>© 2026 SteamArena</span>
            <span>•</span>
            <span>Ecosystem of <a href="https://steamcraft.online" className="text-amber-600 hover:underline">STEAM-Craft</a></span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Lead Architect:{' '}
              <a
                href="https://portofolionaza.steamcraft.online"
                target="_blank"
                rel="noreferrer"
                className="text-slate-200 font-semibold hover:text-amber-600 transition-colors"
              >
                Muhammad Naza Firmansyah
              </a>
            </span>
            <a
              href="https://github.com/nazaa-arch/steam-arena"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 hover:underline flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
