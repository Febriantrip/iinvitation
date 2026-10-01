import React from 'react'

export default function Brand({ light = false }) {
  const base = import.meta.env.BASE_URL
  return (
    <a className={`brand brand-image-link ${light ? 'brand-light' : ''}`} href="#top" aria-label="Iinvitation home">
      <img className="brand-logo-image" src={light ? `${base}brand/iinvitation-logo-light.png?v=rose-20260919` : `${base}brand/iinvitation-logo.png?v=rose-20260919`} alt="Iinvitation" />
    </a>
  )
}
