
const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { izabot } = require('./src/izabot')
const { tema } = require('./src/tema')
const { apks } = require('./src/apks')
const { destrava } = require('./src/destrava')
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
prefix = '*'
blocked = []

const antibucin = JSON.parse(fs.readFileSync('./src/antibucin.json'))
const antifake = JSON.parse(fs.readFileSync('./src/antifake.json'))
const antipalavra = JSON.parse(fs.readFileSync('./src/antipalavra.json'))


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
		console.log(color('[','white'), color('!','red'), color(']','white'), color('escaneando qr code iza-bot'))
	})

	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'espera ai man')
	})
	client.on('open', () => {
		success('2', 'IZA-BOT ONLINE')
	})
	await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
	
	
	//**** ANTI-FAKE *****
	
	client.on('group-participants-update', async (anu) => {
	  	if(antifake.includes(anu.jid)) {
	const mdata = await client.groupMetadata(anu.jid)
			if (anu.action == 'add'){
				num = anu.participants[0]
				if(!num.split('@')[0].startsWith(55) && !num.split('@')[0].startsWith(994) && !num.split('@')[0].startsWith(1)) {
					client.sendMessage(mdata.id, ' ???????????? Somente n??meros do +55 +1 e 994 ????????????', MessageType.text)
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
				teks = `???????????????????????????????????????????????????????????????
????????????????????????????????? ???????????????????? ???????????????
???????????????????????????????????????????????????????????????
?????? ????????: @${num.split('@')[0]}
?????? G??up??: ${mdata.subject}
?????? M?????? ??????????????????:
?????? wa.me//554891463194
???????????????????????????????????????????????????????????????`
				let buff = await getBuffer(ppimg)
				client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
				}
				teks = `QUE PENA SAIU MAIS UM FAMILIA ????... @${num.split('@')[0]}`
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
					wait: '???estou trabalhando???',
					success: 'Pronto',
					levelon: '*leveling* *ativado*',
					leveloff: '*leveling* *desativado*',
					levelnoton: ' *leveling n??o ativado*',
					levelnol: '*ERROR* ??-??',
					error: {
				stick: 'N??o deu pra converter a foto/video na figurinha , A vida e triste',
				Iv: 'Link invalido'
				},
				only: {
					group: 'esse comando pode usar no grupo',
					premium: `Ei S?? usuarios PREMIUMS podem usar este comando*`,
					mod: 'ESTE PEDIDO ?? ESPEC??FICO PARA O MODERADOR DO lendario*',
					benned: 'Voc?? foi banido, contate o dono para te desbanir',
					ownerG: 'S?? o RIQUE pode usar esse comando meu mano',
					ownerB: 'S?? o RIQUE  pode usar esse comando meu mano',
					userB: `????????? LISTA ?????????\nOl?? ${pushname} !\nVoc?? n??o esta registrado  ?????????`,
					admin: 'Este comando s?? pode ser usado por administradores de grupo!',
					Badmin: 'Este comando so pode ser usado quando o IZA-BOT se torna ADM do grupo',
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
			const isAntiPalavra = isGroup ? antipalavra.includes(from) : false
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
			const sendImage = (teks) => {
		    client.sendMessage(from, teks, image, {quoted:mek})
		    }
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}
			
			
		//ANTI-PALAVRAO
			if (budy.includes("fds")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, os bot n??o grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? PALAVR??O DETECTADO ???\n${sender.split("@")[0]} vou remover por falar palavr??o no grupo *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			if (budy.includes("fdp")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? PALAVR??O DETECTADO ???\n${sender.split("@")[0]} vou remover por falar palavr??o no grupo *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			
			if (budy.includes("vtnc")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, os bot n??o grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? PALAVR??O DETECTADO ???\n${sender.split("@")[0]} vou remover por falar palavr??o no grupo *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			
			if (budy.includes("porra")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, os bot n??o grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? PALAVR??O DETECTADO ???\n${sender.split("@")[0]} vou remover por falar palavr??o no grupo *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			
			if (budy.includes("caralho")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, os bot n??o grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? PALAVR??O DETECTADO ???\n${sender.split("@")[0]} vou remover por falar palavr??o no grupo *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			if (budy.includes("filho da puta")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, os bot n??o grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? PALAVR??O DETECTADO ???\n${sender.split("@")[0]} vou remover por falar palavr??o no grupo *`)
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
	}
			if (budy.includes("foda-se")){
		if (!isGroup) return
		if (!isAntiPalavra) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, e o bot  n??o vai te remover')
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
	
		     
	
			
				//ANTI-LINK
			
        if (budy.includes("https://s.kwai.app/s/")){
		if (!isGroup) return
		if (!isAntiBucin) return
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, os bot n??o grupo ')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		reply(`??? SPAM DETECTADO ???\n${sender.split("@")[0]} vou remover por postar links kwai *`)
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
		if (isGroupAdmins) return reply('porque voc?? ?? um administrador do grupo, e o bot  n??o vai te remover')
		client.updatePresence(from, Presence.composing)
		if (messagesC.includes("#harusizintod")) return reply("izin diterima")
		var kic = `${sender.split("@")[0]}@s.whatsapp.net`
		setTimeout( () => {
			client.groupRemove(from, [kic]).catch((e)=>{reply(`ERR: ${e}`)})
		}, 1000)
		setTimeout( () => {
			client.updatePresence(from, Presence.composing)
		
		}, 0)
				
				  //FUN????O PRO BOT FALAR 
				
				}
   
				if (budy.toLowerCase().includes("tudo")){
					if (!isGroup) return
					client.updatePresence(from, Presence.composing)
					reply('sim estou bem gra??a a Deus!!')
				    }
			
			if (budy.toLowerCase().includes("@554891463194")){
					if (!isGroup) return
					client.updatePresence(from, Presence.composing)
					reply('e ai amigo(a)? acho o rique o lendario ocupado...!!!')
				    }
		     
		      if (messagesC.includes("menu")){
			client.updatePresence(from, Presence.composing)
			tujuh = fs.readFileSync('.github/workflows/menu.mp3');
            client.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
	
		     }	
		     
		     if (messagesC.includes("oi")){
			client.updatePresence(from, Presence.composing)
			tujuh = fs.readFileSync('.github/workflows/oi.mp3');
            client.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
	
		     }	
		     
		      if (messagesC.includes("bem-vindo")){
			client.updatePresence(from, Presence.composing)
			tujuh = fs.readFileSync('.github/workflows/bem-vindo.mp3');
            client.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
	
		     }
			
		     
			if (messagesC.includes("bot")){
			client.updatePresence(from, Presence.composing)
			tujuh = fs.readFileSync('.github/workflows/bot.mp3');
            client.sendMessage(from, tujuh, MessageType.audio, {quoted: mek, mimetype: 'audio/mp4', ptt:true})
	
		}
		     
		       //FUN????O  BOT FALAR ACABOU
		     
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
					
					
					//TEMAS BY IZA-BOT
					
					
					
				case 'text3d':
              	    if (args.length < 1) return reply('Onde est?? o texto Amigo(a)??')
                    teks = `${body.slice(8)}`
                    if (teks.length > 10) return client.sendMessage(from, 'TEXTO MUITO GRANDE', text, {quoted: mek})
                    buff = await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${teks}`, {method: 'get'})
                    client.sendMessage(from, buff, image, {quoted: mek, caption: `${teks}`})
			     	break
					
					
                                    //TEMAS ACABOU 
					
							
					// comando dos usuarios//
					
					case 'izabot':	
			  case 'izabot1':
			  case 'iza':
cuImg = await getBuffer (`https://s3.amazonaws.com/hub-central/uploads/1570802612_Ativo37.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "IZA-BOT",}}}, caption: izabot(prefix, time, pushname, sender)})
					break
					
					case 'boanoite':

  try {

ppimg = await client.getProfilePicture(`https://i.ibb.co/Vx5HCrP/IMG-20210331-WA0012.jpg`)

  } catch {

ppimg = 'https://static.imgs.app/content/assetz/uploads/2019/12/136-frases-boa-noite-para-grupo-5x4-1.jpg'

  }

  teks = `boa noite meu amigos(A) do grupo `

  its = await getBuffer (ppimg)

  client.sendMessage(from, its, image, {

quoted: mek, caption: teks

  })

break

					case 'boatarde':

  try {

ppimg = await client.getProfilePicture(`https://i.ibb.co/Vx5HCrP/IMG-20210331-WA0012.jpg`)

  } catch {

ppimg = 'https://i.pinimg.com/736x/ba/bf/e9/babfe9bf6614e9a9a827b84112f14a61.jpg'

  }

  teks = `boa tarde meu amigos(A) do grupo`

  its = await getBuffer (ppimg)

  client.sendMessage(from, its, image, {

quoted: mek, caption: teks

  })

  break
					
					case 'bomdia':

  try {

ppimg = await client.getProfilePicture(`https://i.ibb.co/Vx5HCrP/IMG-20210331-WA0012.jpg`)

  } catch {

ppimg = 'https://i2.wp.com/emotioncard.com.br/wp-content/uploads/2016/03/bom-dia-sol.jpg?fit=604%2C509&ssl=1'

  }

  teks = `bom dia meu membros preferidos <3 `

  its = await getBuffer (ppimg)

  client.sendMessage(from, its, image, {

quoted: mek, caption: teks

  })

  break

					
					 case 'apks':
                    if (!isGroup) return reply(mess.only.group)
                    client.sendMessage(from, apks(prefix), text, { quoted: mek })
                    break
					case 'destrava':
                    if (!isGroup) return reply(mess.only.group)
                    client.sendMessage(from, destrava(prefix), text, { quoted: mek })
                    break
					
					
					case 'iza':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://s3.amazonaws.com/hub-central/uploads/1570802612_Ativo37.png`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: `???????????????????????????????????????????????????????????????
?????????????????????IZABELA-BOT???????????????
???????????????????????????????????????????????????????????????
?????? IDADE: 26 ANOS
?????? FUN????ES: GERENCIAR BOT NO WHATS 
??????ONDE SE MORAR: TERMUX
?????? DONO: RIQUE O LENDARIO
???????????????????????????????????????????????????????????????`})
				break
					
					case 'wa.me':
		        case 'meunumero':
                  client.updatePresence(from, Presence.composing) 
                  options = {
                  text: `???????????????????????????????????????????????????????????????
?????????????????????WA.ME???????????????
???????????????????????????????????????????????????????????????
??????_Solicitado por_:@${sender.split("@s.whatsapp.net")[0]} 
??????Seu link WhatsApp: 
??????https://wa.me/${sender.split("@s.whatsapp.net")[0]}
??????  https://api.whatsapp.com/send?phone=${sender.split("@")[0]} 
??????               *???IZA-BOT???*  
????????????????????????????????????????????????????????????`,
                  contextInfo: { mentionedJid: [sender] }
                  }
                  client.sendMessage(from, options, text, { quoted: mek } )
			      break
				  
				  
					
								
					case 'bio':
                var yy = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
                var p = await client.getStatus(`${yy}`, MessageType.text)
                reply(p.status)
                if (p.status == 401) {
                reply("indispon??vel")
                }
                
                break
					
				case 'wikipedia':
teks = args.join(" ")
post = await fetchJson(`https://api-gdr2.herokuapp.com/api/wikipedia1?q=${teks}`).then(async (x) => {
send = `${x.result.result}`
reply(send)
})
break			
					
					case 'playstore':
                ps = `${body.slice(11)}`
                  anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/playstore?q=${ps}`, {method: 'get'})
                  store = '======================\n'
                  for (let ply of anu.result){
                  store += `??? *Nome Apk:* ${ply.app.name}\n??? *ID:* ${ply.app.id}\n??? *Link Apk:* ${ply.app.url}\n===================??]\n`
                  }
                  reply(store.trim())
                  break
					case 'trap':
					 reply('??? aguarde..???')
data = fs.readFileSync('./src/trap.js');
n = JSON.parse(JSON.stringify(data));
nimek = n[Math.floor(Math.random() * n.length)];
buffer = await getBuffer(nimek.result)
client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4',quoted: mek, caption: `PRA quem  TRAP ??????`})
 break
					case 'meme':
					 reply('??? aguarde..???')
				 data = fs.readFileSync('./src/meme.js');
                 jsonData = JSON.parse(data);
                 randIndex = Math.floor(Math.random() * jsonData.length);
                 randKey = jsonData[randIndex];
                hasil = await getBuffer(randKey.result)
                sendImage(hasil, mek, '*melhores memes by rique o lendario*')
				break
					
					case 'canal':
					memein = await kagApi.memeindo()
					buffer = await getBuffer(`https://i.imgur.com/tnNYoqu.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: `???????????????????????????????????????????????????????????????
??????????????????CANAL DO YOUTUBE???????????????
???????????????????????????????????????????????????????????????
??????CRIADOR: RIQUE O LENDARIO 
??????Canal: https://www.youtube.com/channel/UCisQPiL2pSzBYQPlUkDmg5Q
??????Meu numero: wa.me/554891463194
??????Insta:@riqueflaoficial  
??????Criador: IZA-BOT  
???????????????????????????????????????????????????????????????`})
					break
					
					case 'linkgp':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                                        linkgc = await client.groupInviteCode(from)
                                        reply('https://chat.whatsapp.com/'+linkgc)
                                        break
					
					case 'traduzir': 
 if (args.length < 1) return reply('Insira o texto que voc?? deseja traduzir')
 client.updatePresence(from, Presence.composing)
 tels = body.slice(10)
 try {
 anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/translate?text=${tels}&from=id&to=pt`, {
 method: 'get'
  })
 reply(anu.translated_text)
 } catch {
 reply(mess.ferr)
 }
break
					
					case 'saycat':
					 reply('??? aguarde Enviado video ...???')
data = await fetchJson(`https://pastebin.com/raw/cVDj0qz6`)
n = JSON.parse(JSON.stringify(data));
nimek = n[Math.floor(Math.random() * n.length)];
buffer = await getBuffer(nimek.result)
client.sendMessage(from, buffer, video, {mimetype: 'video/mp4',quoted: mek, caption: `pra quem ?? f?? saycat??????`})
 break
					
					case 'ler':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('S?? uma foto mano')
					}
					break
					
					case 'covid':
					reply('???Enviado Resultado do Covid-19???')
 susi = await fetchJson(`https://api-gdr2.herokuapp.com/api/covidbr`)
  florr = await getBuffer(`http://www.treslagoas.ms.gov.br/wp-content/uploads/coronavirus-Catraca-Livre-420x280_c.jpg`)
  claa = `        ??? *_COVID BRASIL_* ???\n
???Total de Casos: ${susi.result.totalCasos}
???Novos Casos: ${susi.result.novosCasos}
???Total de Mortos: ${susi.result.totalMortes}
???Novos Mortos: ${susi.result.novasMortes}
???Recuperados: ${susi.result.recuperados}
???Vacinados: ${susi.result.vacinadosPrimeiraDose}
???Atualizado: ${susi.result.dadosAtualizados}`
  client.sendMessage(from, florr, image, {quoted: mek, caption: claa})
  break
					
					case 'isa':
					if (args.length < 1) return reply('Onde est?? o texto, hum?')
					teks = body.slice(5)
					anu = await simih(teks) //fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}`, {method: 'get'})
					//if (anu.error) return reply('eu n??o sei amigo')
					reply(anu)
					break
					
					
					case 'converte':
					if (!isQuotedSticker) return reply('{ ??? } *Marque a figurinha*')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('??? Falha ao converter adesivos em imagens ???')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: 'aqui est?? sua foto'})
						fs.unlinkSync(ran)
					})
					break
					
					case 'voz':
					if (args.length < 1) return client.sendMessage(from, 'Ox, cade o codigo da liguagem mn? \n Exemplo: .voz pt palavra', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Cad?? o texto vey?', text, {quoted: mek})
					dtt = body.slice(9)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 100
					? reply('A maior parte do texto ?? merda')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('falha:(')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					
               break

					case 'stickergif':			
           	case 'figurinha':			
                case 'f':
		case 's':
		case 'fig':			
           	ator = 'x-Ziyy'
           	namo = 'SubscribeMe:'
           	if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
           	const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek	
           	const media = await 
client.downloadAndSaveMediaMessage(encmedia)
           	ran = getRandom('.webp')
           	await ffmpeg(`./${media}`)
           	.input(media)
           	.on('start', function (cmd) {
           	console.log(`Started : ${cmd}`)
           	})
            .on('error', function (err) {
            console.log(`Error : ${err}`)
            fs.unlinkSync(media)
            reply(mess.stick)
            })
            .on('end', function () {
            console.log('Finish')
            exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ran} -o ${ran}`, async (error) => {
            //if (error) {
            // reply(Zuxy.stikga())
            // fs.unlinkSync(media)
            // fs.unlinkSync(ran)
            //}
            client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
            fs.unlinkSync(media)
            fs.unlinkSync(ran)
            })
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
            reply(`Gagal, pada saat mengkonversi ${tipe} ke stiker`)
            })
            .on('end', function () {
            console.log('Finish')
            exec(`webpmux -set exif ${addMetadata(namo, ator)} ${ran} -o ${ran}`, async (error) => {
            //if (error) {
            // reply(Zuxy.stikga())
            // fs.unlinkSync(media)
            // fs.unlinkSync(ran)
            // }
            client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
            fs.unlinkSync(media)
            fs.unlinkSync(ran)
            })
            })
            .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            .toFormat('webp')
            .save(ran)
            } else {
            reply(`sticker poto :\nKirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim\n\nsticker vidio :\nKirim Vidio atau vidio gif dengan caption ${prefix}stickergif atau tag vidio/vidiogif yang sudah dikirim\n\nNote : \nDurasi video maximal 9 detik`)
            }
            break
					
					
					 case 'musica':
					  if (args.length < 1) return reply('C????????? ??? ??????????? ?????? ????????s?????????')
                reply('????P???????????????????????? ????????s????????..????')
                const play = body.slice(8)
                anu = await fetchJson(`https://api.zeks.xyz/api/ytplaymp3?q=${play}&apikey=italumaster`)
                 infomp3 = `???????????????????????????????????????????????????????????????
???   ?????????s???????? ???????????????????????????!!! ???
????????????????????????????????????????????????????????????
??????\n????????????????: 
?????? ${anu.result.title}\

??????  \n????????????:
?????? ${anu.result.source}
??????\nT????????????????: ${anu.result.size}\

??????\n???????? ????????????? ???s??????????? ??? ?????????????????????? s????? ????????????????????????!!!
 
???????????????????????????????????????????????????????????????
?????? M?????? ??????????????????:
?????? wa.me/554891463194
?????? C??????????????????? ?? IZA-BOT
???????????????????????????????????????????????????????????????`
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
                    client.sendMessage(from, `???????????????????????????????????????????????????????????????
???   ???VELOCIDADE DO BOT ???
????????????????????????????????????????????????????????????
?????? Tempo de resposta:
??????${latensi.toFixed(4)}
?????? C??????????????????? ?? IZA-BOT  
???????????????????????????????????????????????????????????????`, text, {
                        quoted: mek
                    })
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
					case 'totaladm':
					if (!isGroup) return reply(mess.only.group)
					teks = `Lista de admins do grupo *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
					
					case 'tema':	
			  case 'theme':
			  case 'temas':
			if (!isGroup) return reply(`Este comando s?? pode ser usado em grupos`)
cuImg = await getBuffer (`http://2.bp.blogspot.com/-sCQOU3_sDzs/VDtCPxR-O5I/AAAAAAAAIKc/g-NV57_KTkA/s1600/Divers%C3%A3o.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu Tema",}}}, caption: tema(prefix, time, pushname, sender)})
					break
					
					case 'conversa':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('O modo simi ativado')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Ativado com sucesso o modo simi neste grupo ???????')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Desativado modo simi com sucesso neste grupo ???????')
					} else {
						reply('1 para ativar, 0 para desativar, lerdao vc em KKKKK')
					}
					break
					
					case 'diversao':	
			  case 'diversaos':
			  case 'div':
			 
			if (!isGroup) return reply(`Este comando s?? pode ser usado em grupos`)		
cuImg = await getBuffer (`http://2.bp.blogspot.com/-sCQOU3_sDzs/VDtCPxR-O5I/AAAAAAAAIKc/g-NV57_KTkA/s1600/Divers%C3%A3o.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu Diversao",}}}, caption: diversao(prefix, time, pushname, sender)})
					break
					
					 case 'usuario':
                          case 'usu??rio':
			  case 'usuarios':
			  case 'users':
			
			if (!isGroup) return reply(`Este comando s?? pode ser usado em grupos`)
cuImg = await getBuffer (`https://www.pngkey.com/png/full/847-8472374_usurio-do-usurio-de-segurana-icon-icon-matematica.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu do Usuario",}}}, caption: usuario(prefix, sender)})
					break	
					case 'menu':
	                         case 'ajuda':
			         case 'help':
		let palavrasAleatorias = [
'sexo',
'sua m??e ?? minha',
'gay',
			]
	            	uptime = process.uptime ()
                    putagg = fs.readFileSync('./src/capa.jpeg')
                    client.sendMessage(from, putagg, image, {quoted: mek, caption: help(prefix, sender, pushname, time, palavrasAleatorias[Math.floor(Math.random() * palavrasAleatorias.length)])})
                    break
					
					case 'adm':	
			  case 'adms':
			  case 'admins':
			if (!isGroupAdmins) return reply(mess.only.admin)
			if (!isGroup) return reply(`Este comando s?? pode ser usado em grupos`)
cuImg = await getBuffer (`https://img.icons8.com/bubbles/2x/admin-settings-male.png`)
client.sendMessage(from, cuImg, image, {quoted: { key: { participant: `0@s.whatsapp.net`, ...{}}, message: { "imageMessage": { "caption": "Menu Admins",}}}, caption: admins(prefix, sender)})
					break
					
					case 'antilink':

                   	if (!isGroup) return reply(mess.only.group)

					if (!isGroupAdmins && !isOwner) return reply(mess.only.admin)

					if (!isBotGroupAdmins) return reply(mess.only.Badmin)

					if (args.length < 1) return reply('digite 1 para ativar')

					if (Number(args[0]) === 1) {

						if (isAntiBucin) return reply('anti-link est?? ativo ')

						antibucin.push(from)

						fs.writeFileSync('./src/antibucin.json', JSON.stringify(antibucin))

						

						client.sendMessage(from,` Aten????o a todos participante do grupo (*ANTI-LINK*) est?? ativo no grupo, qualquer tipo link sera banido do grupo!!! `, text)

					} else if (Number(args[0]) === 0) {

						if (!isAntiBucin) return reply('O modo Anti-Link foi desativado')

						var ini = antibucin.indexOf(from)


						antibucin.splice(ini, 1)

						fs.writeFileSync('./src/antibucin.json', JSON.stringify(antibucin))

						reply('Desativando anti-link com sucesso neste grupo ??????')

					} else {

						reply('1 para ativar, 0 para desativar')

					}

					break
					
					case 'antipalavrao':
					try {
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isAntiPalavra) return reply('Ja esta ativo')
						antipalavra.push(from)
						fs.writeFileSync('./src/antipalavra.json', JSON.stringify(antipalavra))
						reply('Ativou com sucesso o recurso de antipalavrao neste grupo??????')
					} else if (Number(args[0]) === 0) {
						antipalavra.splice(from, 1)
						fs.writeFileSync('./src/antipalavra.json', JSON.stringify(antipalavra))
						reply('Desativou com sucesso o recurso de anti-palavrao neste grupo??????')
					} else {
						reply('1 para ativar, 0 para desativar')
					}
					} catch {
						reply('Deu erro, tente novamente :/')
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
						reply('Ativou com sucesso o recurso de antifake neste grupo??????')
					} else if (Number(args[0]) === 0) {
						antifake.splice(from, 1)
						fs.writeFileSync('./src/antifake.json', JSON.stringify(antifake))
						reply('Desativou com sucesso o recurso de antifake neste grupo??????')
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
					if (isWelkom) return reply('J?? esta ativo.')
					welkom.push(from)
				    fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
				    reply('Ativou com sucesso o recurso de boas-vindas neste grupo ???????')
					} else if (Number(args[0]) === 0) {
					welkom.splice(from, 1)
					fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
					reply('Desativou com sucesso o recurso de boas-vindas neste grupo ???????')
					} else {
					reply('1 para ativar, 0 para desativar, lerd??o vc em KAKKKK')
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
						mentions(`Ok, chefe. esse cara aqui: @${mentioned[0].split('@')[0]} agora ?? admin do grupo!`, mentioned, true)
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
					text: `Grupo Fechado pelo administrador  @${nomor.split("@s.whatsapp.net")[0]}\n  *S?? Adms Podem mandar mensagem*`,
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
					reply('Obrigado pelo novo perfil????')
					break
					
				   
				case 'regras':
                                    client.updatePresence(from, Presence.composing)
                                    if (!isGroup) return reply(mess.only.group)
                                    ppUrl = await client.getProfilePicture(from) // leave empty to get your own
			            buffer = await getBuffer(ppUrl)
		                    client.sendMessage(from, buffer, image, {quoted: mek, caption: `???????????????????????????????????????????????????????????????
???   ???${groupName}???
????????????????????????????????????????????????????????????
????????????b???????:${groupMembers.length}  
??????????????l ??d?????:${groupAdmins.length}
??????${groupDesc} 

???????????????????????????????????????????????????????????????
?????? M?????? ??????????????????:
?????? wa.me/554891463194
?????? C??????????????????? ?? IZA-BOT
???????????????????????????????????????????????????????????????`})
                                     break	
					
					
					case 'clonar':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Marque a pessoa que voc?? quer clonar\n\n*EXEMPLO:* clone @')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cvk')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`ok , Chefe foto dessa pessoal foi clonada no bot. @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Putz, deu erro, a pessoa deve estar sem foto ????')
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
					
					
				   
			       case 'remover':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('A marca-alvo que voc?? quer remover!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'esse filha da puta n??o cumpriu as regras foi removido :\n'
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
					
					
						
					
					
					// FIIIIIM //
					
					// comando dos dono //
					case 'reiniciar':
if (!isOwner) return reply("quem ?? tu mano")
npm = `npm start`
reply('Reiniciando em alguns segundos...')       
exec(npm, (err, stdout) => {
if(err) return client.sendMessage(from, "Erro", text, {quoted: mek})
if (stdout) {
client.sendMessage(from, stdout, text, {quoted: mek})
} 
})
break
					
					
					case 'aviso':
					if (!isOwner) return reply('Quem ?? Voc??, voc?? n??o ?? meu dono ?????')
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
					if (!isOwner) return reply('s?? o rique pode usar esse comando') 
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Mensagem foi apagada dos grupo com sucesso')
					break
					
					// FIIIIIM //
					
					//jogos para  USUARIO//
					
					case 'cassino':
					
let cassinao = ['????', '????','????']
let resposta1 = cassinao[Math.floor(Math.random() * cassinao.length)]
let resposta2 = cassinao[Math.floor(Math.random() * cassinao.length)]
let resposta3 = cassinao[Math.floor(Math.random() * cassinao.length)]
if(resposta1==resposta2&&resposta2==resposta3){
client.sendMessage(from, `JOGO DO CASSINO:\n\n${resposta1}${resposta2}${resposta3}\n\n*Parab??ns, ${pushname} VOC?? GANHOU*!!!!!`, text, {quoted: mek})
}
else if(resposta1==resposta2||resposta2==resposta3){
client.sendMessage(from, `JOGO DO CASSINO:\n\n${resposta1}${resposta2}${resposta3}\n\n*, Quase Mano_${pushname}_ Quase foi...*`, text, {quoted: mek})
}
else{
client.sendMessage(from, `JOGO DO CASSINO:\n\n${resposta1}${resposta2}${resposta3}\n\n*Voc?? Perdeu _${pushname}_Tururu*`, text, {quoted: mek})
}
break
					
					
					// FIIIIIM //
					
					
					//DIVERS??O USUARIO//
					
					

case 'feios':
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = '????ESSES S??O FEIO DO GRUPO???? \n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `????????????? @${groupMembers[r].jid.split('@')[0]}\n`
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
teks = '*????LISTA DOS PUNHETEIROS DO GRUPO????*\n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `????????????????????????? @${groupMembers[r].jid.split('@')[0]}\n`
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
               hasil = `voc?? ??: * ${random}% *retardado(A)????`
              reply(hasil)
                  break
                    case 'golpe':
              client.updatePresence(from, Presence.composing) 
                random = `${Math.floor(Math.random() * 100)}`
               hasil = `voc?? e : ${random} % do golpe ????\n\nGosta de sentir sentimentos neh ????`
              reply(hasil)
                    break
					
					case 'gadometro':
case 'gado':
var chifre = ["ultra extreme gado", "Gado-Master", "Gado-Rei", "Gado", "Escravo-ceta", "Escravo-ceta Maximo", "Gacorno?", "Jogador De Forno Livre<3", "Mestre Do Frifai<3<3", "Gado-Manso", "Gado-Conformado", "Gado-Incubado", "Gado Deus", "Mestre dos Gados", "Topa tudo por buceta", "Gado Comum", "Mini Gadinho", "Gado Iniciante", "Gado Basico", "Gado Intermediario", "Gado Avan??ado", "Gado Profisional", "Gado Mestre", "Gado Chifrudo", "Corno Conformado", "Corno HiperChifrudo", "MAIOR CHIFRUDO", "Mestre dos Chifrudos"]
var gado = chifre[Math.floor(Math.random() * chifre.length)]
gadop = `${Math.floor(Math.random() * 100)}`
hisil = `Voc?? ??:\n\n${gado}`
reply(hisil)
break

case 'casal':
try{
if(!isGroup) return reply(mess.only.group)
d = []
teks = '???????????????????????????????????????? ???????? ???????????????????????????????????????????\n'
for(i = 0; i < 2; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `??????????????????????????  @${groupMembers[r].jid.split('@')[0]}\n`
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
teks = '*ESSES S??O BICHAS DO GRUPO*\n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `????????? ??? @${groupMembers[r].jid.split('@')[0]}\n`
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
					teks = `${pushname} Esses s??o os cornos do grupo ${groupName}\n@${cornos1.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos2.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos3.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos4.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n@${cornos5.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagemc}\n\n O MOLEQUE ?? BRABO O BOT-RIQUE`
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
teks = ' ????*AS GOSTOSAS DO GRUPO*????\n'
for(i = 0; i < 10; i++) {
r = Math.floor(Math.random() * groupMetadata.participants.length + 0)
teks += `???????????????? @${groupMembers[r].jid.split('@')[0]}\n`
d.push(groupMembers[r].jid)
}
mentions(teks, d, true)
} catch (e) {
console.log(e)
reply('Deu erro, tente novamente :/')
}
break

					
					 
case 'abra??o':

if (!isGroup) return reply(mess.only.group())
if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return 
mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
pro = '.\n'
for (let _ of mentioned) {
pro += `@${_.split('@')[0]}\n`
}
yhb = `Que fofo... ${sender.split("@")[0]} deu um abra??o apertado em @${mentioned[0].split('@')[0]}`
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
					teks = `${pushname} Esses s??o os gays grupo ${groupName}\n@${gays1.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays2.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays3.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays4.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n@${gays5.jid.split('@')[0]}\nCom uma porcentagem de ${porcentagem}\n\n O MOLEQUE BRABO O BOT LENDARIO `
					membr.push(gays1.jid)
					membr.push(gays2.jid)
					membr.push(gays3.jid)
					membr.push(gays4.jid)
					membr.push(gays5.jid)
					mentions(teks, membr, true)
					break
					
					case 'amor':
                if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Marque a pessoa')
				mentidn = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
                ghost = mek.participant
                const mor =['05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58 ','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','92','93','94','95','96','97','98','99','100']
				const am = mor[Math.floor(Math.random() * mor.length)]
				rate = body.slice(1)		
				var kic = `${sender.split("@")[0]}@s.whatsapp.net`		
		     	 reply(`Fazendo probabilidades`)
					data = fs.readFileSync('./integra??ao/shit.js');
                 jsonData = JSON.parse(data);
                 randIndex = Math.floor(Math.random() * jsonData.length);
                 randKey = jsonData[randIndex];
                buffer = await getBuffer(randKey.result)               
                amor = `${pushname} suas chances de ficar com @${mentidn.split('@')[0]} s??o de: ${am}%`
                client.sendMessage(from, buffer, video, {mimetype: 'video/mp4', quoted: mek, caption: amor, contextInfo: {mentionedJid: [mentidn]}})
				break 

//ACABOU A DIVERS??O
		default:
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
				//		console.log(color('[ERRO]','red'), 'Eita bixo, comando n??o registrado', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()		
					
					
				
