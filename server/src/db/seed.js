import { randomUUID } from 'node:crypto'
import { pool } from './pool.js'
import { config } from '../config.js'
import { hashPassword } from '../security/password.js'

const whatsappTemplate = `Kepada Yth.\n{guest_name}\n\nAssalamualaikum Warahmatullahi Wabarakaatuh\n\nDengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami :\n\n🧕🏻 {bride_full_name}\n\ndengan\n\n🤵🏻 {groom_full_name}\n\nUntuk informasi detail mengenai acara, silakan kunjungi link di bawah ini :\n{invitation_link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\nAtas kehadiran dan doa restunya kami ucapkan terima kasih.\n\nWassalamualaikum Warahmatullahi Wabarakaatuh\n\nHormat kami,\n{couple_name}`

export async function seed() {
  const adminCount = await pool.query('SELECT COUNT(*) AS count FROM admin_users')
  if (Number(adminCount.rows[0].count) === 0) {
    const { salt, hash } = hashPassword(config.adminPassword)
    await pool.query('INSERT INTO admin_users(id,email,password_salt,password_hash) VALUES(?,?,?,?)', [randomUUID(), config.adminEmail.toLowerCase(), salt, hash])
    console.log(`[seed] admin created: ${config.adminEmail}`)
  }

  const invitationCount = await pool.query('SELECT COUNT(*) AS count FROM invitations')
  if (Number(invitationCount.rows[0].count) > 0) return

  const id = randomUUID()
  await pool.query(`INSERT INTO invitations(
    id,slug,client_name,theme_id,groom_name,groom_full_name,bride_name,bride_full_name,groom_parents,bride_parents,event_date,
    akad_time,reception_time,venue_name,venue_address,map_url,opening_text,story_text,closing_text,hero_image,hero_edit_json,music_url,
    feature_website,feature_guestbook,feature_frame,guestbook_pin,frame_preset,frame_names,frame_date_label,frame_overlay,whatsapp_template
  ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
    id,'alya-raka-demo','Alya & Raka','botanical-serenity','Raka','Raka Wijaya','Alya','Alya Maharani','Putra dari Bapak & Ibu','Putri dari Bapak & Ibu','2026-12-12T10:00',
    '08.00 - 10.00 WIB','11.00 - 14.00 WIB','Lokasi Acara','Silakan isi alamat lengkap acara dari menu Data Undangan.','https://maps.google.com',
    'Dengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.',
    'Setiap perjalanan punya awal. Dari pertemuan, percakapan, dan doa yang tumbuh pelan-pelan, kami sampai pada satu keputusan untuk melangkah bersama dalam ikatan pernikahan.',
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu. Atas kehadiran dan doa restunya kami ucapkan terima kasih.',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',JSON.stringify({positionX:50,positionY:50,zoom:1,rotate:0,brightness:100,contrast:100,saturation:100,aspect:'cover'}),'',
    1,1,1,'000000','heritage','Alya & Raka','12 · 12 · 2026',22,whatsappTemplate
  ])

  const gallery = [
    ['https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85','Our Day'],
    ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85','Together'],
    ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85','Forever Starts Here'],
  ]
  for (let i = 0; i < gallery.length; i++) {
    await pool.query('INSERT INTO gallery_items(id,invitation_id,url,caption,edit_json,position) VALUES(?,?,?,?,?,?)', [randomUUID(), id, gallery[i][0], gallery[i][1], JSON.stringify({positionX:50,positionY:50,zoom:1,rotate:0,brightness:100,contrast:100,saturation:100,aspect:'square'}), i])
  }

  const demoGuests = [
    ['Tamu Demo 01','6280000000001','Keluarga','bapak-budi-x1',2],
    ['Tamu Demo 02','6280000000002','Keluarga','mamah-indri-x2',2],
  ]
  for (const [name, phone, group, token, invitedPax] of demoGuests) {
    await pool.query('INSERT INTO guests(id,invitation_id,name,phone,guest_group,token,status,invited_pax) VALUES(?,?,?,?,?,?,?,?)', [randomUUID(), id, name, phone, group, token, 'Belum dibuka', invitedPax])
  }
  console.log('[seed] demo invitation created')
}
