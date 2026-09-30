import type { LucideIcon } from 'lucide-react'

export function StatCard({ label, value, helper, icon: Icon }: { label: string; value: string | number; helper: string; icon: LucideIcon }) {
  return <div className="stat-card">
    <div className="stat-icon"><Icon size={19}/></div>
    <div><span>{label}</span><strong>{value}</strong><small>{helper}</small></div>
  </div>
}
