import { useState } from 'react'
import { Crop, ImagePlus, LoaderCircle, Music2, Plus, Trash2, Upload } from 'lucide-react'
import type { EventData, GalleryItem, ImageEdit } from '../../types'
import { adminApi } from '../../lib/api'
import { defaultImageEdit, imageStyle } from '../../lib/imageEdit'
import { ImageEditorModal } from '../../components/ImageEditorModal'

type EditTarget = { kind: 'hero'; url: string; edit: ImageEdit } | { kind: 'gallery'; item: GalleryItem }

export function MediaManager({ event, onChange }: { event: EventData; onChange: (e: EventData) => void }) {
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)

  const upload = async (file: File) => {
    setUploading(true)
    setNotice('')
    try { return await adminApi.uploadMedia(file) }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Upload gagal.'); throw error }
    finally { setUploading(false) }
  }

  const removeStored = async (url: string) => {
    if (!url.startsWith('/uploads/')) return
    try { await adminApi.deleteMedia(url) } catch { /* state remains source of truth */ }
  }

  const addGallery = async (files: FileList | null) => {
    if (!files?.length) return
    const next: GalleryItem[] = []
    setUploading(true)
    setNotice('')
    try {
      for (const file of Array.from(files)) {
        const uploaded = await adminApi.uploadMedia(file)
        next.push({ id: crypto.randomUUID(), url: uploaded.url, caption: file.name.replace(/\.[^.]+$/, ''), edit: { ...defaultImageEdit, aspect: 'square' } })
      }
      onChange({ ...event, gallery: [...event.gallery, ...next] })
      setNotice(`${next.length} foto berhasil diupload.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Upload galeri gagal.')
    } finally { setUploading(false) }
  }

  const setHero = async (file?: File) => {
    if (!file) return
    const old = event.heroImage
    try {
      const uploaded = await upload(file)
      onChange({ ...event, heroImage: uploaded.url, heroEdit: { ...defaultImageEdit } })
      await removeStored(old)
      setNotice('Foto cover diperbarui. Klik Edit Crop untuk mengatur framing.')
    } catch { /* notice handled */ }
  }

  const setMusic = async (file?: File) => {
    if (!file) return
    const old = event.musicUrl
    try {
      const uploaded = await upload(file)
      onChange({ ...event, musicUrl: uploaded.url })
      await removeStored(old)
      setNotice('Background music diperbarui.')
    } catch { /* notice handled */ }
  }

  const deleteHero = async () => { const old = event.heroImage; onChange({ ...event, heroImage: '' }); await removeStored(old) }
  const deleteMusic = async () => { const old = event.musicUrl; onChange({ ...event, musicUrl: '' }); await removeStored(old) }
  const deleteGallery = async (item: GalleryItem) => { onChange({ ...event, gallery: event.gallery.filter(x => x.id !== item.id) }); await removeStored(item.url) }

  const applyEdit = (edit: ImageEdit) => {
    if (!editTarget) return
    if (editTarget.kind === 'hero') onChange({ ...event, heroEdit: edit })
    else onChange({ ...event, gallery: event.gallery.map(item => item.id === editTarget.item.id ? { ...item, edit } : item) })
    setEditTarget(null)
    setNotice('Pengaturan crop dan edit foto tersimpan.')
  }

  return <section>
    <div className="page-heading"><div><span className="eyebrow">Media Library</span><h1>Foto & Musik</h1><p>Upload media lalu atur crop, posisi, zoom, rotasi, brightness, contrast, dan saturation langsung dari dashboard.</p></div>{uploading && <span className="saving-indicator"><LoaderCircle size={15} className="spin"/> Uploading...</span>}</div>
    {notice && <div className="notice-bar">{notice}</div>}
    <div className="media-grid">
      <article className="panel media-card">
        <div className="panel-title"><div><span className="eyebrow">Cover</span><h3>Foto utama</h3></div><ImagePlus size={20}/></div>
        <div className="hero-thumb edited-media-frame">{event.heroImage && <img src={event.heroImage} alt="Cover" style={imageStyle(event.heroEdit)}/>}</div>
        <div className="media-actions"><label className={`upload-btn ${uploading ? 'disabled' : ''}`}><Upload size={16}/> Ganti Foto<input type="file" accept="image/*" hidden disabled={uploading} onChange={e=>setHero(e.target.files?.[0])}/></label>{event.heroImage && <button className="secondary-btn compact" onClick={() => setEditTarget({ kind:'hero', url:event.heroImage, edit:event.heroEdit })}><Crop size={15}/> Edit Crop</button>}{event.heroImage && <button className="danger-link inline" onClick={deleteHero}><Trash2 size={15}/> Hapus</button>}</div>
      </article>
      <article className="panel media-card">
        <div className="panel-title"><div><span className="eyebrow">Audio</span><h3>Background music</h3></div><Music2 size={20}/></div>
        <p className="muted">Upload audio sampai 20 MB atau isi URL lagu. Musik diputar setelah tamu menekan “Buka Undangan”.</p>
        <label>Atau URL audio<input value={event.musicUrl.startsWith('/uploads/') ? '' : event.musicUrl} placeholder="https://.../lagu.mp3" onChange={e=>onChange({...event,musicUrl:e.target.value})}/></label>
        <label className={`upload-btn ${uploading ? 'disabled' : ''}`}><Upload size={16}/> Upload Lagu<input type="file" accept="audio/*" hidden disabled={uploading} onChange={e=>setMusic(e.target.files?.[0])}/></label>
        {event.musicUrl && <button className="danger-link" onClick={deleteMusic}><Trash2 size={15}/> Hapus musik</button>}
      </article>
    </div>
    <article className="panel gallery-manager">
      <div className="panel-title"><div><span className="eyebrow">Gallery</span><h3>Galeri foto</h3></div><label className={`primary-btn compact ${uploading ? 'disabled' : ''}`}><Plus size={16}/> Tambah Foto<input type="file" accept="image/*" multiple hidden disabled={uploading} onChange={e=>addGallery(e.target.files)}/></label></div>
      {event.gallery.length === 0 ? <div className="empty-state"><ImagePlus size={30}/><strong>Galeri masih kosong</strong><span>Klik Tambah Foto untuk mulai.</span></div> :
      <div className="gallery-admin-grid">{event.gallery.map((item, index) => <div className="gallery-admin-item" key={item.id}><div className="gallery-edit-thumb edited-media-frame"><img src={item.url} alt={item.caption} style={imageStyle(item.edit)}/></div><div><input value={item.caption} onChange={e=>onChange({...event,gallery:event.gallery.map(x=>x.id===item.id?{...x,caption:e.target.value}:x)})}/><button title="Edit crop" onClick={() => setEditTarget({ kind:'gallery', item })}><Crop size={15}/></button><button title="Hapus" onClick={()=>deleteGallery(item)}><Trash2 size={15}/></button></div><span>#{String(index+1).padStart(2,'0')}</span></div>)}</div>}
    </article>
    {editTarget && <ImageEditorModal open url={editTarget.kind === 'hero' ? editTarget.url : editTarget.item.url} value={editTarget.kind === 'hero' ? editTarget.edit : editTarget.item.edit} title={editTarget.kind === 'hero' ? 'Edit Foto Cover' : `Edit ${editTarget.item.caption || 'Foto Galeri'}`} onClose={() => setEditTarget(null)} onSave={applyEdit}/>} 
  </section>
}
