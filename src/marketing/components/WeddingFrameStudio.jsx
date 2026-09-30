import React, { useEffect, useRef, useState } from 'react'

const W = 1080, H = 1920
const framePresets = [
  { id:'heritage', name:'Heritage', note:'Classic ornamental' },
  { id:'botanical', name:'Botanical', note:'Soft garden frame' },
  { id:'editorial', name:'Editorial', note:'Modern clean type' },
]

function drawCover(ctx, img, zoom, pan) {
  const base = Math.max(W / img.width, H / img.height)
  const scale = base * zoom
  const dw = img.width * scale, dh = img.height * scale
  const x = (W - dw) / 2 + pan.x, y = (H - dh) / 2 + pan.y
  ctx.drawImage(img, x, y, dw, dh)
}

function ornament(ctx, x, y, s=1) {
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s); ctx.strokeStyle='rgba(246,232,198,.92)'; ctx.lineWidth=3
  ctx.beginPath(); ctx.arc(0,0,34,0,Math.PI*2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(-70,0); ctx.quadraticCurveTo(-35,-42,0,0); ctx.quadraticCurveTo(35,42,70,0); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(0,-70); ctx.quadraticCurveTo(42,-35,0,0); ctx.quadraticCurveTo(-42,35,0,70); ctx.stroke(); ctx.restore()
}

export default function WeddingFrameStudio(){
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const dragRef = useRef(null)
  const [imageUrl,setImageUrl]=useState('')
  const [preset,setPreset]=useState('heritage')
  const [zoom,setZoom]=useState(1)
  const [pan,setPan]=useState({x:0,y:0})
  const [shade,setShade]=useState(22)
  const [names,setNames]=useState('Alya & Raka')
  const [date,setDate]=useState('12 · 12 · 2026')

  useEffect(()=>{
    const canvas=canvasRef.current, ctx=canvas?.getContext('2d'); if(!ctx) return
    ctx.clearRect(0,0,W,H)
    const bg=ctx.createLinearGradient(0,0,W,H); bg.addColorStop(0,'#b7a58c'); bg.addColorStop(1,'#50685c'); ctx.fillStyle=bg; ctx.fillRect(0,0,W,H)
    const img=imageRef.current
    if(img?.complete && img.naturalWidth) drawCover(ctx,img,zoom,pan)
    ctx.fillStyle=`rgba(13,37,29,${shade/100})`; ctx.fillRect(0,0,W,H)
    ctx.textAlign='center'

    if(preset==='heritage'){
      ctx.strokeStyle='rgba(246,232,198,.9)'; ctx.lineWidth=4; ctx.strokeRect(42,42,W-84,H-84); ctx.strokeRect(60,60,W-120,H-120)
      ornament(ctx,W/2,190,1.05); ornament(ctx,W/2,H-190,.8)
      ctx.fillStyle='#f6e8c6'; ctx.font='36px Georgia'; ctx.fillText('THE WEDDING OF',W/2,390)
      ctx.font='italic 96px Georgia'; ctx.fillText(names,W/2,505)
      ctx.font='34px Arial'; ctx.fillText(date,W/2,570)
    } else if(preset==='botanical'){
      ctx.strokeStyle='rgba(242,238,220,.88)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(W/2,270,420,Math.PI,0); ctx.stroke(); ctx.strokeRect(78,270,W-156,H-355)
      ctx.fillStyle='#f5efdf'; ctx.font='28px Arial'; ctx.fillText('CELEBRATING LOVE',W/2,380)
      ctx.font='italic 104px Georgia'; ctx.fillText(names,W/2,505)
      ctx.font='32px Arial'; ctx.fillText(date,W/2,565)
      ;[[120,150],[960,160],[135,1740],[945,1750]].forEach(([x,y],i)=>{ctx.save();ctx.translate(x,y);ctx.rotate((i%2?1:-1)*.5);ctx.strokeStyle='#e6dec2';ctx.lineWidth=8;for(let j=0;j<4;j++){ctx.beginPath();ctx.ellipse(j*15,j*38,18,55,.45,0,Math.PI*2);ctx.stroke()}ctx.restore()})
    } else {
      ctx.fillStyle='rgba(250,248,242,.92)'; ctx.fillRect(70,70,W-140,260); ctx.fillRect(70,H-270,W-140,200)
      ctx.fillStyle='#173b30'; ctx.textAlign='left'; ctx.font='28px Arial'; ctx.fillText('IINVITATION / WEDDING FRAME',110,130)
      ctx.font='78px Georgia'; ctx.fillText(names,110,240)
      ctx.font='30px Arial'; ctx.fillText(date,110,H-165); ctx.textAlign='right'; ctx.fillText('CELEBRATE · CAPTURE · SHARE',W-110,H-165)
    }
  },[imageUrl,preset,zoom,pan,shade,names,date])

  const loadFile=e=>{
    const file=e.target.files?.[0]; if(!file) return
    const url=URL.createObjectURL(file); const img=new Image(); img.onload=()=>{imageRef.current=img;setPan({x:0,y:0});setZoom(1);setImageUrl(url)}; img.src=url
  }
  const point=e=>{const r=canvasRef.current.getBoundingClientRect();const p=e.touches?.[0]||e;return{x:(p.clientX-r.left)*(W/r.width),y:(p.clientY-r.top)*(H/r.height)}}
  const start=e=>{if(!imageRef.current)return;const p=point(e);dragRef.current={p,pan};e.currentTarget.setPointerCapture?.(e.pointerId)}
  const move=e=>{if(!dragRef.current)return;const p=point(e);setPan({x:dragRef.current.pan.x+p.x-dragRef.current.p.x,y:dragRef.current.pan.y+p.y-dragRef.current.p.y})}
  const end=()=>{dragRef.current=null}
  const download=()=>{const a=document.createElement('a');a.download=`iinvitation-frame-${preset}.png`;a.href=canvasRef.current.toDataURL('image/png',1);a.click()}
  const reset=()=>{setZoom(1);setPan({x:0,y:0});setShade(22)}

  return <div className="frame-studio">
    <section className="frame-editor-panel">
      <div className="frame-panel-head"><small>IINVITATION FRAME STUDIO</small><h3>Create your wedding frame.</h3><p>Upload foto, geser langsung pada canvas, lalu export PNG.</p></div>
      <label className="frame-upload"><input type="file" accept="image/*" onChange={loadFile}/><span>{imageUrl?'Ganti foto':'Upload foto'}</span><small>JPG / PNG / WEBP</small></label>
      <div className="frame-field"><label>Nama pasangan</label><input value={names} onChange={e=>setNames(e.target.value)}/></div>
      <div className="frame-field"><label>Tanggal</label><input value={date} onChange={e=>setDate(e.target.value)}/></div>
      <div className="frame-field"><label>Frame style</label><div className="frame-presets">{framePresets.map(p=><button key={p.id} className={preset===p.id?'active':''} onClick={()=>setPreset(p.id)}><strong>{p.name}</strong><small>{p.note}</small></button>)}</div></div>
      <div className="frame-range"><label><span>Zoom</span><b>{zoom.toFixed(2)}x</b></label><input type="range" min="1" max="2.5" step=".01" value={zoom} onChange={e=>setZoom(+e.target.value)}/></div>
      <div className="frame-range"><label><span>Overlay</span><b>{shade}%</b></label><input type="range" min="0" max="60" value={shade} onChange={e=>setShade(+e.target.value)}/></div>
      <div className="frame-actions"><button className="feature-outline-btn" onClick={reset}>Reset posisi</button><button className="feature-solid-btn" onClick={download}>Download PNG</button></div>
    </section>
    <section className="frame-canvas-wrap">
      <div className="frame-phone"><canvas ref={canvasRef} width={W} height={H} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}/>{!imageUrl&&<div className="frame-empty"><strong>Upload your photo</strong><span>Preview akan muncul di sini</span></div>}</div>
      <p>Drag foto langsung di preview untuk mengatur posisi.</p>
    </section>
  </div>
}
