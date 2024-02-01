//funções utilitárias
const dotenv = require('dotenv');
const SupportFunctions = require('./supportFunctions.js')
const nodeHtmlToImage = require('node-html-to-image')
const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const supportFunctions = require('./supportFunctions.js');
const fs = require('fs')
const { clear } = require('console');
const { sort } = require('shelljs');
const { spawn } = require('child_process');
dotenv.config()

module.exports = {
	reply: async function (msg, client, authorized) {
		const toLowerBody = msg.body.toLowerCase();

		//função para autorizar um chat
		if(toLowerBody.indexOf("@autorizar") === 0){
			authorize(msg, client)
		}

		//função para recusar o pagamento de um chat
		if(toLowerBody.indexOf("@recusar") === 0){
			rejectPayment(msg, client)
		}

		//baixa e envia os comprovantes/dados das mensagens com o comprovante
		if(toLowerBody === "@validarpix"){
			validarPix(msg, client)
		}
		
		//envia o menu caso algum comando tenha sido executado por um grupo ou usuário não autorizados
		if (!authorized && deadlineMet() && ['@menu', "@sticker", "@stickerbg", "@tts", "ta pago", "tá pago", "ta cago", "tá cago", "@beijo", "@presente"].includes(toLowerBody)) {
			sendDefaultMessage(msg, client)
		}

		//envia o pix do bot
		if(toLowerBody === "@pixbot"){
			sendBotPix(msg)
		}

		//envia o pix do bot
		if(toLowerBody === "@menuadm"){
			sendAdmMenu(msg)
		}
	}
};


//envia a mensagem padrão de chats não autorizados
function sendDefaultMessage(msg){
	let resposta = "Chat não autorizado. Para autorização, digite @autorizar"
	SupportFunctions.addErrorReaction(msg)
	SupportFunctions.simulateTyping(msg, resposta)

}

//envia o pix do bot
function sendBotPix(msg){
	let BOT_SETTINGS = SupportFunctions.getBotSettings()
	SupportFunctions.simulateTyping(msg, "A chave pix do bot é "+BOT_SETTINGS.PIX_BOT)
}

//envia o pix do bot
async function sendAdmMenu(msg){
	//valida se é ADM
	//busca o autor da msg
	const msgAuthor = await SupportFunctions.getAuthor(msg)

	//verifica se o autor da mensgem é um dos administradores do bot
	let isAdm = SupportFunctions.getBotAdmins().includes(msgAuthor)

	if(!isAdm){
		SupportFunctions.addErrorReaction(msg)

		SupportFunctions.simulateTyping(msg, "Usuário não autorizado")
		return
	}

	let resposta = "Comandos para adms:"
	resposta += "\n\n✅ *@autorizar* -> Autoriza um grupo"
	resposta += "\n\n✅ *@autorizar <numero> <nome>* -> Autoriza um usuário especifico (numero deve ser completo, com DDI e sem o 9 extra)"

	SupportFunctions.simulateTyping(msg, resposta)
}

//autoriza um grupo/chat
async function authorize(msg, client){
	//valida se é ADM
	//busca o autor da msg
	const msgAuthor = await SupportFunctions.getAuthor(msg)

	//verifica se o autor da mensgem é um dos administradores do bot
	let isAdm = SupportFunctions.getBotAdmins().includes(msgAuthor)

	//se não for, envia o tutorial de autorização
	if(!isAdm){
		let BOT_SETTINGS = SupportFunctions.getBotSettings()

		let resposta = '❗❗❗ Para arcar com os custos de operação do sistema, *apenas usuários/chats autorizados poderão utilizar o robô.* ❗❗❗'
		resposta += "\n\n- Um grupo ou usuário se tornarão autorizados e poderão utilizar todas as funções do bot através de um pagamento único. Para usuários, será cobrado um valor de *10 reais* e, para grupos, *25 reais.*"
		resposta += "\n\n- O pagamento deve ser enviado via pix para a chave *_"+BOT_SETTINGS.PIX_BOT+"_* e deverá ser *validado* para que a autorização ocorra." 
		resposta += "\n\n- Para validar um pagamento, enviar o comprovante *COMO IMAGEM* no chat que deseja autorizar e utilizar o comando @validarPix (como legenda da foto ou mencionando a mensagem do comprovante)."
		resposta += "\n\n- A validação é feita manualmente, então favor aguardar até a análise ser concluída." 
		resposta += "\n\n- Quando a análise for finalizada, uma mensagem de confirmação será enviada e as funções funcionarão normalmente." 
		resposta += "\n\nCaso necessário, entre em contato pelo direct do instagram: instagram.com/"+BOT_SETTINGS.BOT_INSTAGRAM

		SupportFunctions.simulateTyping(msg, resposta)
		return
	}

	//se a mensagem tiver outra mensagem mencionada, é uma autorização indireta (a partir de um comprovante pix, por ex)
	let struct
	let responseToChat = false;
	if(msg.hasQuotedMsg){
		let quotedMessage = await msg.getQuotedMessage()
		try{
			struct = JSON.parse(quotedMessage.body)
			if(!struct.chatId){
				console.log('Chat id não encontrado')
				throw "error"
			}

			responseToChat = true
		}catch(e){
			SupportFunctions.addErrorReaction(msg)
			SupportFunctions.simulateTyping(msg, "Não foi possível obter os dados de autorização")
			return
		}
	//se a mensagem tiver um numero, autorizar o numero indiretamente
	}else if(msg.body.toLowerCase().indexOf("@autorizar ") === 0){
		struct = {}
		//quebra a mensagem e ignora os espaços vazios
		let msgSplit = msg.body.toLowerCase().split(' ').filter(param => param);

		//o primeiro parâmetro é o número
		let number = msgSplit[1]
		struct.chatId = number

		//a partir do segundo é o nome
		struct.chatName = msgSplit.splice(2).join(' ') || 'Número genérico'
	}

	//se tiver struct sem chat id, deu erro na hora de pegar os params 
	if(struct && !struct.chatId){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg, "Não foi possível obter os parametros de autorização")
		return
	}


	//se for, autorizar
	let authorize = await supportFunctions.authorizeChat(msg, struct)

	if(authorize){
		SupportFunctions.addMsgReaction(msg, '✅')
		SupportFunctions.simulateTyping(msg, "Chat autorizado")

		//enviar resposta pro chat de origem
		if(struct && responseToChat){
			SupportFunctions.sendMessage(client, msg, "✅ Chat autorizado.", null, false, null, null, null, null, null, struct.chatId)
		}
	}else{
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg, "Chat já autorizado")
	}
}

//recusa a validação do pagamento de um grupo/chat
async function rejectPayment(msg, client){
	//valida se é ADM
	//busca o autor da msg
	const msgAuthor = await SupportFunctions.getAuthor(msg)

	//verifica se o autor da mensgem é um dos administradores do bot
	let isAdm = SupportFunctions.getBotAdmins().includes(msgAuthor)
	if(!isAdm){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg, "Usuário não autorizado")
		return
	}

	//se a mensagem tiver outra mensagem mencionada, é uma autorização indireta (a partir de um comprovante pix, por ex)
	let struct

	//valida que existe uma mensagem mencionada
	if(msg.hasQuotedMsg){
		let quotedMessage = await msg.getQuotedMessage()
		try{
			struct = JSON.parse(quotedMessage.body)
			if(!struct.chatId){
				console.log('Chat id não encontrado')
				throw "error"
			}
		}catch(e){
			SupportFunctions.addErrorReaction(msg)
			SupportFunctions.simulateTyping(msg, "Não foi possível obter os dados da mensagem de validação")
			return
		}
	}else{
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg, "Mencione uma mensagem para recusar o pagamento")
		return
	}


	//envia a mensagem com a justificativa
	let justificativa = msg.body.slice(msg.body.indexOf(' ')+1)
	if(struct){
		try{
			SupportFunctions.sendMessage(client, msg, "❌ Validação recusada. Motivo: "+justificativa, null, false, null, null, null, null, null, struct.chatId)
			SupportFunctions.simulateTyping(msg, "Resposta enviada.")
		}catch(e){
			SupportFunctions.simulateTyping(msg, "Erro ao enviar a resposta.")
			console.log(e)
		}

	}
}

//encaminha uma imagem (em teoria um comprovante) e os dados do chat para um chat específico
async function validarPix(msg, client){
	//configurações do bot
	const BOT_SETTINGS = SupportFunctions.getBotSettings()
	
	//valida se o chat já foi autorizado (o segundo parametro indica que a validação deve ser feita apenas para o chat, então se a mensagem for enviada por um usuário autorizado (ou adm) em um chat não autorizado a função retorna false)
	let authorized = supportFunctions.validateChat(msg, true)
	if(authorized){
		SupportFunctions.simulateTyping(msg, "Chat já autorizado")
		return
	}

	//carrega o id do chat de validação das configurações e monta os parametros da mensagem
	const validationChat = supportFunctions.getBotSettings().PIX_VALIDATION_CHAT
	let from = msg.from
	let author = msg.author || msg.from
	let rootPath = path.join(__dirname, '../utils/comprovantes/')
	let targetMessage = msg
	let type = from === author ? 'individual' : 'group'



	//se a mensagem estiver mencionando outra mensagem, é necessário fazer o download da outra mensagem
	if (msg.hasQuotedMsg) {
		try{
			targetMessage = await msg.getQuotedMessage()
		}catch(e){
			SupportFunctions.simulateTyping(msg, 'Não foi possível obter os dados da mensagem mencionada.')

			SupportFunctions.addErrorReaction(msg)
			return
		}
	}
		
	//se a mensagem mencionada tiver midia
	if (targetMessage && targetMessage.hasMedia) {
		try {
			//tenta baixar a midia da mensagem mencionada
			const attachmentData = await targetMessage.downloadMedia();

			//caso, por algum motivo, a midia não tenha sido baixada corretamente
			if (!attachmentData) {
				SupportFunctions.sendMessage(client, msg, 'Não foi possível baixar a imagem selecionada no momento. Tente reenviá-la')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
				return;
			}

			//caso o formato da mídia não seja suportado
			if (attachmentData.mimetype !== 'image/jpeg') {
				SupportFunctions.sendMessage(client, msg, 'O comprovante enviado deve ser uma imagem')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)

			//salva a imagem e envia pro grupo
			} else {
				try{
					//pega o base64 da imagem
					let baseString = attachmentData.data
					
					//transforma em binários
					const binaryData = Buffer.from(baseString, 'base64');

					let folderPath = rootPath+from

					if(!fs.existsSync(folderPath)){
						fs.mkdirSync(folderPath)
					}

					//define o caminho da imagem de acordo com o id do chat
					const imagePath = folderPath+'/Comprovante - '+from+'.jpg'
					const dataPath = folderPath+'/Dados - '+from+'.json'

					//salva o arquivo da imagem no diretório
					fs.writeFileSync(imagePath, binaryData, (err) => {
						if (err) {
							console.log('Erro ao salvar o arquivo')
							throw "Erro ao salvar o arquivo."
						}
					})

					//dados do chat
					let data = await SupportFunctions.getMsgData(msg)

					
					let struct = {
						"type": type,
						"date": new Date().toLocaleString('Pt-br'),
						"chatId": from,
						"author": author,
						"chatName": data.chat.name,
						"msgId": msg.id
					}

					//salva os dados da mensagem e do chat no diretório
					const contentString = JSON.stringify(struct)
		 			fs.writeFileSync(dataPath, contentString)


					//envia a mensagem de comprovante 
					SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(imagePath), JSON.stringify(struct), false, null, null, null, null, null, validationChat)

					//responde a mensagem do chat
					SupportFunctions.simulateTyping(msg, "Comprovante enviado. Aguarde a validação do pagamento, que é manual e pode demorar um tempo. Você será notificado quando a validação for concluída")

				}catch(e){
					console.log(e)
					SupportFunctions.sendMessage(client, msg, 'Não foi possível enviar o comprovante no momento. Caso necessário, entre em contato pelo direct do instagram: instagram.com/'+BOT_SETTINGS.BOT_INSTAGRAM)

					//reage à msg
					SupportFunctions.addErrorReaction(msg)
				}
			}

		} catch (err) {
			console.log(err)
			SupportFunctions.sendMessage(client, msg, 'Não foi possível enviar o comprovante no momento. Caso necessário, entre em contato pelo direct do instagram: instagram.com/'+BOT_SETTINGS.BOT_INSTAGRAM)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
		}

		//se não tiver, retornar a mensagem de erro
	} else if (targetMessage && !targetMessage.hasMedia) {
		SupportFunctions.sendMessage(client, msg, 'A mensagem não possui mídia.')

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
	}

	
}

function deadlineMet(){
	let deadLine = new Date('02-06-2024')
	let today = new Date()
	return today.getTime() >= deadLine.getTime()
}