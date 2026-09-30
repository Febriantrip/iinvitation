import React,{useState} from 'react'
import { ChevronDown } from '../components/Icons'
import { faqs } from '../data/siteData'
export default function Faq(){const [open,setOpen]=useState(0);return <section className="faq section" id="faq"><div className="faq-title"><div className="section-kicker">07 / FAQ</div><h2>Questions,<br/><em>answered.</em></h2></div><div className="faq-list">{faqs.map(([q,a],i)=><article key={q} className={open===i?'open':''}><button onClick={()=>setOpen(open===i?-1:i)}><span>{q}</span><ChevronDown/></button><div className="faq-answer"><p>{a}</p></div></article>)}</div></section>}
