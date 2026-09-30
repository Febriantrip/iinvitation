import React from 'react'

export default function InvitationMock({design, compact=false}){
  return <div className={`invite-mock invite-${design.layout} tone-${design.tone} ${compact ? 'compact':''}`}>
    <div className="mock-ornament">✦</div>
    <div className="mock-photo"><span>I & D</span></div>
    <div className="mock-copy">
      <small>{design.series}</small>
      <strong>Alya & Raka</strong>
      <span>12 · 12 · 2026</span>
    </div>
    <div className="mock-detail"><span></span><span></span><span></span></div>
  </div>
}
