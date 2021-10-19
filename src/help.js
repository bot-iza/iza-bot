const help = (prefix, sender, pushname, time, frasealeatoria) => {

	return ` 
┏━━━━━━━━━━━━━━━━━━━━
┃─────〘IZA-BOT〙────
┃━━━━━━━━━━━━━━━━━━━━
┠⊷ nome: ${pushname}
┠⊷ numéro wa.me/${sender.split("@")[0]}   
┠⊷ tempo ativo: ${kyun(uptime)}
┠⊷ Velocidade: ${process.uptime()}  
┠⊷ Data e hora: ${time}   
┠⊷ frase: ${frasealeatoria}
┗━━━━━━━━━━━━━━━━━━━━  
 ┏━━━━━━━━━━━━━━━━━━━━
 ┃─────〘 MENU 〙─────
 ┗━━━━━━━━━━━━━━━━━━━━
┏━━━━━━━━━━━━━━━━━━━━          
┠⊷ ${prefix}admins                    
┠⊷ ${prefix}usuario   
┠⊷ ${prefix}diversao
┠⊷ ${prefix}tema
┠⊷ ${prefix}izabot
┗━━━━━━━━━━━━━━━━━━━━
 ┏━━━━━━━━━━━━━━━━━━━━
 ┃─────〘IZA-BOT〙─────
 ┗━━━━━━━━━━━━━━━━━━━━ 

      `
function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var Horas = Math.floor(seconds / (60*60));
  var Minutos = Math.floor(seconds % (60*60) / 60);
  var Segundos = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(Horas)} Horas ${pad(Minutos)} Minutos ${pad(Segundos)} Segundos`
}
}
exports.help = help
