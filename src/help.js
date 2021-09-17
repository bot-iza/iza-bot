const help = (prefix) => {
	return ` *Comandos de figu* <

 comando: *${prefix} sticker* 
 desc: converter imagem / gif / vídeo em adesivo
 uso: responder imagem / gif / vídeo ou enviar imagem / gif / vídeo com legenda\n

 comando: *${prefix} sticker nobg*
 desc: converte imagem em adesivo enquanto remove o fundo
 uso: responder imagem ou enviar imagem com legenda\n

 comando: *${prefix} toimg*
 desc: converter sticker em imagem
 uso: adesivo de resposta\n

 comando: *${prefix} tsticker*
 desc: converter texto em adesivo
 uso: *${prefix} texto tsticker aqui*\n

 > *Comandos Meme* <

 comando: *${prefix} meme*
 desc: imagens aleatórias de meme [inglês]
 uso: basta enviar o comando\n

 comando: *${prefix} memeindo*
 desc: imagens aleatórias de meme [indo]
 uso: basta enviar o comando\n

 > *Outros comandos* <

 comando: *${prefix} gtts*
 desc: converter texto em fala / áudio
 uso: *${prefix} gtts [cc] [texto]* \ nexemplo: *${prefix} gtts ja On2-chan*/n

 comando: *${prefix} loli*
 desc: imagens aleatórias de loli
 uso: basta enviar o comando\n

 comando: *${prefix} nsfwloli*
 desc: imagens aleatórias de nsfw loli
 uso: basta enviar o comando\n

 comando: *${prefix} url2img*
 desc: faz capturas de tela da web
 uso: *${prefix} url2img [type] [url]*\n

 comando: *${prefix} simi*
 desc: sua mensagem será respondida por simi
 uso: *${prefix} simi yourmessage*\n

 comando: *${prefix} ocr*
 desc: tira o texto da imagem
 uso: responder imagem ou enviar imagem com legenda\n

 comando: *${prefix} wait*
 desc: pesquisar anime com imagem 
 uso: responder imagem ou enviar imagem com legenda\n
 comando: *${prefix} setprefix*
 desc: substituir prefixo
 uso: *${prefix} setprefix [texto | opcional]*\n
 nota: este comando só pode ser usado pelo proprietário do bot\n

 > *Comandos de Grupo* <

 comando: *${prefix} add*
 desc: adicionar membro ao grupo
 uso: *${prefix} add 5528xxxxx*\n
 observação: só pode ser usado quando o bot se torna admin e quem envia o comando é admin!\n

 comando: *${prefix} kick*
 desc: expulsar membros do grupo
 uso: *${prefix} kick @ tagmember*\n
 observação: só pode ser usado quando o bot se torna admin e quem envia o comando é admin!\n

 comando: *${prefix} promova*
 desc: tornar o membro do grupo como administrador do grupo
 uso: *${prefix} promote @ tagmember*\n
 observação: só pode ser usado quando o bot se torna admin e quem envia o comando é admin!\n

 comando: *${prefix} demote*
 desc: tornar o administrador do grupo como membro do grupo
 uso: *${prefix} demote @ tagmember*\n
 observação: só pode ser usado quando o bot se torna admin e quem envia o comando é admin!\n

 comando: *${prefix} linkgroup*
 desc: pegue o link do grupo
 uso: basta enviar o comando
 observação: só pode ser usado quando o bot se torna admin e quem envia o comando é admin!\n

 comando: *${prefix} leave*
 desc: Faça o bot sair do grupo
 uso: basta enviar o comando
 nota: só pode ser usado por administradores de grupo e proprietário do bot\n

 comando: *${prefix} tagall*
 desc: marca todos os membros do grupo, incluindo administradores também
 uso: basta enviar o comando
 nota: este comando pode ser usado se você for um administrador de grupo\n

 comando: *${prefix} simih*
 desc: ativa o modo simi no grupo
 uso: *${prefix} simih 1* para ativar o modo simi e *${prefix} simih 0* para desativar o modo simi
 nota: este comando pode ser usado se você for um administrador de grupo\n

BOT INTEIRAMENTE EDITÁVEL FEITO POR TRASHDK E CAUSS
TRASHDK*https://youtube.com/channel/UCOqlFzRrB8IZUWUx1cwCeUw*

CAUSS*https://youtube.com/c/caussZ*

Numero do TrashDk:*http://WA.me/558494740630*
`
}

exports.help = help
