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
	reply: async function (msg, client) {
		const toLowerBody = msg.body.toLowerCase();

		//devTools
		//loga os dados de uma msg
		if(toLowerBody === "@log"){
			SupportFunctions.log(msg)
		}

		//envia os stats do bot
		if(["@stats", "@statsfull"].includes(toLowerBody)){
			botStats(msg)
		}

		if(toLowerBody === "@bckp"){
			SupportFunctions.backup(msg)
		}

		//=================//



		//envia o menu
		if (toLowerBody.indexOf("@menu") === 0) {
			sendMenu(msg, client);
		}
		
		//envio de sticker
		if (toLowerBody === "@sticker" || toLowerBody === "stck") {
			await sendSticker(msg, client);
		}

		//remoção de fundo de sticker
		if (toLowerBody === "@stickerbg" || toLowerBody === "stckbg") {
			await removeBg(msg, client, true);
		}

		//remoção de fundo
		if (toLowerBody === "@bg") {
			await removeBg(msg, client);
		}

		//transforma texto em sticker
		if (toLowerBody.indexOf('@tts') == 0) {
			TTs(msg, client)
		}

		//roda um numero aleatório
		if (SupportFunctions.checkD$structure(toLowerBody)) {
			diceRoll(msg)
		}

		//funções tá pago
		//valida se algum trigger de tá pago foi disparado pela mensagem
		let taPagoTrigger = SupportFunctions.validateTaPagoTrigger(toLowerBody)
		if (taPagoTrigger) {
			switch (taPagoTrigger.function) {
				case 'add':
					taPago(msg, client, taPagoTrigger.settings)
					break;

				case 'todays':
				case 'missing':
					pagosDoDia(msg, client, taPagoTrigger.settings, taPagoTrigger.function)
					break;

				case 'user':
					userTaPago(msg, taPagoTrigger.settings)
					break;

				case 'ranking':
					rankingTaPago(msg, client, taPagoTrigger.settings, taPagoTrigger.function)
					break;
				case 'lastWeek':
				case 'sorteio':
					lastWeekTaPago(msg, client, taPagoTrigger.settings, taPagoTrigger.function)
					break;
				case 'menu':
					printTaPagoMenu(msg, taPagoTrigger.settings)
					break;
				default:
					break;
			}
		}

		//manda as opções de tá pago
		if(toLowerBody === "@tapagooptions"){
			sendTaPagoOptions(msg)
		}

		//funções tá configurações de usuário
		//valida se algum trigger de tá pago foi disparado pela mensagem
		let userSettingsTrigger = SupportFunctions.validateUserSettingsTrigger(toLowerBody)
		if (userSettingsTrigger) {
			switch (userSettingsTrigger.function) {
				case 'add':
					updateUserKeys(msg, userSettingsTrigger.settings)
					break;
				case 'delete':
					deleteUserKeys(msg, userSettingsTrigger.settings)
					break;
				case 'clear':
					clearUserKeys(msg, userSettingsTrigger.settings)
					break;
				case 'all':
					printAllParticipantsKey(msg, userSettingsTrigger.settings, client)
					break;
				case 'user':
					printUserKey(msg, userSettingsTrigger.settings, client)
					break;
				case 'author':
					printauthorKey(msg, userSettingsTrigger.settings)
					break;
				case 'menu':
					printKeyMenu(msg, userSettingsTrigger.settings)
					break;
				default:
					break;
			}
		}

		//gera um jogo de loteria
		if(toLowerBody === "@loteria"){
			generateLotterySet(msg)
		}

	}
};

//envia as opções de tá pago cadastradas
async function sendTaPagoOptions(msg){
	//busca as configurações de tá pago do bot. Isso vai servir pra puxar os identificadores de cada registro
	let settings = SupportFunctions.getBotSettings().TA_PAGO_SETTINGS
	let taPagoMenuOptions = settings.filter(sett => !sett.PRIVATE).map(sett => sett.MENU_TRIGGERS[0])

	let menuTaPagoOptions = "Existem várias opções de _tá pago_ disponíveis. Para exibir os comandos específicos de cada uma, utilize um dos comandos a seguir: \n\n"
		menuTaPagoOptions += taPagoMenuOptions.join('\n')
	
	SupportFunctions.simulateTyping(msg, menuTaPagoOptions)
}

//remove o fundo de uma imagem e a envia (como sticker ou n)
async function removeBg(msg, client, isSticker){
	
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//adicionando à contagem
	SupportFunctions.count('stickerBg')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//definindo qual imagem usar
	let imageIndex = SupportFunctions.increaseBackgroundCount()

	//inicia a variável que irá definir se a função foi bem sucedida ou não
	let success = false;

	//se a mensagem estiver mencionando outra mensagem, é necessário fazer o download da outra mensagem
	if (msg.hasQuotedMsg) {
		const quotedMessage = await msg.getQuotedMessage()
		
		//se a mensagem mencionada tiver midia
		if (quotedMessage && quotedMessage.hasMedia) {
			try {
				//tenta baixar a midia da mensagem mencionada
				const attachmentData = await quotedMessage.downloadMedia();

				//caso, por algum motivo, a midia não tenha sido baixada corretamente
				if (!attachmentData) {
					SupportFunctions.sendMessage(client, msg, 'Não foi possível baixar a imagem selecionada no momento. Tente reenviá-la')

					//reage à msg
					SupportFunctions.addErrorReaction(msg)
					return;
				}

				//caso o formato da mídia não seja suportado
				if (attachmentData.mimetype !== 'image/jpeg') {
					SupportFunctions.sendMessage(client, msg, 'Selecione uma imagem para remover o fundo')

					//reage à msg
					SupportFunctions.addErrorReaction(msg)

				//envia a midia em formato de sticker ou como imagem
				} else {
					SupportFunctions.simulateTyping(msg, 'Um momento...', 1, null, null, true)
					try{
						//pega o base64 da imagem
						let baseString = attachmentData.data
						
						//transforma em binários
						const binaryData = Buffer.from(baseString, 'base64');
	
						//define o caminho da imagem de acordo com o indice
						const filePath = path.join(__dirname, '../imgs/background_remover/1.Origem('+imageIndex+').jpg')
	
						//cria o arquivo da imagem no diretório
						fs.writeFile(filePath, binaryData, (err) => {
							if (err) {
								console.log('Erro ao salvar o arquivo')
								throw "Erro ao salvar o arquivo."
							}
						});
	
						//define o caminho do arquivo em python
						let pyPath = path.join(__dirname, './background_remover.py')
						
						//inicia o processo em python
						const pythonProcess = spawn('python', [pyPath, imageIndex]);
	
						//tratamento de erro
						pythonProcess.stderr.on('data', (data) => {
							// Caso algo tenha dado errado
							console.error(`Python Error: ${data}`);
							throw "Erro ao processar o arquivo"
						});
						
						//ao final do processamento
						pythonProcess.on('close', (code) => {
							//monta o caminho da imagem processada, de acoro com o indice
							let imagePath = path.join(__dirname, '../imgs/background_remover/2.Processado('+imageIndex+').png')
	
							//envia a imagem de resposta
							SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(imagePath), null, isSticker, SupportFunctions.getMsgId(msg), BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT)
							success = true
						});

					}catch(e){
						console.log(e)
						SupportFunctions.sendMessage(client, msg, 'Não foi possível remover o fundo no momento')

						//reage à msg
						SupportFunctions.addErrorReaction(msg)
					}
				}

			} catch (err) {
				console.log(err)
				SupportFunctions.sendMessage(client, msg, 'Não foi possível remover o fundo no momento')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
			}

			//se não tiver, retornar a mensagem de erro
		} else if (quotedMessage && !quotedMessage.hasMedia) {
			SupportFunctions.sendMessage(client, msg, 'A mensagem selecionada não possui mídia.')

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
		}

	//caso a própria mensagem tenha mídia
	}else if (msg.hasMedia) {
		try {
			//tenta baixar a midia da mensagem
			const attachmentData = await msg.downloadMedia();

			//caso, por algum motivo, a midia não tenha sido baixada corretamente
			if (!attachmentData) {
				SupportFunctions.sendMessage(client, msg, 'Não foi possível baixar a imagem no momento. Tente reenviá-la')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
				return;
			}

			//caso o formato da mídia não seja suportado
			if (attachmentData.mimetype !== 'image/jpeg') {
				SupportFunctions.sendMessage(client, msg, 'Selecione uma imagem para remover o fundo.')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)

				//envia a imagem 
			} else {
				SupportFunctions.simulateTyping(msg, 'Um momento...', 1, null, null, true)
				try{
					//pega o base64 da imagem
					let baseString = attachmentData.data
						
					//transforma em binários
					const binaryData = Buffer.from(baseString, 'base64');

					//define o caminho da imagem de acordo com o indice
					const filePath = path.join(__dirname, '../imgs/background_remover/1.Origem('+imageIndex+').jpg')

					//cria o arquivo da imagem no diretório
					fs.writeFile(filePath, binaryData, (err) => {
						if (err) {
							console.log('Erro ao salvar o arquivo')
							throw "Erro ao salvar o arquivo."
						}
					});

					//define o caminho do arquivo em python
					let pyPath = path.join(__dirname, './background_remover.py')
					
					//inicia o processo em python
					const pythonProcess = spawn('python', [pyPath, imageIndex]);

					//tratamento de erro
					pythonProcess.stderr.on('data', (data) => {
						// Caso algo tenha dado errado
						console.error(`Python Error: ${data}`);
						throw "Erro ao processar o arquivo"
					});
					
					//ao final do processamento
					pythonProcess.on('close', (code) => {
						//monta o caminho da imagem processada, de acoro com o indice
						let imagePath = path.join(__dirname, '../imgs/background_remover/2.Processado('+imageIndex+').png')

						//envia a imagem de resposta
						SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(imagePath), null, isSticker, SupportFunctions.getMsgId(msg), BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT)
						success = true
					});

				}catch(e){
					console.log(e)
					SupportFunctions.sendMessage(client, msg, 'Não foi possível remover o fundo no momento')

					//reage à msg
					SupportFunctions.addErrorReaction(msg)
				}
			}
		} catch (err) {
			console.log(err)
			SupportFunctions.sendMessage(client, msg, 'Não foi possível remover o fundo no momento')

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
		}

		//caso não exista midia na mensagem ou na mensagem mencionada
	} else {
		SupportFunctions.sendMessage(client, msg, "Para remover o fundo, envie uma imagem com a legenda '@stickerbg' ou '@bg' ou envie '@stickerbg' ou '@bg' mencionando uma mensagem com a imagem")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
	}

	//se o comando foi bem sucedido, adicionar à contagem do usuário
	if(success){
		SupportFunctions.checkUserBotUsage(data)
	}
}


//função responsável por fazer os stickers
async function sendSticker(msg, client) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//adicionando à contagem
	SupportFunctions.count('sticker')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//inicia a variável que irá definir se a função foi bem sucedida ou não
	let success = false;

	//se a mensagem estiver mencionando outra mensagem, é necessário fazer o download da outra mensagem
	if (msg.hasQuotedMsg) {
		const quotedMessage = await msg.getQuotedMessage()
		//se a mensagem mencionada tiver midia
		if (quotedMessage && quotedMessage.hasMedia) {
			try {
				//tenta baixar a midia da mensagem mencionada
				const attachmentData = await quotedMessage.downloadMedia();

				//caso, por algum motivo, a midia não tenha sido baixada corretamente
				if (!attachmentData) {
					SupportFunctions.sendMessage(client, msg, 'Não foi possível baixar a imagem selecionada no momento. Tente reenviá-la')

					//reage à msg
					SupportFunctions.addErrorReaction(msg)
					return;
				}

				//caso o formato da mídia não seja suportado
				if (attachmentData.mimetype !== 'image/jpeg' && attachmentData.mimetype !== 'video/mp4' && attachmentData.mimetype !== 'image/webp') {
					SupportFunctions.sendMessage(client, msg, 'Formato de mídia não suportado')

					//reage à msg
					SupportFunctions.addErrorReaction(msg)

					//envia a midia em formato de sticker, ou envia o sticker (image/webp) como imagem
				} else {
					let sendAsSticker = (attachmentData.mimetype !== 'image/webp');
					SupportFunctions.sendMessage(client, msg, attachmentData, null, sendAsSticker, SupportFunctions.getMsgId(msg), BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT)
					success = true
				}

			} catch (err) {
				console.log(err)
				SupportFunctions.sendMessage(client, msg, 'Não foi possível fazer o sticker no momento')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
			}

			//se não tiver, retornar a mensagem de erro
		} else if (quotedMessage && !quotedMessage.hasMedia) {
			SupportFunctions.sendMessage(client, msg, 'A mensagem selecionada não possui mídia.')

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
		}

		//caso a própria mensagem tenha mídia
	} else if (msg.hasMedia) {
		try {
			//tenta baixar a midia da mensagem
			const attachmentData = await msg.downloadMedia();

			//caso, por algum motivo, a midia não tenha sido baixada corretamente
			if (!attachmentData) {
				SupportFunctions.sendMessage(client, msg, 'Não foi possível baixar a imagem no momento. Tente reenviá-la')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
				return;
			}

			//caso o formato da mídia não seja suportado
			if (attachmentData.mimetype !== 'image/jpeg' && attachmentData.mimetype !== 'video/mp4') {
				SupportFunctions.sendMessage(client, msg, 'Formato de mídia não suportado.')

				//reage à msg
				SupportFunctions.addErrorReaction(msg)

				//envia a midia em formato de sticker
			} else {
				SupportFunctions.sendMessage(client, msg, attachmentData, null, true, SupportFunctions.getMsgId(msg), BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT)
				success = true
			}
		} catch (err) {
			console.log(err)
			SupportFunctions.sendMessage(client, msg, 'Não foi possível fazer o sticker no momento')

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
		}

		//caso não exista midia na mensagem ou na mensagem mencionada
	} else {
		SupportFunctions.sendMessage(client, msg, "Para fazer o sticker, envie uma mídia com a legenda '@sticker' ou envie '@sticker' mencionando uma mensagem com a mídia")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
	}

	//se o comando foi bem sucedido, adicionar à contagem do usuário
	if(success){
		SupportFunctions.checkUserBotUsage(data)
	}
}

//transforma um texto em um sticker
async function TTs(msg, client) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//adicionando à contagem
	SupportFunctions.count('tts')

	//busca os parametros de execução da msg
	var params = SupportFunctions.getTTSParams(msg.body)

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//inicia a variável que irá definir se a função foi bem sucedida ou não
	let success = false;

	//declara variáveis
	let fontSize, textColor, backgroundColor

	//caso existam modificadores (cor do texto, cor do fundo e tamanho)
	if (params.modifiers) {
		textColor = params.modifiers[0]
		backgroundColor = params.modifiers[1]
		fontSize = params.modifiers[2]
	}

	//caso a mensagem esteja mencionando outra, o texto a ser transformado em sticker é o texto da outra mensagem
	if (msg.hasQuotedMsg) {
		try {
			const quotedMessage = await msg.getQuotedMessage()
			if (quotedMessage && quotedMessage.body) {
				params.texto = quotedMessage.body
			}
		} catch (err) {
			SupportFunctions.simulateTyping(msg, 'Ops.. algo deu errado', null, null, null, true)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
		}
		//se a mensagem for só um @tts solto, responder com um tutorial
	} else if (msg.body === "@tts") {
		let t = "Para fazer um sticker de texto, digite o comando @tts *_texto_*. \n\nPor padrão, a cor do texto é preta, o fundo é branco e o tamanho da fonte é 72.\nSe a mensagem estiver mencionando outra mensagem, o texto da outra mensagem será utilizado para o sticker.\n\nPara mudar as propriedades, use o comando:" +
			"\n\n@tts *_texto_* | *_cor_da_letra_*  *_cor_do_fundo_*  *_tamanho_da_letra_* \n\n \nExemplos:" +
			"\n@tts texto padrão" +
			"\n@tts texto padrão | green" +
			"\n@tts texto padrão | green black" +
			"\n@tts texto padrão | red transparent 120"

		SupportFunctions.simulateTyping(msg, t, null, null, null, true)
		return;
	}


	//caso algum parâmetro não tenha sido preenchido, recebe o valor default
	fontSize = fontSize || "72"
	textColor = textColor || 'black'
	backgroundColor = backgroundColor || 'white'



	//cria o template usado pra fazer o texto posicionado
	let html =
		"<html>" +
		"<head>" +
		"<style>" +
		"body {" +
		" width: 512px;" +
		"height: 512px;" +
		"}" +
		"</style>" +
		"</head>" +
		"<body>" +
		"<div style='display: flex; justify-content: center; align-items: center;  text-align: center; width: 512px;  height: 512px; background-color: " + backgroundColor + "'>" +
		"<span style='vertical-align: middle; line-heigth: normal; color: " + textColor + "; font-size: " + fontSize + "px;'><b>" + params.texto + "</b></span>" +
		"</div>+" +
		"</body>" +
		"</html>"

	SupportFunctions.simulateTyping(msg, 'Um momento...', 1, null, null, true)

	//transforma o html em imagem e envia como sticker
	try {
		nodeHtmlToImage({ output: './src/config/imgs/tts.png', html: html, transparent: true }).then(() => {
			const contentFilePath = path.join(__dirname, '/../imgs/tts.png')
			SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(contentFilePath), null, true, SupportFunctions.getMsgId(msg), BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT)
		})

		success = true
	} catch (err) {
		SupportFunctions.simulateTyping(msg, 'Ops.. algo deu errado', null, null, null, true)

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
	}

	//se o comando foi bem sucedido, adicionar à contagem do usuário
	if(success){
		SupportFunctions.checkUserBotUsage(data)
	}

}

//gera um numero aleatório (simulando um dado) a partir de uma mensagem no formato '@d#', em que # é um número
async function diceRoll(msg) {
	//adicionando à contagem
	SupportFunctions.count('@d#')

	//texto base
	let inputText = msg.body

	//extrai o número da mensagem
	let number = SupportFunctions.filterNonNumbers(inputText);

	//gera um numero aleatório com base no numero extraido
	let random = SupportFunctions.getRandomInt(number, true)

	//monta a mensagem e envia
	let text = "Número rodado: " + random;
	SupportFunctions.simulateTyping(msg, text, null, null, null, msg, SupportFunctions.getMsgId(msg))

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//adiciona à contagem de uso pra mandar msg do pix
	SupportFunctions.checkUserBotUsage(data)
}

//adiciona um registro de tá pago pro usuário
async function taPago(msg, client, keyParams) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//busca a chave do tá pago
	let key = keyParams.KEY

	//adicionando à contagem
	SupportFunctions.count(key)

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//se a configuração permite multiplos registros
	let allowMultiple = keyParams.ALLOW_MULTIPLE

	//se o chat for grupo
	if (chat.isGroup) {
		//busca configurações de taPago do grupo
		let taPagoSettings = SupportFunctions.getGroupTaPagoSettings(chat)

		//se o o tá pago permitir a validação por foto, valida se as configurações do grupo exigem foto
		if (keyParams.CAN_REQUIRE_PICTURES) {
			//valida se o grupo exige foto
			if (taPagoSettings.blockTaPagoSemFoto) {
				//valida que a mensagem tem foto
				let check = await SupportFunctions.checkTaPagoPhoto(msg)
				if (!check.hasPhoto) {
					SupportFunctions.simulateTyping(msg, "Apenas _tá pago's_ com foto serão aceitos.")
					
					//reage à msg
					SupportFunctions.addErrorReaction(msg)
					return;
				}
				if (!check.sameAuthor) {
					SupportFunctions.simulateTyping(msg, "Essa foto não foi vc que enviou, espertão.")
					
					//reage à msg
					SupportFunctions.addErrorReaction(msg)
					return;
				}
			}
		}

		//busca os tá pago do usuário
		let userTaPago

		//caso o grupo use tá pagos globais, busca os registros salvos no usuário
		if (taPagoSettings.useGlobalTaPago) {
			userTaPago = SupportFunctions.getUserTaPago(data.sender, key)

		//caso contrário, busca os registros do usuário no grupo
		} else {
			userTaPago = SupportFunctions.getUserTaPagoInGroup(data.sender, data.chat, key).registros
		}

		const IS_MULT = SupportFunctions.hasDateTaPago(userTaPago);
		//verifica se a lista de registros já possui um tá pago do dia de hj
		if (!allowMultiple && IS_MULT) {
			SupportFunctions.simulateTyping(msg, "Calma lá, champz.. só 1 registro por dia")

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return

			//se passou pelas validações, adicionar o registro à lista de tá pagos 
		} else {
			//adiciona o registro à contagem
			SupportFunctions.addGroupTaPago(data, key, allowMultiple)

			//inicia a frase de resposta caso seja um registro múltiplo
			let resposta = (IS_MULT && keyParams.FRASE_MULT) ? keyParams.FRASE_MULT + '\n\n' : ''

			//define o nome e path do sticker a partir das configurações, considerando que pode ser um registro multiplo 
			let stickerName = (IS_MULT && keyParams.STICKER_MULT) ? keyParams.STICKER_MULT : keyParams.STICKER
			let stickerPath = path.join(__dirname, '/../imgs/' + stickerName)

			//adiciona a frase das configurações à frase de resposta
			resposta += keyParams.FRASE

			//inicia o array de mentions
			let mentions

			//se o grupo não tiver desativado as repostas de novos registros
			if(!taPagoSettings.silentTaPago){
				//se o grupo não tiver desativado as marcações nos novos registros
				if(!taPagoSettings.ignorarMentions){
					//busca quem tem registro no dia de hj
					let pagosHoje = await SupportFunctions.getTodaysTaPagos(data, key, client)
		
					//inicia a contagem de quem tem registro no dia
					resposta += "\n\n"+ keyParams.NOME_PAGADOR + " de hoje:\n"
		
					//adiciona cada um à lista
					pagosHoje.forEach(registro => {
						//se for um registro multiplo, inclui a contagem do dia
						let count = allowMultiple ? ' (' + registro.todayCount + ')' : ''
						resposta += `\n@${registro.id}${count}`
					})
		
					//monta as mentions da resposta
					mentions = pagosHoje.map(reg => reg.contactToMention)
				}

				//envia a mensagem com a lista
				await SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, mentions, true)
		
		
				//envia o sticker de resposta
				await SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(stickerPath), null, true, null, BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT, chat.data, 0)
			}

			//easter egg
			let now = new Date()
			let hours = now.getHours()
			let mins = now.getMinutes()

			let emoji = keyParams.EMOJI
			if(hours === 16 && mins === 20){
				emoji = '🍁'
			}

			//reage à msg
			SupportFunctions.addMsgReaction(msg, emoji)
		}

		//caso esteja em um chat individual
	} else {
		//busca os tá pago do usuário
		let userTaPago = SupportFunctions.getUserTaPago(data.sender, key)

		//valida se já existe um tá pago hoje
		const IS_MULT = SupportFunctions.hasDateTaPago(userTaPago);

		//verifica se a lista de registros já possui um tá pago do dia de hj
		if (!allowMultiple && IS_MULT) {
			SupportFunctions.simulateTyping(msg, "Calma lá, champz.. só 1 registro por dia")

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return

		}

		//se passou pelas validações, adicionar o registro à lista de tá pagos 
		//adiciona o registro nas configurações do usuário
		SupportFunctions.addUserTaPago(data.sender, key, allowMultiple)


		//inicia a frase de resposta 
		let resposta = "Registro adicionado. \n\n"

		//caso seja um registro múltiplom adiciona a frase múltipla
		resposta += (IS_MULT && keyParams.FRASE_MULT) ? keyParams.FRASE_MULT + '\n\n' : ''

		//define o nome e path do sticker a partir das configurações, considerando que pode ser um registro multiplo 
		let stickerName = (IS_MULT && keyParams.STICKER_MULT) ? keyParams.STICKER_MULT : keyParams.STICKER
		let stickerPath = path.join(__dirname, '/../imgs/' + stickerName)

		//adiciona a frase das configurações à frase de resposta
		resposta += keyParams.FRASE

		//envia a mensagem
		await SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, null, true)


		//envia o sticker de resposta
		await SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(stickerPath), null, true, null, BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT, chat.data, 0)


		//easter egg
		let now = new Date()
		let hours = now.getHours()
		let mins = now.getMinutes()

		let emoji = keyParams.EMOJI
		if(hours === 16 && mins === 20){
			emoji = '🍁'
		}

		//reage à msg
		SupportFunctions.addMsgReaction(msg, emoji)
	}

	//adiciona à contagem do usuário
	SupportFunctions.checkUserBotUsage(data)

}

//retorna quem pagou no dia
async function pagosDoDia(msg, client, keyParams, type) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//busca a chave do tá pago
	let key = keyParams.KEY

	//adicionando à contagem
	SupportFunctions.count(key)

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//se a configuração permite multiplos registros
	let allowMultiple = keyParams.ALLOW_MULTIPLE

	//se o chat for grupo
	if (chat.isGroup) {
		//busca os tá pago ou os ausentes do dia
		let todays = await SupportFunctions.getTodaysTaPagos(data, key, client, type)

		//se não tiver registros de hj
		if (!(todays && todays.length > 0)) {
			let response = type === "todays" ? `Ninguém ${keyParams.VERBO} hoje. Bora time!` : `Ninguém faltou hoje. Tá todo mundo de parabéns!`
			SupportFunctions.simulateTyping(msg, response)
			return
		}


		//inicia a contagem de quem tem registro no dia
		let identifier = type === "todays" ? keyParams.NOME_PAGADOR : "Devedores"
		let resposta = identifier + " de hoje:\n"

		//adiciona cada um à lista
		todays.forEach(registro => {
			//se for um registro multiplo e a função for para pagantes, inclui a contagem do dia
			let count = (allowMultiple && type === "todays") ? ' (' + registro.todayCount + ')' : ''
			resposta += `\n@${registro.id}${count}`
		})

		//monta as mentions da resposta
		let mentions = todays.map(reg => reg.contactToMention)

		//envia a mensagem com a lista
		await SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, mentions, true)


		//define o nome e path do sticker a partir das configurações 
		let stickerPath = path.join(__dirname, '/../imgs/' + keyParams.STICKER)

		//envia o sticker de resposta
		await SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(stickerPath), null, true, null, BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT, chat.data, 0)
		
		//adiciona à contagem de uso pra mandar msg do pix
		SupportFunctions.checkUserBotUsage(data)
		return

		//caso esteja em um chat individual
	} else {

		SupportFunctions.simulateTyping(msg, "Comando disponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	

}

//retorna os tá pago do contexto (grupo ou individual) de um usuário
async function userTaPago(msg, keyParams) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//busca a chave do tá pago
	let key = keyParams.KEY

	//adicionando à contagem
	SupportFunctions.count(key)

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;


	//inicializa variável
	let userTaPago

	//se o chat for grupo
	if (chat.isGroup) {
		//busca configurações de taPago do grupo
		let taPagoSettings = SupportFunctions.getGroupTaPagoSettings(chat)

		//caso o grupo use tá pagos globais, busca os registros salvos no usuário
		if (taPagoSettings.useGlobalTaPago) {
			userTaPago = {
				"registros": SupportFunctions.getUserTaPago(data.sender, key)
			}
			//caso contrário, busca os registros do usuário no grupo
		} else {
			let userRegistros = SupportFunctions.getUserTaPagoInGroup(data.sender, data.chat, key)
			userTaPago = {
				"registros": userRegistros.registros,
				"cancelados": userRegistros.cancelados
			}
		}


		//caso esteja em um chat individual
	} else {
		//busca os tá pago do usuário
		userTaPago = {
			"registros": SupportFunctions.getUserTaPago(data.sender, key)
		}

		if (!(userTaPago.registros && userTaPago.registros.length > 0)) {
			SupportFunctions.simulateTyping(msg, "Nenhum registro encontrado.")

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}

	}

	//se não tiver nenhum tá pago
	if (!(userTaPago.registros && userTaPago.registros.length > 0)) {
		SupportFunctions.simulateTyping(msg, "Nenhum registro encontrado.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//formata os tá pago do usuário separando por contagem diária/semanal/mensal/etc
	userTaPago = SupportFunctions.addRegCount(userTaPago)

	//monta a resposta. Se tiver em um grupo, adiciona o nome ao topo
	let chatName = chat.isGroup ? " do " + chat.name : ''
	let resposta = "Seu histórico de '" + keyParams.RANKING_NAME + "'" + chatName + ": \n\n"

	//registro(s) diários
	if (userTaPago.todayCount > 0) {
		let plural = userTaPago.todayCount > 1 ? 's' : ''
		resposta += `Diário (${userTaPago.todayCount} registro${plural}):\n`
		resposta += userTaPago.today.join('\n')
		resposta += '\n\n'
	}

	//registro(s) semanais
	if (userTaPago.weekCount > 0) {
		let plural = userTaPago.weekCount > 1 ? 's' : ''
		resposta += `Semanal (${userTaPago.weekCount} registro${plural}):\n`
		resposta += userTaPago.week.join('\n')
		resposta += '\n\n'
	}

	//registro(s) mensais
	if (userTaPago.monthCount > 0) {
		let plural = userTaPago.monthCount > 1 ? 's' : ''
		resposta += `Mensal (${userTaPago.monthCount} registro${plural}):\n`
		resposta += userTaPago.month.join('\n')
		resposta += '\n\n'
	}

	//registro(s) anuais
	if (userTaPago.yearCount > 0) {
		let plural = userTaPago.yearCount > 1 ? 's' : ''
		resposta += `Anual (${userTaPago.yearCount} registro${plural}):\n`
		resposta += userTaPago.year.join('\n')
		resposta += '\n\n'
	}

	

	//registro(s) gerais
	let plural = userTaPago.geralCount > 1 ? 's' : ''
	resposta += `Geral (${userTaPago.geralCount} registro${plural}):\n`
	resposta += userTaPago.registros.join('\n')

	//registro(s) cancelados (só pra grupos)
	if (userTaPago.cancelledCount > 0) {
		resposta += '\n\n'
		let plural = userTaPago.cancelledCount > 1 ? 's' : ''
		resposta += `Cancelados (${userTaPago.cancelledCount} registro${plural}):\n`
		resposta += userTaPago.cancelled.join('\n')
	}

	//envia a mensagem
	await SupportFunctions.simulateTyping(msg, resposta, null, chat.data, null, true)

	//adiciona à contagem de uso pra mandar msg do pix
	SupportFunctions.checkUserBotUsage(data)

}

//retorna o ranking dos tá pago
async function rankingTaPago(msg, client, keyParams, type) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//busca a chave do tá pago
	let key = keyParams.KEY

	//adicionando à contagem
	SupportFunctions.count(key)

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//se a configuração permite multiplos registros
	let allowMultiple = keyParams.ALLOW_MULTIPLE


	//se o chat for grupo
	if (chat.isGroup) {
		//busca configurações de taPago do grupo
		let groupTaPagoRanking = await SupportFunctions.getTaPagoRanking(data, key, client)

		//se não tiver nenhum registro pro grupo
		if (!groupTaPagoRanking) {
			SupportFunctions.simulateTyping(msg, "Nenhum " + keyParams.RANKING_NAME + " encontrado.")
			return
		}
		
		
		//inicia a resposta e o array de mentions
		let lastWeek = SupportFunctions.getLastWeekDates()
		let resposta = type === "ranking" ? `_Hall da fama dos *${keyParams.RANKING_NAME}* do ${chat.name}:_\n\n` : `_Resultado da última semana (de ${lastWeek[0]} a ${lastWeek[6]}) dos *${keyParams.RANKING_NAME}* do ${chat.name}:_\n\n`
		let mentions = []

		//se for o ranking inteiro
		if(type === "ranking"){
			//o ranking diário só é feito caso o registro permita registros multiplos
			if (allowMultiple && groupTaPagoRanking.todayCount.length > 0) {
				resposta += 'Ranking diário'
				groupTaPagoRanking.todayCount.forEach((position, idx) => {
					let plural = position.count > 1 ? 's' : ''
					mentions.push(position.contactToMention)
					resposta += `\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}`
				})
				resposta += '\n\n'
			}
	
			//semanal
			if (groupTaPagoRanking.weekCount.length > 0) {
				resposta += 'Ranking semanal'
				groupTaPagoRanking.weekCount.forEach((position, idx) => {
					let plural = position.count > 1 ? 's' : ''
					mentions.push(position.contactToMention)
					resposta += `\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}`
				})
				resposta += '\n\n'
			}
	
			//mensal
			if (groupTaPagoRanking.monthCount.length > 0) {
				resposta += 'Ranking mensal'
				groupTaPagoRanking.monthCount.forEach((position, idx) => {
					let plural = position.count > 1 ? 's' : ''
					mentions.push(position.contactToMention)
					resposta += `\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}`
				})
				resposta += '\n\n'
			}
	
			//anual
			if (groupTaPagoRanking.yearCount.length > 0) {
				resposta += 'Ranking anual'
				groupTaPagoRanking.yearCount.forEach((position, idx) => {
					let plural = position.count > 1 ? 's' : ''
					mentions.push(position.contactToMention)
					resposta += `\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}`
				})
				resposta += '\n\n'
			}
	
			//geral
			if (groupTaPagoRanking.geralCount.length > 0) {
				resposta += 'Ranking geral'
				groupTaPagoRanking.geralCount.forEach((position, idx) => {
					let plural = position.count > 1 ? 's' : ''
					mentions.push(position.contactToMention)
					resposta += `\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}`
				})
			}
	
			//cancelados
			if (groupTaPagoRanking.cancelledCount.length > 0) {
				resposta += '\n\n'
				resposta += 'Ranking cancelados'
				groupTaPagoRanking.cancelledCount.forEach((position, idx) => {
					let plural = position.count > 1 ? 's' : ''
					mentions.push(position.contactToMention)
					resposta += `\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}`
				})
			}
		}

		//envia a mensagem com a lista
		await SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, mentions)

		

		//define o nome e path do sticker a partir das configurações 
		let stickerPath = path.join(__dirname, '/../imgs/' + keyParams.STICKER)

		//envia o sticker de resposta
		await SupportFunctions.sendMessage(client, msg, MessageMedia.fromFilePath(stickerPath), null, true, null, BOT_SETTINGS.STICKER_NAME, BOT_SETTINGS.PIX_BOT, chat.data, 0)
		
		//adiciona à contagem de uso pra mandar msg do pix
		SupportFunctions.checkUserBotUsage(data)
		return


		//caso esteja em um chat individual
	} else {
		SupportFunctions.simulateTyping(msg, "Comando disponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}
}

//retorna o ranking dos tá pago
async function lastWeekTaPago(msg, client, keyParams, type) {
	//puxando o botSettings pra garantir que vai pegar os dados atualizados
	let BOT_SETTINGS = SupportFunctions.getBotSettings()

	//busca a chave do tá pago
	let key = keyParams.KEY

	//adicionando à contagem
	SupportFunctions.count(key)

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;


	//se o chat for grupo
	if (chat.isGroup) {
		//busca configurações de taPago do grupo
		let groupTaPagoRanking = await SupportFunctions.getTaPagoRanking(data, key, client)

		//se não tiver nenhum registro pro grupo
		if (!groupTaPagoRanking) {
			SupportFunctions.simulateTyping(msg, "Nenhum " + keyParams.RANKING_NAME + " encontrado.")
			return
		}

		//apenas adms podem fazer o sorteio
		if(type === "sorteio"){
			//valida que o comando foi enviado por um admin
			const admins = await SupportFunctions.checkAdmins(msg, chat.data);
			if(!admins.sender){
				SupportFunctions.simulateTyping(msg, 'Apenas administradores podem realizar o sorteio.',null, null, null, true)

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
				return;
			}
		}
		
		
		//inicia a resposta e o array de mentions
		let lastWeek = SupportFunctions.getLastWeekDates()
		let resposta = `_Resultado da última semana (de ${lastWeek[0]} a ${lastWeek[6]}) dos *${keyParams.RANKING_NAME}* do ${chat.name}:_\n\n`
		let mentions = []

		
		//busca as dados do grupo
		let groupData = supportFunctions.loadGroupData(chat.id, chat.data)

		//configurações
		let settings = groupData.settings

		//chaves salvas
		let keySettings = settings && settings.keySettings


		let freq = keySettings && keySettings.taPagoFrequency
		let msgFreq = `Frequência do grupo: *${freq || 'Não cadastrado'}*.`

		let valor = keySettings && keySettings.taPagoValor
		let msgValor = `\nValor por falta: *${valor || 'Não cadastrado'}*.`
		
		//valor de pix cadastrado pro grupo
		let pix = keySettings && keySettings.pixTaPago
		let msgPix = type === 'lastWeek' && valor ? `\nChave Pix para pagamento: *${pix || 'Não cadastrada'}*\n`: '\n'

		//quantidade de membros sorteados por semana pro grupo
		let qtdSorteados = (keySettings && keySettings.sorteadosPorSemana) || 1
		let msgQtdSorteados = type === 'sorteio' ? `\nQuantidade de usuários sorteados: *${qtdSorteados}*`: ''

		//monta o 'topo' da msg com as informações de configuração do grupo
		resposta += `${msgFreq}${msgValor}${msgPix}${msgQtdSorteados}`
		let valorArrecadado = 0
		
		//inicia a lista de usuários que vão aparecer na mensagem
		let list = []
		if(groupTaPagoRanking.lastWeekCount.length > 0){
			groupTaPagoRanking.lastWeekCount.forEach((position, idx) => {
				//define se existe mais de um registro (pra montar o plural)
				let plural = position.count > 1 ? 's' : ''

				//define se existe saldo devedor
				let saldoDevedor = (valor && freq) ? ((freq - position.count)*valor) : ''
				

				//define o emoji com base na frequencia
				let emoji = (!freq || (freq && position.count >= freq)) ? '✅' : '❌'

				//define a mensagem caso exista saldo devedor
				let msgDevedor = (saldoDevedor && saldoDevedor > 0) ? ` ${emoji} Valor a pagar: ${saldoDevedor} reais` : ` ${emoji}`
				
				//incrementa o valor arrecadado
				if(valor && freq && saldoDevedor > 0){
					valorArrecadado += saldoDevedor 
				}

				//se for um sorteio, a lista só vai ser montada com quem tem a frequencia minima
				if(type === "sorteio"){
					if(freq && position.count >= freq){
						mentions.push(position.contactToMention)
						list.push(`\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}${msgDevedor}`)
					}
					
				//se for o resultado, coloca todo mundo	
				}else{
					mentions.push(position.contactToMention)
					list.push(`\n${idx + 1}º: @${position.id}: ${position.count} ${keyParams.NOME_REGISTRO}${plural}${msgDevedor}`)
				}
			})

			//se o tipo for sorteio, validar que o grupo tenha frequencia cadastrada
			if(type === "sorteio"){
				if(!freq){
					resposta += "\n\nNão é possível sortear o participante vencedor porque não existe frequência de tá pago cadastrada para o grupo."
				}else{
					//filtra os que possuem registro maior que a frequencia (pra fazer o sorteio)
					let pool = groupTaPagoRanking.lastWeekCount.filter(member => member.count >= freq)
					if(pool.length === 0){
						resposta += "\n\nNenhum membro cumpriu a meta da semana."
					}

					//sorteia entre os participantes que cumpriram
					else{
						//sorteia os membros
						let sorteados = SupportFunctions.randomPick(pool, qtdSorteados)
						
						//adiciona o pix dos sorteados à estrutura
						sorteados = sorteados.map(sort =>{
							sort.pix = SupportFunctions.getUserKey(sort, 'pix')
							return sort
						})

						//monta o array de mentions
						mentions = mentions.concat(sorteados.map(sort => sort.contactToMention))

						//plural
						let s = sorteados.length > 1 ? 's' : ''

						//monta a mensagem de valor arrecadado
						let msgValorArrecadado = valorArrecadado ? `Valor arrecadado na semana: ${valorArrecadado}\n` : '\n'

						//monta a mensagem de cada um dos sorteados
						let sorteadosMsg = sorteados.map(sort => `@${sort.id}. Chave pix: ${sort.pix || 'não cadastrada'}`).join('\n')
						resposta += `${msgValorArrecadado}\nMembro${s} sorteado${s}: \n${sorteadosMsg} \n🎉🎈🎊🥳\n\nParticipantes do sorteio:`
					}
				}
			}

			//monta a mensagem com a lista de participantes que vão ser mencionados no resultado
			resposta += list.join('')
		}else{
			resposta += `Nenhum ${keyParams.NOME_REGISTRO} encontrado`
		}

		//envia a mensagem com a lista
		await SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, mentions)

		//adiciona à contagem de uso pra mandar msg do pix
		SupportFunctions.checkUserBotUsage(data)


	//caso esteja em um chat individual
	} else {
		SupportFunctions.simulateTyping(msg, "Comando disponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}
}

//envia os comandos de um tá pago específico
async function printTaPagoMenu(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('taPagoMenu')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;


	//inicia a resposta
	let resposta
	let addTrigger = settings.ADD_TRIGGERS && settings.ADD_TRIGGERS[0] ? `\n➕ *${settings.ADD_TRIGGERS[0]}*: adiciona um novo valor de ${settings.RANKING_NAME}` : ''
	let doDia = settings.DO_DIA_TRIGGERS && settings.DO_DIA_TRIGGERS[0] ? `\n👥 *${settings.DO_DIA_TRIGGERS[0]}*: envia quem possui registro de ${settings.RANKING_NAME} hoje` : ''
	let faltantes = settings.FALTANTES_TRIGGERS && settings.FALTANTES_TRIGGERS[0] ? `\n❌ *${settings.FALTANTES_TRIGGERS[0]}*: envia quem não possui registro de ${settings.RANKING_NAME} hoje` : ''
	let printUser = settings.USER_TA_PAGO_TRIGGERS && settings.USER_TA_PAGO_TRIGGERS[0] ? `\n👤 *${settings.USER_TA_PAGO_TRIGGERS[0]}*: envia seus registros de ${settings.RANKING_NAME} cadastrados` : ''
	let printRanking = settings.RANKING_TRIGGERS && settings.RANKING_TRIGGERS[0] ? `\n📈 *${settings.RANKING_TRIGGERS[0]}*: envia o ranking de ${settings.RANKING_NAME} do grupo` : ''
	let lastWeek = settings.ULTIMA_SEMANA_TRIGGERS && settings.ULTIMA_SEMANA_TRIGGERS[0] ? `\n📊 *${settings.ULTIMA_SEMANA_TRIGGERS[0]}*: envia resultado da última semana de ${settings.RANKING_NAME} do grupo` : ''
	let sorteio = settings.SORTEIO_TRIGGERS && settings.SORTEIO_TRIGGERS[0] ? `\n🍀 *${settings.SORTEIO_TRIGGERS[0]}*: sorteia um (ou mais) participante(s) entre os que cumpriram a meta de ${settings.RANKING_NAME} da última semana` : ''
	let header = (addTrigger || doDia || sorteio || faltantes || printUser || printRanking || lastWeek || sorteio) ? `Lista de comandos - ${settings.RANKING_NAME}` : ''

	resposta = header ? `${header}${addTrigger}${doDia}${faltantes}${printUser}${printRanking}${lastWeek}${sorteio}` : 'Não existem comandos cadastrados para a chave selecionada.'

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//adiciona um valor a alguma configuração de chave do usuário
async function updateUserKeys(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('userSettingsUpdate')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//valida o formato do input, que tem que ser <trigger>| <valor> 
	let toLowerBody = msg.body.toLowerCase();
	let trigger = settings.ADD_TRIGGER
	
	let valor
	//caso a msg n esteja no formato correto
	if(settings.NEEDS_GREP){
		if(toLowerBody.indexOf('| ')!== trigger.length){
			let text = 'Para utilizar esse comando, copie a mensagem a seguir e edite o valor';
			let command = trigger+'| _valor_';
			let messagesToSend = [{text: text}, {text: command}]
			await SupportFunctions.sendSequentialMessages(msg, messagesToSend, true)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}
		valor = msg.body.slice(msg.body.indexOf("| ")+1).trim()
	}else{
		//extrai o valor da msg
		valor = msg.body.slice(trigger.length).trim()
	}

	//se a chave não permitir espaço
	if(!settings.ALLOW_SPACES){
		valor = valor.replace(/\s/g, '')
	}

	//se a chave definir tudo minusculo
	if(settings.TO_LOWER){
		valor = valor.toLowerCase()
	}

	//se a chave definir tudo minusculo
	if(settings.TO_UPPER){
		valor = valor.toUpperCase()
	}

	//busca as configurações do usuário
	let userSettings = SupportFunctions.loadUserData(data.sender.id, data.sender.contact)
	
	//inicia a configuração de chaves, caso não haja
	userSettings.keySettings = userSettings.keySettings || {}

	//monta a resposta
	let resposta
	
	//se a chavve permitir vários valores 
	if(settings.ALLOW_MULTIPLE){
		//inicia o array, caso n exista
		userSettings.keySettings[settings.KEY] = userSettings.keySettings[settings.KEY] || []
		userSettings.keySettings[settings.KEY].push(valor)
		resposta = `Valor ${valor} adicionado aos seus ${settings.NOME_PLURAL}. Para conferir todos os valores salvos, utilize o comando _${settings.PRINT_AUTHOR_TRIGGER}_`
	}else{
		//atualiza o valor
		userSettings.keySettings[settings.KEY] = valor
		resposta = `${settings.NOME} atualizado com o valor *${valor}*. Para consultar o valor salvo, utilize o comando _${settings.PRINT_AUTHOR_TRIGGER}_`
	}

	//salva as configurações
	SupportFunctions.saveUserSettings(userSettings, data.sender.id, data.sender.contact)

	//responde
	SupportFunctions.simulateTyping(msg, resposta)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//remove um valor específico de uma chave
async function deleteUserKeys(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('userSettingsDelete')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//valida o formato do input, que tem que ser <trigger>| <valor> 
	let toLowerBody = msg.body.toLowerCase();
	let trigger = settings.DELETE_TRIGGER
	
	let valor
	//caso a msg n esteja no formato correto
	if(settings.NEEDS_GREP){
		if(toLowerBody.indexOf('| ')!== trigger.length){
			let text = 'Para utilizar esse comando, copie a mensagem a seguir e edite o valor';
			let command = trigger+'| _valor_';
			let messagesToSend = [{text: text}, {text: command}]
			await SupportFunctions.sendSequentialMessages(msg, messagesToSend, true)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}

		valor = msg.body.slice(msg.body.indexOf("| ")+1).trim()
	}else{
		//extrai o valor da msg
		valor = msg.body.slice(trigger.length).trim()
	}
	//extrai o valor da msg

	//se a chave não permitir espaço
	if(!settings.ALLOW_SPACES){
		valor = valor.replace(/\s/g, '')
	}

	//se a chave exigir normalização (tudo minusculo)
	if(settings.NORMALIZE){
		valor = valor.toLowerCase()
	}

	//busca as configurações do usuário
	let userSettings = SupportFunctions.loadUserData(data.sender.id, data.sender.contact)
	
	//inicia a configuração de chaves, caso não haja
	userSettings.keySettings = userSettings.keySettings || {}

	//monta a resposta
	let resposta
	let emoji
	//se a chave permitir vários valores 
	if(settings.ALLOW_MULTIPLE){
		//inicia o array, caso n exista
		userSettings.keySettings[settings.KEY] = userSettings.keySettings[settings.KEY] || []
		userSettings.keySettings[settings.KEY] = userSettings.keySettings[settings.KEY].filter(key => key !== valor)
		resposta = `Valor ${valor} removido ou não encontrado nos seus ${settings.NOME_PLURAL}. Para conferir todos os valores salvos, utilize o comando _${settings.PRINT_AUTHOR_TRIGGER}_`
		emoji = '✅'
	}else{
		//atualiza o valor
		resposta = `Para limpar o valor cadastrado do seu ${settings.NOME}, utilize o comando _${settings.CLEAR_TRIGGER}_`
		emoji = '❌'
	}

	//salva as configurações
	SupportFunctions.saveUserSettings(userSettings, data.sender.id, data.sender.contact)

	//responde
	SupportFunctions.simulateTyping(msg, resposta)

	//reage
	SupportFunctions.addMsgReaction(msg, emoji)
}

//limpa os valores de uma chave especifica
async function clearUserKeys(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('userSettingsClear')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//busca as configurações do usuário
	let userSettings = SupportFunctions.loadUserData(data.sender.id, data.sender.contact)
	
	//inicia a configuração de chaves, caso não haja
	userSettings.keySettings = userSettings.keySettings || {}

	//monta a resposta
	let resposta
	let grep = settings.NEEDS_GREP ? '| ' : ''

	//se a chave permitir vários valores 
	if(settings.ALLOW_MULTIPLE){
		//inicia o array, caso n exista
		userSettings.keySettings[settings.KEY] = []
		resposta = `Lista de ${settings.NOME_PLURAL} apagada. Para adicionar um novo valor, utilize o comando _${settings.ADD_TRIGGER}${grep}valor_`
	}else{
		//atualiza o valor
		userSettings.keySettings[settings.KEY] = null
		resposta = `Valor de ${settings.NOME} apagado. Para inserir um novo valor, utilize o comando _${settings.ADD_TRIGGER}${grep}valor_`
	}

	//salva as configurações
	SupportFunctions.saveUserSettings(userSettings, data.sender.id, data.sender.contact)

	//responde
	SupportFunctions.simulateTyping(msg, resposta)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//envia todas as chaves cadastradas pros usuários do grupo
async function printAllParticipantsKey(msg, settings, client, keys){
	//adicionando à contagem
	SupportFunctions.count('userSettingsAll')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//valida que é um grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, "Comando disponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//se as configurações limitarem o comando apenas para admins
	if(settings.LIMIT_MENTIONS_TO_ADMINS){
		const admins = await SupportFunctions.checkAdmins(msg, chat.data);
		if(!admins.sender){
			SupportFunctions.simulateTyping(msg, 'Apenas administradores podem utilizar este comando.',null, null, null, true)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return;
		}
	}

	//se a função determinar um conjunto de chaves
	let params = keys || settings.KEY

	//busca as chaves dos participantes
	let groupKeys = await SupportFunctions.getGroupParticipantsKeys(data, client, params)

	//monta o sufixo da chave, caso exista
	let sufix = settings.SUFIX ? settings.SUFIX : ''

	//se não retornou nenhuma chave
	if(groupKeys.length == 0){
		let resposta
		if(Array.isArray(params)){
			// TO-DO
			// resposta de parametros multiplos (socials)
			// nenhum participante do grupo possui valor para nenhuma das chaves (nome, nome, nome, etc) definidas?
		}else{
			resposta = `Nenhum participante do grupo possui ${settings.NOME} cadastrado`
		}
		SupportFunctions.simulateTyping(msg, resposta)

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//monta a resposta
	let resposta = `Lista de *${settings.NOME_PLURAL}* dos usuários do *${chat.name}*: \n`
	let mentions = [];
	groupKeys.forEach(participant =>{
		if(Array.isArray(params)){
			//TO-DO: LÓGICA DA RESPOSTA DE MULTIPLOS PARAMETROS
		}else{
			resposta += `\n@${participant.id}: ${sufix}${participant.keySettings}`
			mentions.push(participant.contact)
		}
	})

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, mentions)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//envia as chaves de determinados participantes
async function printUserKey(msg, settings, client){
	//adicionando à contagem
	SupportFunctions.count('userSettingsUser')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//valida que é um grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, "Comando disponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//se ninguém tiver sido mencionado
	if(!(msg.mentionedIds && msg.mentionedIds.length > 0)){
		SupportFunctions.simulateTyping(msg, "Nenhum contato mencionado.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//busca o contato e o(s) valor(es) da chave dos usuários mencionados
	let mentionedContacts = await Promise.all(msg.mentionedIds.map(async id =>{
		//busca dados do contato
		let contact = await client.getContactById(id)

		//monta a estrutura
		let user = {
			"id": contact.id.user,
			"contact": contact,
			"name": contact.verifiedName || contact.pushname
		}

		//busca o valor da chave
		let keyValue = SupportFunctions.getUserKey(user, settings.KEY)

		//adiciona à estrutura e retorna
		user.keyValue = Array.isArray(keyValue) ? keyValue.join(", ") : keyValue
		return user
	})).then((mentionedContacts) =>{
		return mentionedContacts
	})

	//inicia a resposta
	let resposta = `Valores cadastrados de ${settings.NOME} dos usuários mencionados:\n`
	let mentions = [];

	//monta o sufixo da chave, caso exista
	let sufix = settings.SUFIX ? settings.SUFIX : ''

	mentionedContacts.forEach(contact =>{
		mentions.push(contact.contact)
		let valor = contact.keyValue ? `${sufix}${contact.keyValue}` : `não cadastrado`
		resposta += `\n@${contact.id}: ${valor}`
	})

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data, mentions)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//envia as chaves do autor da msg
async function printauthorKey(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('userSettingsAuthor')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;


	//busca o o(s) valor(es) da chave dos autor da msg
	let keyValue = SupportFunctions.getUserKey(data.sender, settings.KEY)


	//inicia a resposta
	let resposta

	//se o usuário n tiver valor cadastrado
	if(!keyValue || keyValue.length == 0){
		let grep = settings.NEEDS_GREP ? '| ' : ''
		resposta = `Você não possui valor de ${settings.NOME} cadastrado. Para cadastrar um valor, utilize o comando _${settings.ADD_TRIGGER}${grep}<valor>_`
		SupportFunctions.simulateTyping(msg, resposta)

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//monta o sufixo da chave, caso exista
	let sufix = settings.SUFIX ? settings.SUFIX : ''

	//monta a resposta
	if(Array.isArray(keyValue)){
		resposta = `Seus ${settings.NOME_PLURAL} cadastrados: \n\n${sufix}${keyValue.join(', ')}`
	}else{
		resposta = `Seu ${settings.NOME} cadastrado: \n\n${sufix}${keyValue}`
	}

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//envia o menu com os comandos de uma chave específica
async function printKeyMenu(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('userSettingsMenu')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;


	//inicia a resposta
	let resposta
	let grep = settings.NEEDS_GREP ? '| ' : ''
	let addTrigger = settings.ADD_TRIGGER ? `\n➕ *${settings.ADD_TRIGGER}${grep}_valor_*: adiciona um novo valor de ${settings.NOME}` : ''
	let clearTrigger = settings.CLEAR_TRIGGER ? `\n❌ *${settings.CLEAR_TRIGGER}*: limpa os valores de ${settings.NOME} do usuário` : ''
	let deleteTrigger = settings.DELETE_TRIGGER ? `\n❌ *${settings.DELETE_TRIGGER}${grep}_valor_*: remove um valor específico de ${settings.NOME} do usuário` : ''
	let printAllTrigger = settings.PRINT_ALL_TRIGGER ? `\n📣 *${settings.PRINT_ALL_TRIGGER}*: envia os valores de ${settings.NOME} dos usuários do grupo` : ''
	let printUser = settings.PRINT_USER_TRIGGER ? `\n👥 *${settings.PRINT_USER_TRIGGER}${grep}_@usuário1 @usuário2_*: envia os valores de ${settings.NOME} dos usuários mencionados` : ''
	let printAuthor = settings.PRINT_AUTHOR_TRIGGER ? `\n👤 *${settings.PRINT_AUTHOR_TRIGGER}*: envia o valor de ${settings.NOME} do autor da mensagem` : ''
	let header = (addTrigger || clearTrigger || deleteTrigger || printAllTrigger || printUser || printAuthor) ? `Lista de comandos - ${settings.NOME}` : ''

	resposta = header ? `${header}${addTrigger}${clearTrigger}${deleteTrigger}${printAllTrigger}${printUser}${printAuthor}` : 'Não existem comandos cadastrados para a chave selecionada.'

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}


//envia o menu do bot
function sendMenu(msg){
	SupportFunctions.sendMenu(msg)
}

//envia os stats de uso do bot
async function botStats(msg){
	//busca o autor da msg
	const msgAuthor = await SupportFunctions.getAuthor(msg)

	//verifica se o autor da mensgem é um dos administradores do bot
	if(SupportFunctions.getBotAdmins().find(adm => adm === msgAuthor)){
		//pega as estatísticas ordenadas
		let botStats = SupportFunctions.buildBotStats()
		let msgsToSend = []
		if(msg.body.toLowerCase() === "@statsfull"){
			//monta a mensgem de ranking de funções
			let statsMsg = "Ranking de funções mais usadas: \n\n"

			for (let key in botStats.stats) {
				statsMsg +=  `Função: ${key} - ${botStats.stats[key]} vezes\n`
			}

			// statsMsg += botStats.stats.map(st => {
			// 	let text = `Função: ${st[0]} - ${st[1]} vezes`
			// 	return text
			// }).join('\n')
	
			//monta a mensgem de ranking de chats
			let chatUsageMsg = "Ranking dos chats que mais usam o bot: \n\n"

			for (let key in botStats.usage) {
				chatUsageMsg +=  `Função: ${key} - ${botStats.usage[key]} vezes\n`
			}
			// chatUsageMsg += botStats.usage.map(chat => {
			// 	let text = `ID do chat: ${chat[0]} - ${chat[1]} vezes`
			// 	return text
			// }).join('\n')

			msgsToSend.push({text: statsMsg}, {text: chatUsageMsg})
		}else{
			let comparedHeader = "Funções utilizadas desde a última checagem ("+botStats.compared.ts+"): \n\n"
			let comparedBody = ""
			let count = 0
			for (let key in botStats.compared) {
				if(key !== 'ts'){
					comparedBody +=  `Função: ${key} - ${botStats.compared[key]} vezes\n`
					count+= botStats.compared[key]
				}
			}

			let comparedCount = `Número de ativações: ${count}\n\n`
			comparedMsg = comparedHeader + comparedCount + comparedBody

			msgsToSend.push({text: comparedMsg})
		}

		 


		//envia as msgs
		SupportFunctions.sendSequentialMessages(msg, msgsToSend, true)
	}
}

//gera e envia um jogo de loteria de 6 jogos
async function generateLotterySet(msg){
	//adicionando à contagem
	SupportFunctions.count('loteria')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	let generated = SupportFunctions.generateLotterySet();
	SupportFunctions.simulateTyping(msg, `Jogo gerado: \n\n${generated}`)

	SupportFunctions.checkUserBotUsage(data)
}