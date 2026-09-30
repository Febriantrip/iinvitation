import './styles.css'
import './reference.css'
import React, { useState } from 'react'
import Header from './sections/Header'
import Hero from './sections/Hero'
import About from './sections/About'
import Catalog from './sections/Catalog'
import Packages from './sections/Packages'
import ClosingBanner from './sections/ClosingBanner'
import Footer from './sections/Footer'
import CatalogModal from './components/CatalogModal'
import ServiceExperienceModal from './components/ServiceExperienceModal'

export default function MarketingApp() {
  const [preview, setPreview] = useState(null)
  const [service, setService] = useState(null)
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)

  const openCatalog = () => {
    setShowAll(true)
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <div className="marketing-site ref-page">
    <Header search={search} onSearch={setSearch} onShowCatalog={openCatalog} />
    <main>
      <Hero onPreview={setPreview} />
      <About onOpen={setService} />
      <Catalog onPreview={setPreview} search={search} showAll={showAll} onShowAll={openCatalog} />
      <Packages />
      <ClosingBanner />
    </main>
    <Footer />
    <CatalogModal design={preview} onClose={() => setPreview(null)} />
    <ServiceExperienceModal service={service} onClose={() => setService(null)} />
  </div>
}
