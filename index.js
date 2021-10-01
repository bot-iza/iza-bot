
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { diversao } = require('./src/diversao')
const { usuario } = require('./src/usuario')
const { admins } = require('./src/admins')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const lolis = require('lolis.life')
const loli = new lolis()
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
prefix = '.'
blocked = []
const antibucin = JSON.parse(fs.readFileSync('./src/antibucin.json'))
const antifake = JSON.parse(fs.readFileSync('./src/antifake.json'))

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
	})

	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'connectando....')
	})
	client.on('open', () => {
		success('2', '𝔅𝔬𝔱-𝔯𝔦𝔮𝔲𝔢 𝔬𝔫')
	})
	await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
	
	//**** ANTI-FAKE *****
	
	client.on('group-participants-update', async (anu) => {
	  	if(antifake.includes(anu.jid)) {
	const mdata = await client.groupMetadata(anu.jid)
			if (anu.action == 'add'){
				num = anu.participants[0]
				if(!num.split('@')[0].startsWith(55) && !num.split('@')[0].startsWith(351) && !num.split('@')[0].startsWith(1)) {
					client.sendMessage(mdata.id, ' ⛹️⛹️ Somente números do Brasil, dos EUA e de Portugal são aceitos aqui. 🏌️', MessageType.text)
					setTimeout(async function () {
						client.groupRemove(mdata.id, [num])
					}, 2000)
			 }
		}
       	}
	
	})	
	

	//*** FUNCTION WELCOME ****
	client.on('group-participants-update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `┏━━━━━━━━━━━━━━━━━━━━
┃─────〘𝙱𝙴𝙼 𝚅𝙸𝙽𝙳𝙾 〙────
┃━━━━━━━━━━━━━━━━━━━━
┠⊷ 𝙽𝙾𝙼𝙴: ${num.split('@')[0]}
┠⊷ 𝙽𝙾𝙼𝙴: ${mdata.subject}
┠⊷ Lᴇɪᴀ ᴀs ʀᴇɢʀᴀs ᴘʀᴀ ɴᴀ̃ᴏ sᴇʀ
┠⊷ ʙᴀɴɪᴅᴏ! 
┠⊷ Mᴇᴜ ᴄʀɪᴀᴅᴏʀ:
┠⊷ wa.me//554891463194
┗━━━━━━━━━━━━━━━━━━━━`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `Menos 1 😔... @${num.split('@')[0]}`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
	     }
	})
	

	client.on('CB:Blocklist', json => {
            if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('chat-update', async (mek) => {
		try { if (!mek.hasNewMessage) return
                        mek = JSON.parse(JSON.stringify(mek)).messages[0]
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const speed = require('performance-now');
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'Your-Api-Key'
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
            var pes = (type === 'conversation' && mek.message.conversation) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text ? mek.message.extendedTextMessage.text : ''
			const messagesC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)
			const insom = from.endsWith('@g.us')
			const nameReq = insom ? mek.participant : mek.key.remoteJid
			pushname = client.contacts[nameReq] != undefined ? client.contacts[nameReq].vname || client.contacts[nameReq].notify : undefined

			mess = {
					wait: '⚡Calma ae lendario trabalhando⚡',
					success: 'Pronto',
					levelon: '*leveling* *ativado*',
					leveloff: '*leveling* *desativado*',
					levelnoton: ' *leveling não ativado*',
					levelnol: '*ERROR* °-°',
					error: {
				stick: 'Não deu pra converter a foto/video na figurinha parsa, A vida e triste',
				Iv: 'Link invalido'
				},
				only: {
					group: 'Este comando so pode ser usado nos grupos maninho',
					premium: `Ei {pushname2} Só usuarios PREMIUMS podem usar este comando*`,
					mod: 'ESTE PEDIDO É ESPECÍFICO PARA O MODERADOR DO lendario*',
					benned: 'Você foi banido, contate o dono para te desbanir',
					ownerG: 'Só o RIQUE pode usar esse comando meu mano',
					ownerB: 'Só o RIQUE  pode usar esse comando meu mano',
					userB: `──「 LISTA 」──\nOlá ${pushname} !\nVocê não esta registrado como amigo do meu dono então pessa para ele te adicionar como amigo\n\n──「 ⚡Super Xandão⚡ 」──`,
					admin: 'Este comando só pode ser usado por administradores de grupo!',
					Badmin: 'Este comando so pode ser usado quando o lendario se torna ADM do grupo parsa',
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["554891463194@s.whatsapp.net","554891463194@s.whatsapp.net"] // Recoloque o seu numero
			const mod = [ownerNumber,"554891463194@s.whatsapp.net","554891463194@s.whatsapp.net"]// Moderador do bot
			const adminbotnumber = ["554891463194@s.whatsapp.net","554891463194@s.whatsapp.net"]// admin bot numero
			const frendsowner = ["554891463194@s.whatsapp.net","554891463194@s.whatsapp.net"]// amigo do criador 
			const premium = ["554891463194@s.whatsapp.net","554891463194@s.whatsapp.net"]
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupDesc = isGroup ? groupMetadata.desc : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const groupId = isGroup ? groupMetadata.jid : ''
			const time = moment.tz('America/Sao_Paulo').format('DD/MM HH:mm:ss')
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isAntiBucin = isGroup ? antibucin.includes(from) : false
			const isAntiFake = isGroup ? antifake.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isPremium = premium.includes(sender)
			const ismod = mod.includes(sender)
			const errorurl2 = 'https://i.ibb.co/dttZM8b/591530180aad.png'
			const isadminbot = adminbotnumber.includes(sender)
			const isfrendsowner = frendsowner.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
                       
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
			
			if (budy.includes("https://m.kwai.me/")){
		if (!isGroup) return
		if (!isAntiBucin) return
		if (isGroupAdmins) return reply('porque você é um administrador do grupo, e o bot  não vai te remover')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`「 ANTI-KWAIII DETECTADO 」\n${sender.split("@")[0]} voce sera expulso*`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		}, 0)
	}
        if (budy.includes("https://s.kwai.app/s/")){
		if (!isGroup) return
		if (!isAntiBucin) return
		if (isGroupAdmins) return reply('porque você é um administrador do grupo, os bot não grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`「 SPAM DETECTADO 」\n${sender.split("@")[0]} vou remover por postar links kwai *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			if (budy.includes("https://chat.whatsapp.com/")){
		if (!isGroup) return
		if (!isAntiBucin) return
		if (isGroupAdmins) return reply('porque você é um administrador do grupo, e o bot  não vai te remover')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
			}
			if (budy.toLowerCase().includes("@554891463194")){
					if (!isGroup) return
					client.updatePresence(from, Presence.composing)
					reply('e ai mano? acho o rique o lendario dormindo ou ocupado...!!!')
				    }
			

		     if (messagesC.includes("bot")){
			client.updatePresence(from, Presence.composing)
			tujuh = fs.readFileSync('.github/workflows/bot.mp3');
            client.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
	
		     }	
			if (messagesC.includes("oi")){
			client.updatePresence(from, Presence.composing)
			tujuh = fs.readFileSync('.github/workflows/oi.mp3');
            client.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
	
		}					
		     
			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
					
					// comando dos usuarios//
					
					case 'figurinha':
				case 'fig':
				case 'f':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Falhou, no momento da conversão ${tipe} para o adesivo`)
							})
							.on('end', function () {
								console.log('Finish')
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Falha, ocorreu um erro, tente novamente mais tarde.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								client.sendMessage(from, fs.readFileSync(ranw), sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Envie fotos com legendas *.f* ou marque uma imagem que já foi enviada`)
					}
					break
					
					 case 'musica':
					  if (args.length < 1) return reply('Cᴀᴅᴇ ᴏ ɴᴏᴍᴇ ᴅᴀ ᴍᴜ́sɪᴄᴀ?')
                reply('🔎Pʀᴏᴄᴜʀᴀɴᴅᴏ ᴍᴜ́sɪᴄᴀ..🔎')
                const play = body.slice(8)
                anu = await fetchJson(`https://api.zeks.xyz/api/ytplaymp3?q=${play}&apikey=italumaster`)
                 infomp3 = `┏━━━━━━━━━━━━━━━━━━━━
┃   〘ᴍᴜsɪᴄᴀ ᴇɴᴄᴏɴᴛʀᴀᴅᴀ!!! 〙
┃━━━━━━━━━━━━━━━━━━━
┠⊷\nᴛɪᴛᴜʟᴏ: 
┠⊷ ${anu.result.title}\

┠⊷  \n𝚄𝚛𝚕:
┠⊷ ${anu.result.source}
┠⊷\nTᴀᴍᴀɴʜᴏ: ${anu.result.size}\

┠⊷\nᴘᴏʀ ғᴀᴠᴏʀ ᴇsᴘᴇʀᴇ ᴏ ᴅᴏᴡɴʟᴏᴀᴅ sᴇʀ ᴄᴏɴᴄʟᴜɪᴅᴏ!!!
 
┏━━━━━━━━━━━━━━━━━━━━
┠⊷ Mᴇᴜ ᴄʀɪᴀᴅᴏʀ:
┠⊷ wa.me/554891463194
┠⊷ Cᴏᴘʏʀɪɢʜᴛ ® Bᴏᴛ-ʀiquɛ 2021 
┗━━━━━━━━━━━━━━━━━━━━`
                buffer = await getBuffer(anu.result.thumbnail)
                lagu = await getBuffer(anu.result.url_audio)
                client.sendMessage(from, buffer, image, {quoted: mek, caption: infomp3})
                client.sendMessage(from, lagu, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
                if (anu.error) return reply( mess.error.again)
					break
					
					
					case 'listadmins':
					if (!isGroup) return reply(mess.only.group)
					teks = `Lista de adms *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
                            if (!isGroup) return reply(mess.only.group)
                                     
                                        linkgc = await client.groupInviteCode(from)
                                        reply('https://chat.whatsapp.com/'+linkgc)
                                        break
                              
				case 'ping':
                case 'velocidade':
                
                    const timestamp = speed();
                    const latensi = speed() - timestamp
                    client.updatePresence(from, Presence.composing) 
				uptime = process.uptime()
                    client.sendMessage(from, `Velocidade do bot: *${latensi.toFixed(4)} _Segundos_\nTipo do bot: *Termux Somente*\n\n*O bot esteve ativo por*\n*${kyun(uptime)}*`, text, { quoted: mek})
                    break
					
						case 'listonline':
				if (!isGroup) return reply(mess.only.group)
        		let ido = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : from
			    let onli = [...Object.keys(client.chats.get(ido).presences), client.user.jid]
			    client.sendMessage(from, '`[Usuario Online]:\n' + onli.map(v => '- @' + v.replace(/@.+/, '')).join`\n`, text, { quoted: mek, contextInfo: { mentionedJid: onli } })
				
					break
					case 'marcar':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*#* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
				
				break
					
					
					// FIIIIIM //
					
					
				 // comando dos Admins//
					
					case 'diversao':	
			  case 'diversaos':
			  case 'div':
			 if (!isGroupAdmins) return reply(mess.only.admin)
			if (!isGroup) return reply(`Este comando só pode ser usado em grupos`)		
cuImg = await getBuffer (`http://2.bp.blogspot.com/-sCQOU3_sDzs/VDtCPxR-O5I/AAAAAAAAIKc/g-NV57_KTkA/s1600/Divers%C3%A3o.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu Diversao",}}}, caption: diversao(prefix, time, pushname, sender)})
					break
					
					 case 'usuario':
                          case 'usuário':
			  case 'usuarios':
			  case 'users':
			
			if (!isGroup) return reply(`Este comando só pode ser usado em grupos`)
cuImg = await getBuffer (`https://www.pngkey.com/png/full/847-8472374_usurio-do-usurio-de-segurana-icon-icon-matematica.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu do Usuario",}}}, caption: usuario(prefix, sender)})
					break	
					
					case 'menu':
	                         case 'ajuda':
			         case 'help':
		let palavrasAleatorias = [
'sexo',
'sua mãe é minha',
'gay',
			]
	            	uptime = process.uptime ()
                    putagg = fs.readFileSync('./src/menu.jpeg')
                    client.sendMessage(from, putagg, image, {quoted: mek, caption: help(prefix, sender, pushname, time, palavrasAleatorias[Math.floor(Math.random() * palavrasAleatorias.length)])})
                    break
					
					case 'adm':	
			  case 'adms':
			  case 'admins':
			if (!isGroupAdmins) return reply(mess.only.admin)
			if (!isGroup) return reply(`Este comando só pode ser usado em grupos`)
cuImg = await getBuffer (`https://img.icons8.com/bubbles/2x/admin-settings-male.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu Admins",}}}, caption: admins(prefix, sender)})
					break
					
					case 'antilink':

                   	if (!isGroup) return reply(mess.only.group)

					if (!isGroupAdmins && !isOwner) return reply(mess.only.admin)

					if (!isBotGroupAdmins) return reply(mess.only.Badmin)

					if (args.length < 1) return reply('digite 1 para ativar')

					if (Number(args[0]) === 1) {

						if (isAntiBucin) return reply('anti-link está ativo ')

						antibucin.push(from)

						fs.writeFileSync('./src/antibucin.json', JSON.stringify(antibucin))

						

						client.sendMessage(from,` Atenção a todos participante do grupo (*ANTI-LINK*) está ativo no grupo, qualquer tipo link sera banido do grupo!!! `, text)

					} else if (Number(args[0]) === 0) {

						if (!isAntiBucin) return reply('O modo Anti-Link foi desativado')

						var ini = antibucin.indexOf(from)


						antibucin.splice(ini, 1)

						fs.writeFileSync('./src/antibucin.json', JSON.stringify(antibucin))

						reply('Desativando anti-link com sucesso neste grupo ✔️')

					} else {

						reply('1 para ativar, 0 para desativar')

					}

					break
					
					case 'antifake':
					try {
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isAntiFake) return reply('Ja esta ativo')
						antifake.push(from)
						fs.writeFileSync('./src/antifake.json', JSON.stringify(antifake))
						reply('Ativou com sucesso o recurso de antifake neste grupo✔️')
					} else if (Number(args[0]) === 0) {
						antifake.splice(from, 1)
						fs.writeFileSync('./src/antifake.json', JSON.stringify(antifake))
						reply('Desativou com sucesso o recurso de antifake neste grupo✔️')
					} else {
						reply('1 para ativar, 0 para desativar')
					}
					} catch {
						reply('Deu erro, tente novamente :/')
					}
              
					
				break
					case 'bemvindo':
					if (!isGroup) return reply(mess.only.group)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
					if (isWelkom) return reply('Já esta ativo.')
					welkom.push(from)
				    fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
				    reply('Ativou com sucesso o recurso de boas-vindas neste grupo 😉️')
					} else if (Number(args[0]) === 0) {
					welkom.splice(from, 1)
					fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
					reply('Desativou com sucesso o recurso de boas-vindas neste grupo 😡️')
					} else {
					reply('1 para ativar, 0 para desativar, lerdão vc em KAKKKK')
					}
                                      break
					
					case 'promover':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Promote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Ok, chefe. esse cara aqui: @${mentioned[0].split('@')[0]} agora é admin do grupo!`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break
					
case 'fechar':
					client.updatePresence(from, Presence.composing) 
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					var nomor = mek.participant
					const close = {
					text: `Grupo Fechado pelo administrador  @${nomor.split("@s.whatsapp.net")[0]}\n  *Só Adms Podem mandar mensagem*`,
					contextInfo: { mentionedJid: [nomor] }
					}
					client.groupSettingChange (from, GroupSettingChange.messageSend, true);
					reply(close)
					break

 case 'abrir':
               
					client.updatePresence(from, Presence.composing) 
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					open = {
					text: `Grupo Aberto pelo administrador  @${sender.split("@")[0]}\n  *todos os participantes pode enviar mensagens*`,
					contextInfo: { mentionedJid: [sender] }
					}
					client.groupSettingChange (from, GroupSettingChange.messageSend, false)
					client.sendMessa
				case 'setppbot':
				client.updatePresence(from, Presence.composing) 
				if (!isQuotedImage) return reply(`Grupo aberto pelo administrador @${sender.split("@")[0]}\nsekarang *todos os participantes* pode enviar mensagens`)
					if (!isOwner) return reply(mess.only.ownerB)
					enmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(enmedia)
					await client.updateProfilePicture(botNumber, media)
					reply('Obrigado pelo novo perfil😗')
					break
					
					case 'regras':
                    client.updatePresence(from, Presence.composing)
                    if (!isGroup) return reply(mess.only.group)
                    ppUrl = await client.getProfilePicture(from) // leave empty to get your own
			        buffer = await getBuffer(ppUrl)
		            client.sendMessage(from, buffer, image, {quoted: mek, caption: `*NOME* : ${groupName}\n*MEMBRO* : ${groupMembers.length}\n*ADMIN* : ${groupAdmins.length}\n*DESCRIÇÃO* : ${groupDesc}`})
                    break
					
					case 'clonar':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Marque a pessoa que você quer clonar\n\n*EXEMPLO:* clone @')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`ok , Chefe foto dessa pessoal foi clonada no bot. @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Putz, deu erro, a pessoa deve estar sem foto 😔')
					}
                
					break

                    case 'rebaixar':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Demote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Ok, chefe. esse cara aqui: @${mentioned[0].split('@')[0]} perdeu o adm com sucesso!`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
					
					case 'adiciona':
			        case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Você quer adicionar um gênio?')
					if (args[0].startsWith('08')) return reply('Use o código do país, man \n ex: 554891843177')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Falha ao adicionar destino, talvez porque é privado')
					}
					break
					
					case 'ban':
					case 'banir':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('A marca-alvo que você deseja remover!')
                    if (mek.message.extendedTextMessage === null || mek.message.extendedTextMessage === undefined) return;
                    if (mek.message.extendedTextMessage.contextInfo.participant === undefined) {
                    entah = mek.message.extendedTextMessage.contextInfo.mentionedJid
                    if (exe1.length > 1) {
                    var M_exe = []
                    for (let cut of exe1) {
                    M_exe.push(cut)
                      }
                    client.groupRemove(from, M_exe)
                    } else {
                    client.groupRemove(from, [exe1[0]])
                      }
                       } else {
                     exe1 = mek.message.extendedTextMessage.contextInfo.participant
                     client.groupRemove(from, [exe1])
                       }
                   break
				   
			       case 'remover':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('A marca-alvo que você quer remover!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'esse filha da puta não cumpriu as regras foi removido :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Alvo removido com sucesso  : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
					
					
					// FIIIIIM //
					
					
					//Texto marker 
			     
						case 'flametext':
                    try {
                        if (args.length < 1) return reply(`Digite da forma correta:\nComando: ${prefix}flametext texto`)
                        pc = body.slice(10)
                        reply(ptbr.waitimg())
                        haha = await fetchJson(`https://api.zeks.xyz/api/flametext?text=${pc}&apikey=${rique2021}`)
                        hehe = await getBuffer(haha.result)
                        client.sendMessage(from, hehe, image, {
                            quoted: mek
                        })
                    } catch (e) {
                        console.log(`Error :`, color(e, 'red'))
                        reply('❌ocorreu um erro❌')
                    }
                    break
					
					
					// FIIIIIM //
					
					// comando dos dono //
					
					case 'aviso':
					if (!isOwner) return reply('Quem é Você, você não é meu dono 😂?')
					if (args.length < 1) return reply('.......')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `[ AVISO IMPORTANTE ]\n\n${body.slice(15)}`})
						}
					} else {
						for (let _ of anu) {
					     sendMess(_.jid, `[COMUNICADO]\n\n${body.slice(12)}`)
						}
					}
					break
					
					case 'sair':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (isGroupAdmins || isOwner) {
                                            client.groupLeave(from)
                                        } else {
                                            reply(mess.only.admin)
                                        }
                                        break
					case 'prefixo':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`o prefixo foi mudado com sucesso: ${prefix}`)
				        break 
				
				case 'limpar':
					if (!isOwner) return reply('só o rique pode usar esse comando') 
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Mensagem foi apagada dos grupo com sucesso')
					break
					
					// FIIIIIM //
					
					//DIVERSÃO USUARIO//

case 'feios':
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = '🥴ESSES SÃO FEIO DO GRUPO🥴 \n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `‍‍🥴⇛ @${groupMembers[r].jid.split('@')[0]}\n`
d.push(groupMembers[r].jid)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

case 'punheteiros':
					
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = '*🍼LISTA DOS PUNHETEIROS DO GRUPO🍼*\n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `️‍️‍‍️🍼⇛ @${groupMembers[r].jid.split('@')[0]}\n`
d.push(groupMembers[r].jid)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

case 'retardado':
              client.updatePresence(from, Presence.composing) 
                random = `${Math.floor(Math.random() * 110)}`
               hasil = `você é: * ${random}% *retardado(A)😛`
              reply(hasil)
                  break
                    case 'golpe':
              client.updatePresence(from, Presence.composing) 
                random = `${Math.floor(Math.random() * 100)}`
               hasil = `você e : ${random} % do golpe 😳\n\nGosta de sentir sentimentos neh 💔`
              reply(hasil)
                    break
					
					case 'gadometro':
case 'gado':
var chifre = ["ultra extreme gado", "Gado-Master", "Gado-Rei", "Gado", "Escravo-ceta", "Escravo-ceta Maximo", "Gacorno?", "Jogador De Forno Livre<3", "Mestre Do Frifai<3<3", "Gado-Manso", "Gado-Conformado", "Gado-Incubado", "Gado Deus", "Mestre dos Gados", "Topa tudo por buceta", "Gado Comum", "Mini Gadinho", "Gado Iniciante", "Gado Basico", "Gado Intermediario", "Gado Avançado", "Gado Profisional", "Gado Mestre", "Gado Chifrudo", "Corno Conformado", "Corno HiperChifrudo", "Chifrudo Deus", "Mestre dos Chifrudos"]
var gado = chifre[Math.floor(Math.random() * chifre.length)]
gadop = `${Math.floor(Math.random() * 100)}`
hisil = `Você é:\n\n${gado}`
reply(hisil)
break

case 'casal':
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = '👩‍❤️‍👨𝘾𝘼𝙎𝘼𝙇 𝘿𝙊 𝙂𝙍𝙐𝙋𝙊👩‍❤️‍👨‍\n'
for(i = 0; i < 2; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `‍👩‍❤️‍👨⇛  @${groupMembers[r].jid.split('@')[0]}\n`
d.push(groupMembers[r].jid)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break
					case 'bichas':
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = '*ESSES SÃO BICHAS DO GRUPO*\n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `‍‍‍ ⇛ @${groupMembers[r].jid.split('@')[0]}\n`
d.push(groupMembers[r].jid)
} 
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

case 'cornos':
					if (!isGroup) return reply(`Esse comando so pode ser usado em grupos meu mano`)
					membr = []
					const corno1 = groupMembers
					const corno2 = groupMembers
					const corno3 = groupMembers
					const corno4 = groupMembers
					const corno5 = groupMembers
					const cornos1 = corno1[Math.floor(Math.random() * corno1.length)]
					const cornos2 = corno2[Math.floor(Math.random() * corno2.length)]
					const cornos3 = corno3[Math.floor(Math.random() * corno3.length)]
					const cornos4 = corno4[Math.floor(Math.random() * corno4.length)]
					const cornos5 = corno5[Math.floor(Math.random() * corno5.length)]
					var porcentagemcorno = ["1%", `2%`, `3%`, `4%`, `5%`, `6%`, `7`, `8%`, `9%`, `10`, `11%`, `12%`,`13%`, `14%`, `15%`, `16%`, `17%`, `18%`, `19%`, `20%`, `21%`, `22`, `23%`, `24%`, `25%`, `26%`, `27%`, `28%`, `27%`, `28%`, `29%`, `30%`, `31%`, `32%`, `33%`, `34%`, `35%`, `36%`, `37%`, `38%`, `39%`, `40%`, `41%`, `42%`, `43%`, `44%`, `45%`, `46%`, `47%`, `48%`, `49%`, `50%`, `51%`, `52%`, `53%`, `54%`, `55%`, `56%`, `57%`, `58%`, `59%`, `60%`, `61%`, `62%`, `63%`, `64%`, `65%`, `66%`, `67%`, `68%`, `69%`, `70%`, `71%`, `72%`, `73%`, `74%`, `75%`, `76%`, `77%`, `78%`, `79%`, `80%`, `81%`, `82%`, `85%`, `84%`, `85%`, `86%`, `87%`, `88%`, `89%`, `90%`, `91%`, `92%`, `93%`, `94%`, `95%`, `96%`, `97%`, `98%`, `99%`, `O chifre desse ai bate na lua ksksksk`]
					const porcentagemc = porcentagemcorno[Math.floor(Math.random() * porcentagemcorno.length)]
					teks = `${pushname} Esses são os cornos do grupo ${groupName}\n@${cornos1.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos2.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos3.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos4.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos5.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n\n O MOLEQUE É BRABO O BOT-RIQUE`
					membr.push(cornos1.jid)
					membr.push(cornos2.jid)
					membr.push(cornos3.jid)
					membr.push(cornos4.jid)
					membr.push(cornos5.jid)
					mentions(teks, membr, true)
					break
					
					case 'gostosas':
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = ' 🥰*AS GOSTOSAS DO GRUPO*🥰\n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `‍‍‍🥰⇛ @${groupMembers[r].jid.split('@')[0]}\n`
d.push(groupMembers[r].jid)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

case 'abraço':

if (!isGroup) return reply(mess.only.group())
if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return 
mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
pro = '.\n'
for (let _ of mentioned) {
pro += `@${_.split('@')[0]}\n`
}
yhb = `Que fofo... ${sender.split("@")[0]} deu um abraço apertado em @${mentioned[0].split('@')[0]}`
mentions(yhb, yhb, true)
break

case 'gays':
					if (!isGroup) return reply(`Esse comando so pode ser usadoem grupos parsa`)
					membr = []
					const gay1 = groupMembers
					const gay2 = groupMembers
					const gay3 = groupMembers
					const gay4 = groupMembers
					const gay5 = groupMembers
					const gays1 = gay1[Math.floor(Math.random() * gay1.length)]
					const gays2 = gay2[Math.floor(Math.random() * gay2.length)]
					const gays3 = gay3[Math.floor(Math.random() * gay3.length)]
					const gays4 = gay4[Math.floor(Math.random() * gay4.length)]
					const gays5 = gay5[Math.floor(Math.random() * gay5.length)]
					var porcentagemgay = ["1%", `2%`, `3%`, `4%`, `5%`, `6%`, `7`, `8%`, `9%`, `10`, `11%`, `12%`,`13%`, `14%`, `15%`, `16%`, `17%`, `18%`, `19%`, `20%`, `21%`, `22`, `23%`, `24%`, `25%`, `26%`, `27%`, `28%`, `27%`, `28%`, `29%`, `30%`, `31%`, `32%`, `33%`, `34%`, `35%`, `36%`, `37%`, `38%`, `39%`, `40%`, `41%`, `42%`, `43%`, `44%`, `45%`, `46%`, `47%`, `48%`, `49%`, `50%`, `51%`, `52%`, `53%`, `54%`, `55%`, `56%`, `57%`, `58%`, `59%`, `60%`, `61%`, `62%`, `63%`, `64%`, `65%`, `66%`, `67%`, `68%`, `69%`, `70%`, `71%`, `72%`, `73%`, `74%`, `75%`, `76%`, `77%`, `78%`, `79%`, `80%`, `81%`, `82%`, `85%`, `84%`, `85%`, `86%`, `87%`, `88%`, `89%`, `90%`, `91%`, `92%`, `93%`, `94%`, `95%`, `96%`, `97%`, `98%`, `99%`, `100%`]
					const porcentagem = porcentagemgay[Math.floor(Math.random() * porcentagemgay.length)]
					teks = `${pushname} Esses são os gays grupo ${groupName}\n@${gays1.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays2.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays3.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays4.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays5.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n\n O MOLEQUE BRABO O BOT LENDARIO `
					membr.push(gays1.jid)
					membr.push(gays2.jid)
					membr.push(gays3.jid)
					membr.push(gays4.jid)
					membr.push(gays5.jid)
					mentions(teks, membr, true)
					break

//ACABOU A DIVERSÃO
					
				default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						return //console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
