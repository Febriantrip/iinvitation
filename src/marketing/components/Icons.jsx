import React from 'react'

const Icon = ({children, size=20, ...props}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>
export const ArrowUpRight = p => <Icon {...p}><path d="M7 17 17 7M8 7h9v9"/></Icon>
export const ArrowRight = p => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>
export const MenuIcon = p => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>
export const CloseIcon = p => <Icon {...p}><path d="m6 6 12 12M18 6 6 18"/></Icon>
export const CheckIcon = p => <Icon {...p}><path d="m5 12 4 4L19 6"/></Icon>
export const ChevronDown = p => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>
export const PlayIcon = p => <Icon {...p}><path d="m9 7 8 5-8 5V7Z"/></Icon>
export const HeartIcon = p => <Icon {...p}><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/></Icon>
export const SparkIcon = p => <Icon {...p}><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></Icon>
export const GuestIcon = p => <Icon {...p}><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M17 8a2.5 2.5 0 0 1 0 5M18 15.5A4 4 0 0 1 21 19"/></Icon>
export const ShieldIcon = p => <Icon {...p}><path d="M12 3 5 6v5c0 5 3.2 8 7 10 3.8-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></Icon>
export const LayoutIcon = p => <Icon {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M9 10h12"/></Icon>
export const DeviceIcon = p => <Icon {...p}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></Icon>
export const MessageIcon = p => <Icon {...p}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></Icon>
