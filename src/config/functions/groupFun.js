//funções utilitárias
const dotenv = require('dotenv');
const SupportFunctions = require('./supportFunctions.js');
// const { MessageMedia } = require('whatsapp-web.js');
// const path = require('path');
dotenv.config()

module.exports = {
	reply: async function (msg, client){	
		const toLowerBody = msg.body.toLowerCase();
		
		//roleta russa
		if(toLowerBody ==="@roletarussa"){
			roletaRussa(msg)
		}

		//transa, casa e mata
		if(toLowerBody === '@tcm') {
			tcm(msg, client)
		}

		//sorteia um presente
		if(toLowerBody === '@presente'){
			presente(msg, client)
		}

		//barraca do beijo
		if(toLowerBody === '@beijo'){
			beijo(msg, client)
		}

		//sexo
		if(toLowerBody === '@sexo'){
			sexo(msg, client)
		}

		//verdadeOuConsequencia
		if(toLowerBody === '@verdadeouconsequencia' || toLowerBody === '@vddoucons') {
			vddOuCons(msg, client)
		}

		//sorteio
		if(toLowerBody.indexOf('@sorteio') === 0){
			sorteio(msg, client)
		}

    }
};


//1/6 de chance de kickar o autor da msg do grupo
async function roletaRussa(msg){
	//adicionando à contagem
    SupportFunctions.count('roletaRussa')
	

	//busca dados do chat
	const chat = await msg.getChat()

	//valida que é grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
		return;
	}

	//se o autor da msg for o criador do grupo, n dá pra remover
	let sudo = await SupportFunctions.isSudo(msg, chat);
	if(sudo){
		SupportFunctions.simulateTyping(msg,'Não é possível remover o criador do grupo',null, null, null, true);
		return;
	}

	//valida que o bot é admin do grupo
	let admins = await SupportFunctions.checkAdmins(msg, chat);
	if(!admins.bot){
		SupportFunctions.simulateTyping(msg, "Eu preciso ser admin do grupo para poder executar o comando",null, null, null, true)
		return
	}
	
	//sorteia um número de 0 a 5
	let sorteado = SupportFunctions.getRandomInt(6)

	//se for 5, tira o autro da msg do grupo
	if(sorteado === 5){
		msg.reply("You're fired!")
		SupportFunctions.addMsgReaction(msg, '🔥')
		const author = await msg.getContact()
		await chat.removeParticipants([author.id._serialized])

	//se não, envia alguma mensagem aleatória
	}else{
		const replies = ["Nada acontece, feijoada", "Não foi dessa vez", 'Quase....', 'Cagou demais', 'Da próxima vai']
		
		SupportFunctions.simulateTyping(msg, replies[sorteado],null, null, null, true)

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
	}
		
}

//transa, casa ou mata
async function tcm(msg, client){

	//adicionando à contagem
    SupportFunctions.count('tcm')
	
	//busca dados do chat e valida que é um grupo
	const chat = await msg.getChat()
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//sorteia 3 participantes do grupo (excluindo o autor e o bot)
	const participants = await SupportFunctions.getParticipants(msg, chat, client, 3)
	//se retornar false é pq o número de participantes é insuficiente
	if(!participants){
		SupportFunctions.simulateTyping(msg,"Número de participantes insuficiente",null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	

	//monta o texto
	let text = `Transa: @${participants[0].id} ` + `\nCasa: @${participants[1].id}` + `\nMata: @${participants[2].id}`;

	//as mentions são os contatos dos participantes sorteados
	let mentions = participants.map(part => part.contact);


	//simula digitação e envia a msg
	SupportFunctions.simulateTyping(msg, text, 3, chat, mentions, true)
}

//sorteia um presente
async function presente(msg, client){
	//adicionando à contagem
    SupportFunctions.count('presente')
	
	//busca as informações do chat
	const chat = await msg.getChat()

	//sorteia um presente aleatório
	let presente = SupportFunctions.getPresente()

	//se tiver em um grupo
	if(chat.isGroup){
		//pega um participante aleatório (excluindo o bot e o autor)
		let selected = await SupportFunctions.getParticipants(msg, chat, client, 1, true)

		//adiciona o participante selecionado no array de mentions
		var mentions = [selected[0].contact]

		//monta a msg e envia
		let text = `@${selected[0].id}` + " te deu "+ presente;
		SupportFunctions.simulateTyping(msg, text, 3, chat, mentions, true)
		
	//se for chat individual
	}else{
		let text = 'Você ganhou '+ presente
		SupportFunctions.simulateTyping(msg, text,null, null, null, true)
	}
}

//barraca do beijo
async function beijo(msg, client){
	//adicionando à contagem
    SupportFunctions.count('beijo')


	//valida que é um grupo
	const chat = await msg.getChat()
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, 'Este comando só está disponível para grupos',null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return;
	}

	//busca dados do autor da msg
	const sender = await SupportFunctions.getAuthor(msg, true)

	//pega um participante aleatório (excluindo o bot e o autor)
	let selected = await SupportFunctions.getParticipants(msg, chat, client, 1, true)

	//adiciona o sender e o participante selecionado no array de mentions
	var mentions = [sender, selected[0].contact]

	//monta a msg e envia
	let text = `@${sender.id.user}` + " quer dar uns pega em "+ `@${selected[0].id}`;
	SupportFunctions.simulateTyping(msg, text, 3, chat, mentions, true)
	

	//TO-DO
	let pic = getPartPics(mentions, chat)
	if(pic){
		let picPath = path.join(__dirname, '/imgs/barraca do beijo/'+pic)
		client.sendMessage(msg.from, MessageMedia.fromFilePath(picPath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
	}
		
}

//sexo
async function sexo(msg, client){
	//adicionando à contagem
    SupportFunctions.count('beijo')


	//valida que é um grupo
	const chat = await msg.getChat()
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, 'Este comando só está disponível para grupos',null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return;
	}

	//busca dados do autor da msg
	const sender = await SupportFunctions.getAuthor(msg, true)

	//pega um participante aleatório (excluindo o bot e o autor)
	let selected = await SupportFunctions.getParticipants(msg, chat, client, 1)

	if(!selected){
		SupportFunctions.simulateTyping(msg,"Número de participantes insuficiente",null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//adiciona o sender e o participante selecionado no array de mentions
	var mentions = [sender, selected[0].contact]



	//monta a msg e envia
	let options = ['dar para', 'comer']
	let text =`@${sender.id.user}` + " quer "+options[SupportFunctions.getRandomInt(2)]+ ` @${selected[0].id}`;
	SupportFunctions.simulateTyping(msg, text, 3, chat, mentions, true)
	


	//TO-DO
	let pic = getPartPics(mentions, chat)
	if(pic){
		let picPath = path.join(__dirname, '/imgs/barraca do beijo/'+pic)
		client.sendMessage(msg.from, MessageMedia.fromFilePath(picPath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
	}
		
}

//Verdade ou consequencia
async function vddOuCons(msg, client){
	//adicionando à contagem
    SupportFunctions.count('vddOuCons')

	//valida que é grupo
	const chat = await msg.getChat()
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, 'Comando disponível apenas para grupos.',null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//pega dois participantes aleatório (excluindo o bot)
	let selected = await SupportFunctions.getParticipants(msg, chat, client, 2, false, true)
	if(!selected){
		SupportFunctions.simulateTyping(msg,"Número de participantes insuficiente",null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//monta a msg e envia
	let mentions = selected.map(sel => sel.contact);
	let text = `Pergunta: @${selected[0].id} ` + `=> Responde: @${selected[1].id}`;
	SupportFunctions.simulateTyping(msg, text, null, chat, mentions, true)
}

//sorteia um membro do grupo
async function sorteio(msg, client){
	//busca dados do chat
	const chat = await msg.getChat()
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, 'Este comando só está disponível para grupos',null, null, null, true)
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return;
	}

	let selected
	if(msg.mentionedIds && msg.mentionedIds.length > 0){
		if(msg.mentionedIds.length === 1){
			SupportFunctions.simulateTyping(msg,"Mencione mais de um participante para fazer o sorteio",null, null, null, true)
			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}

		//seleciona uma pessoa da lista de mencionados
		selected = SupportFunctions.randomPick(msg.mentionedIds, 1)

		//busca o contato pra mencionar 
		let contact = await client.getContactById(selected)

		//monta a mensagem de resposta
		let text = `Membro sorteado: @${SupportFunctions.formatNumber(selected[0])} `;
		
		//monta as mentions e envia a msg
		let mentions = [contact];
		SupportFunctions.simulateTyping(msg, text, null , chat, mentions, true)
		return
	}else{
		//pega um participante aleatório (excluindo o bot)
		selected = await SupportFunctions.getParticipants(msg, chat, client, 1, false, true)
		if(!selected){
			SupportFunctions.simulateTyping(msg,"Número de participantes insuficiente",null, null, null, true)
			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}
	}

	//monta a mensagem e envia
	let text = `Membro sorteado: @${selected[0].id} `;
	let mentions = selected.map(sel => sel.contact);
	SupportFunctions.simulateTyping(msg, text, null , chat, mentions, true)
}

//TO-DO
function getPartPics(){
	return false
}