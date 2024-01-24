//funções de visopoio
const path = require('path');
const request = require('request').defaults({encoding: null})
const fs = require('fs')
const dotenv = require('dotenv');
const rp = require('request-promise');
const { MessageMedia } = require('whatsapp-web.js');

// const { set } = require('shelljs');
dotenv.config()

module.exports = {

	//simula o estado 'digitando' antes de enviar uma mensagem
	simulateTyping: async function (msg, text, timer, inputChat, inputMentions, quotedMessage, quotedId){
		/*	
			Parametros de execução:
				msg: msg que disparou a ação
				text: texto que vai ser usado pra responder
				timer: tempo máximo que o bot vai ficar 'digitando' (random)
				inputChat: chat da mensagem (caso já tenha sido obtido pra validar grupo, por exemplo, não é necessário usar o getChat() novamente)
				mentions: array de mentions da mensagem
				quotedMessage: bool que indica se a mensagem vai ser enviada respondendo a mensagem que disparou a ação ou não
				quotedId: indica qual a mensagem que vai ser respondida. Se n passar, menciona o msg
		*/

		//mapeia os ids dos contatos, caso necessário, para seguir as novvas diretrizes da biblioteca https://github.com/pedroslopez/whatsapp-web.js/pull/2166
		let mentions = this.mapMentions(inputMentions)

		//caso o 'param' n seja passado, pega como padrão um máximo de 3 segundos
		var mult = timer || 3
		const chat = inputChat || await msg.getChat() 

		//se for pra responder uma mensagem específica
		let quotedMessageId
		if(quotedMessage){
			quotedMessageId = quotedId || msg.id._serialized
		}

		//ativa o 'digitando'
		await chat.sendStateTyping()

		//define por quanto tempo vai ficar digitando
		let i = this.getRandomInt(mult, true)

		setTimeout(function () {
			// após esperar i segundos, cancela o estado 'digitando' e envia a mensagem
			chat.clearState()
			chat.sendMessage(text, { mentions, quotedMessageId: quotedMessageId});
		}, i*1000);
	},

	//envia uma mensagem usando o client, com várias opções disponíveis
	sendMessage: async function (client, msg, content, caption, sendAsSticker, quotedId, stickerName, stickerAuthor, inputChat, delay){
		/*
			Parametros de execução
				client: entidade que executa o método de enviar a mensagem
				msg: msg de input, usada pra identificar o chat para qual o client vai enviar a mensagem
				content: conteudo a ser enviado
				caption: legenda da imagem
				sendAsSticker: bool pra indicar se a imagem vai ser enviada como sticker ou n
				quotedId: mensagem que tá sendo respondida
				stickerName: nome que aparece no sticker
				stickerAuthor: author do sticker
				inputChat: chat da mensagem (caso já tenha sido obtido pra validar grupo, por exemplo, não é necessário usar o getChat() novamente)
		*/

		//define o destinatário. Caso tenha sido passado um objeto msg, pega o .from dele. Se não tiver, pega o input, que ja vai estar no formato correto
		let from = msg.from || msg 

		let chat = inputChat || await msg.getChat()



		//monta a estrutura de opções de envio da mensagem e envia
		let options = {
			caption: caption,
			sendMediaAsSticker: sendAsSticker,
			quotedMessageId: quotedId,
			stickerName: stickerName,
			stickerAuthor: stickerAuthor
		}

		//ativa o 'digitando'
		await chat.sendStateTyping()

		//define por quanto tempo vai ficar digitando
		let i = delay === 0 ? delay : this.getRandomInt(3, true)


		setTimeout(function () {
			// após esperar i segundos, cancela o estado 'digitando' e envia a mensagem
			chat.clearState()
			client.sendMessage(from, content, options)
		}, i*1000);

	},

	//valida se uma frase contém uma expressão a partir de uma lista
	findInMessage: function(msg, words){
		return words.find(word => msg.includes(word));
	},

	//valida se uma frase é exatamente igual a uma expressão a partir de uma lista
	isMessage: function(msg, expressions){
		return expressions.find(expression => msg === expression);
	},

	//retorna os parametros de um comando @tts. 
	getTTSParams: function (body){
		/* 
			input: @tts exemplo de comando | black white 250
			output: {
				'comando': '@tts'
				'texto': exemplo de comando,
				'modifiers': ['black', 'white', 'transparent']
			}
		*/

		//4 primeiros caracteres
		var comando = body.slice(0,4)

		//resto da msg
		var texto = body.slice(4)
	
		//se tiver |, usar pra pegar os modifiers. Caso não haja, serão usados os parâmetros padrão da função TTs
		if(body.indexOf('|') > 0){
			//texto é o que tiver após os 4 primeiros caracteres (comando) e o '|'
			texto = body.slice(4, body.indexOf('|'))

			//os modifiers é o resto do texto após o '|' separado por espaço
			var modifiers = body.slice(body.indexOf('|')+2).split(' ')
		}
		
		return {
			"comando": comando, 
			"texto": texto,
			"modifiers": modifiers
		}
	},

	//adiciona um contador pra saber quais as funções mais usadas
	count: function (trigger){
		const contentFilePath = path.join(__dirname, '/../stats/stats.json')
		let count = load(contentFilePath)
		count.functions[trigger] = count.functions[trigger] || 0;
		count.functions[trigger] ++;
		save(count, contentFilePath)
	},

	//retorna o autor da mensgem no formato (apenas números) que será usado pra identificar as informações do autor, ou no formato Contact. 
	getAuthor: async function(msg, getContact, serialized){
		//retorna as informações de quem enviou a msg
		const sender = await msg.getContact()

		if(getContact){
			return sender
		}

		return serialized ? sender.id._serialized : sender.id.user
	},

	//retorna os dados de uma mensagem, incluindo seu chat e o autor da mensagem
	getMsgData: async function(msg, inputChat){
		const chat = inputChat || await msg.getChat()
		const sender = await msg.getContact()
		let data = {
			"msg": {
				id: await this.getMsgId(msg),
				data: msg,
				hasQuotedMsg: msg.hasQuotedMsg,
				timeStampMs: msg.timestamp ? msg.timestamp *1000 : null 
			},
			"sender":{
				contact: sender,
				id: sender.id.user,
				idSerialized: sender.id._serialized
			},
			"chat":{
				data: chat,
				isGroup: chat.isGroup,
				id: chat.id.user,
				idSerialized: chat.id._serialized, 
				name: chat.name
			}
		}

		return data
	},

	//carrega todas as configurações do bot a partir do arquivo bot_settings.json
	getBotSettings: function(){
		//monta o caminho do arquivo
		let contentFilePath = path.join(__dirname, '/../settings/bot_settings.json')
		let settings = load(contentFilePath);
		return settings
	},

	//retorna uma lista com os administradores do bot (configurados no .env)
	getBotAdmins: function(){
		let settings = this.getBotSettings()
		return settings.BOT_ADMINS
	},


	//retorna os dados de um grupo específico (caso exista um groupId), ou de todos os grupos. Se os dados do grupo ainda não existirem, inicializa e retorna
	loadGroupData: function(groupId, chat, bypassNameUpdate){
		//por padrão, sempre que essa função for chamada vai atualizar o nome do grupo. Quando a função for chamada pelo updateGroupName ela não entra na condição por causa do bypass (pra evitar loop)
		if(!bypassNameUpdate && chat){
			this.updateGroupName(chat)
		}

		//carrega todas as configurações dos grupos
		let contentFilePath = path.join(__dirname, '/../settings/group_settings.json')
		let settings = load(contentFilePath);

		//se tiver parametro na função, retorna a configuração específica daquele grupo
		if(groupId){
			//procura a configuração do grupo específico
			let groupSettings = settings.groups.find(group => group.id === groupId);

			//se não existir, inicializa a configuração, salva o arquivo e retorna a configuração inicializada
			if(!groupSettings){
				let newSettings = {
					"id": groupId,
					"settings": {}
				}
				
				settings.groups.push(newSettings)
				this.saveGroupData(settings);
				return newSettings;

			//se encontrar, retorna o objeto
			}else{
				return groupSettings;
			}
		//se não existir parâmetros, retorna todas as configurações
		}else{
			return settings;
		}

	},

	//função que salva as configurações de grupos
	saveGroupData: function(content, groupId, chat, bypassNameUpdate){
		//por padrão, sempre que essa função for chamada vai atualizar o nome do grupo. Quando a função for chamada pelo updateGroupName ela não entra na condição por causa do bypass (pra evitar loop)
		if(!bypassNameUpdate && chat){
			this.updateGroupName(chat)
		}

		//primeiro de tudo, define o path das configurações
		let contentFilePath = path.join(__dirname, '/../settings/group_settings.json')

		//se a função tiver recebido um groupId, só atualiza as configurações daquele grupo
		if(groupId){

			//carrega as configurações gerais
			let settings = this.loadGroupData();

			//procura o indice do grupo em questão
			let index = settings.groups.map(settings => settings.id).indexOf(groupId)

			//atualiza o indice com o content passado como parametro
			settings.groups[index] = content

			//salva as configurações
			save(settings, contentFilePath)
		
		//se n existir o parametro, atualiza toda a configuração recebida
		}else{
			save(content, contentFilePath)
		}
	},

	//atualiza o nome e ID de um determinado grupo nas configurações
	updateGroupName: function(chat){
		//nome do grupo 
		let id = chat.id.user;
		let idSerialized = chat.id._serialized;


		//carrega as configurações do grupo em questão
		let settings = this.loadGroupData(id);

		//atualiza
		let updated = this.updateSettings(settings, 'name', chat.name, 'replace')
		updated = this.updateSettings(updated, 'idSerialized', idSerialized, 'replace')

		//salva
		this.saveGroupData(updated, id, chat, true)
	},

	//retorna os dados de um usuário específico (caso exista um userId), ou de todos os usuários. Se os dados do usuário ainda não existirem, inicializa e retorna
	loadUserData: function(userId, user, bypassNameUpdate){
		//por padrão, sempre que essa função for chamada vai atualizar o nome do user. Quando a função for chamada pelo updateGroupName ela não entra na condição por causa do bypass (pra evitar loop)
		if(!bypassNameUpdate && user){
			this.updateUserName(user)
		}

		//carrega todas as configurações dos usuáeios
		let contentFilePath = path.join(__dirname, '/../settings/user_settings.json')
		let settings = load(contentFilePath);

		//se tiver parametro na função, retorna a configuração específica daquele usuario
		if(userId){
			//procura a configuração do usuario específico
			let userSettings = settings.contacts.find(contact => contact.id === userId);

			//se não existir, inicializa a configuração, salva o arquivo e retorna a configuração inicializada
			if(!userSettings){
				let newSettings = {
					"id": userId,
					"settings": {}
				}
				
				settings.contacts.push(newSettings)
				this.saveUserSettings(settings);
				return newSettings;

			//se encontrar, retorna o objeto
			}else{
				return userSettings;
			}
		//se não existir parâmetros, retorna todas as configurações
		}else{
			return settings;
		}

	},

	//atualiza o nome e ID de um determinado usuário nas configurações
	updateUserName: function(user){
		//nome do grupo 
		let id = user.id.user;
		let idSerialized = user.id._serialized;


		//carrega as configurações do usuário em questão
		let settings = this.loadUserData(id);

		//atualiza
		let updated = this.updateSettings(settings, 'name', (user.verifiedName || user.pushname), 'replace')
		updated = this.updateSettings(updated, 'idSerialized', idSerialized, 'replace')

		//salva
		this.saveUserSettings(updated, id, user, true)
	},

	//função que salva as configurações de usuários
	saveUserSettings: function(content, userId, user, bypassNameUpdate){
		//por padrão, sempre que essa função for chamada vai atualizar o nome do user. Quando a função for chamada pelo updateUserName ela não entra na condição por causa do bypass (pra evitar loop)
		if(!bypassNameUpdate && user){
			this.updateUserName(user)
		}

		//primeiro de tudo, define o path das configurações
		let contentFilePath = path.join(__dirname, '/../settings/user_settings.json')

		//se a função tiver recebido um userId, só atualiza as configurações daquele user
		if(userId){

			//carrega as configurações gerais
			let settings = this.loadUserData();

			//procura o indice do usuário em questão
			let index = settings.contacts.map(contact => contact.id).indexOf(userId)

			//atualiza o indice com o content passado como parametro
			settings.contacts[index] = content

			//salva as configurações
			save(settings, contentFilePath)
		
		//se n existir o parametro, atualiza toda a configuração recebida
		}else{
			save(content, contentFilePath)
		}
	},

	//função que atualiza um determinado parametro de um json
	updateSettings: function(object, key, value, operation){
		if(operation === 'replace'){
			object[key] = value
		}
		return object;
	},


	//valida se quem envou a mensagem é admin e se o bot é admin
	checkAdmins: async function(msg, inputChat){

		let result = {
			"sender": false,
			"bot": false,
			"group": false
		}

		//obtém o número de quem enviou a msg
		const sender = await this.getAuthor(msg)
		

		//busca dados do chat, caso n tenha sido passado como input
		const chat = inputChat || await msg.getChat()

		//valida que o chat é um grupo
		if(chat.isGroup){
			let settings = this.getBotSettings();
			//filtra só os admins e retorna um array de numeros 
			const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)
			
			//checa se o sender é admin
			result.sender = adminParticipants.indexOf(sender) !== -1;

			//checa se o bot é admin
			result.bot = adminParticipants.indexOf(settings.BOT_NR) !== -1;

			//checa se o grupo é autorizado
			result.group = await this.validateGroup(msg, chat)
		}


		return result
	},

	//valida que uma string segue o padrão dd/mm/aaaa de data
	validateDateString: function(string){
		let regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/
		return regexData.test(string)
	},

	//retorna se a opção de permitir que qualquer participante adicione contatos (allowAllAdd) está habilitada para o grupo 
	canAllAdd: async function(msg, inputChat){
		//Carrega os dados do chat
		const chat = inputChat || await msg.getChat()
	
		//carregando o arquivo com as configs
		let id = chat.id.user
		const groupSettings = this.loadGroupData(id, chat);

		return  groupSettings && groupSettings.settings && groupSettings.settings.allowAllAdd
	},

	//retorna uma lista WAIDs de contatos a partir de uma lista de vCards 
	getContactFromVCard: function(VCards){
		/*
			Estrutura do VCard:
			[
				BEGIN:VCARD
				VERSION:3.0
				N:;NOME_DO_CONTATO;;;
				FN:NOME_DO_CONTATO
				TEL;type=CELL;waid=WAID_DO_CONTATO:+NUMERO_DO_CONTATO
				X-WA-BIZ-NAME:NOME_DO_CONTATO
				END:VCARD
			]
			
			Retorno esperado: 
			[WAID_DO_CONTATO]
		*/
		let contatos;
		if(VCards && VCards.length){
			contatos = VCards.map(card =>{
				//busca o que estiver depois de 'waid='
				let waIdStart = card.slice(card.indexOf('waid=')+'waid='.length)
				
				//tira o que tiver depois do ':', que delimita o fim do WAID e adiciona '@c.us', que é o formato que a função de adicionar espera
				let waId = waIdStart.slice(0, waIdStart.indexOf(':'))+'@c.us'
				return waId;
			})
		}
		return contatos
	},

	//recebe uma msg ou uma lista de contatos e valida se o autor da mensagem ou algum dos contatos é criador do grupo (inputChat)
	isSudo: async function(msg, inputChat, contact){
		//se tiver recebido o parametro 'msg', o target é o autor da mensagem. Se tiver recebido uma lista de contatos, o target é a lista
		let target 
		if(msg){
			target = await this.getAuthor(msg)
		}else{
			target = contact
		}

		const chat = inputChat || await msg.getChat()

		//temp
		// console.log({target: target, part: chat.participants.map(part => {
		// 	return {
		// 		part: part.id.user,
		// 		isAdmin: part.isAdmin,
		// 		isSuperAdmin: part.isSuperAdmin
		// 	}
		// })})

		//se o chat é um grupo
		if(chat.isGroup){
			//filtra os adms do grupo
			const superAdminParticipants = chat.participants.filter(p => p.isSuperAdmin).map(p => p.id && p.id.user)
			//se o target for um array
			if(Array.isArray(target)){
				if(superAdminParticipants && superAdminParticipants.find(p => target.includes(p))){
					return true;
				}else{
					return false;
				}
				
			//se for um contato específico
			}else{
				if(superAdminParticipants && superAdminParticipants.find(p => p === target)){
					return true
				}else{
					return false
				}
			}
		}else{
			return false
		}
	},

	//recebe uma msg ou uma lista de contatos e mapeia as permissões do autor da mensagem ou da lista de contatos no grupo (inputChat)
	mapPermissions: async function(msg, inputChat, contacts){
		//se tiver recebido o parametro 'msg', o target é o autor da mensagem. Se tiver recebido uma lista de contatos, o target é a lista
		const target = contacts ? contacts : [await this.getAuthor(msg, false, true)]
		const chat = inputChat || await msg.getChat()
		

		//se o chat é um grupo
		if(chat.isGroup){
			//filtra os adms do grupo
			const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)
			
			//mapeia quais participantes são adm
			let mappedTargets = target.map(t =>{
				return {
					"id": t,
					"isAdm": adminParticipants.includes(this.formatNumber(t))
				}
			})

			return mappedTargets
		}else{
			return false
		}
	},

	//recebe um numero ou um WAID e retorna apenas o número (tira tudo que tá depois do @, se tiver). 
	// ex: input == 5538@c.us > output == 5538
	// input == 5538 > output == 5538
	formatNumber: function(number){
		let index = number.indexOf('@') < 0 ? number.length : number.indexOf('@')
		return number.slice(0, index)
	},

	//recebe um array de textos e envia as mensagens em sequência. Usado para enviar comandos corrigidos quando um usuário digitar errado
	sendSequentialMessages: async function(msg, array, secondsDelay){
		/**
		 	Input:
				msg,
				arr: [{
					"text",
					"mentions",
					"quoted",
					"quotedId"
				}]
		 */
		//se o delay n tiver sido passado, 
		let delay = secondsDelay || 1;
		for (let i = 0; i < array.length; i++) {
			await this.simulateTyping(msg, array[i].text, 1, null, array[i].mentions, array[i].quoted)
			await this.delay(delay*1000);
		}
	},

	//adiciona um delay entre execuções
	delay: function(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	//valida que um grupo é autorizado
	validateGroup: async function (msg, inputChat){
			//busca os dados do grupo
			const chat = inputChat || await msg.getChat()
			let id = chat.id.user

			let settings = this.loadGroupData(id, chat)
			return settings.authorized
	},


	//retorna uma lista de participantes de um determinado chat no formato de mention
	getParticipants: async function(msg, inputChat, client, number, includeBot, includeSender){

		//busca as informações de todos os contatos do chat
		let participants = await Promise.all(inputChat.participants.map(async part => {
			let contact = await client.getContactById(part.id._serialized)
			return {
				"contact": contact,
				"id": part.id.user,
				"name": contact.verifiedName || contact.pushname
			}
		})).then((participants) =>{
			return participants
		})

		//se não for pra incluir o bot, filtra 
		if(!includeBot){
			let settings = this.getBotSettings()
			participants = participants.filter(part => part.id !== settings.BOT_NR)
		}


		//se não for pra incluir quem enviou a mensagem, filtra
		if(!includeSender){
			let sender = await this.getAuthor(msg)
			participants = participants.filter(part => part.id !== sender)
		}

		//nenhum participante restante
		if(participants.length === 0){
			return false
		}


		//se tiver especificado um numero de participantes
		if(number){

			//valida que a lista tem o tamanho minimo
			if(participants.length < number){
				return false
			}

			//embaralha e pega o numero
			participants = this.randomPick(participants, number)
		}


		return participants
		
	},

	//gera um número inteiro de 0 até max-1, ou de 1-max caso 'sum' seja true. 
	//ex: getRandomInt(3) > 0, 1, 2.  getRandomInt(3, true) > 1, 2, 3
	getRandomInt: function(max, sum) {
		let i = 0;
		if(sum){
			i = 1
		}
		return i + Math.floor(Math.random() * max);
	},

	//retorna um presente aleatório da lista de presentes
	getPresente: function(){
		//carrega a lista de presentes a partir da pasta repositories
		let contentFilePath = path.join(__dirname, '/../repositories/presentes.json')
		let presentes = load(contentFilePath).presentes

		//seleciona um indice aleatório e retorna o selecionado
		let selected = presentes[this.getRandomInt(presentes.length)]
		return selected;
	},

	//retorna o id de uma mensagem pra replies
	getMsgId: function(msg){
		return msg.id._serialized
	},

	//recebe um input e filtra todos os caracteres que não são números
	filterNonNumbers: function(string){
		return string.replace(/\D/g, "");
	},

	//valida se a mensagem segue a estrutura da função de rolar um dado/gerar numero aleatório (@d#)
	checkD$structure: function(text){
		// Regular expression pattern
		let regex = /^@d\d+$/; 
		return regex.test(text);
	},

	//retorna os triggers configurados para o bot
	getTriggers: function(){
		//carrega a lista de triggers a partir da pasta repositories
		let contentFilePath = path.join(__dirname, '/../repositories/triggers.json')
		let triggers = load(contentFilePath).triggers
		return triggers
	},

	//retorna as configurações de tá pago de um determinado grupo a partir de um input chat (output.chat de this.getMsgData())
	getGroupTaPagoSettings(chat){
		let data = this.loadGroupData(chat.id, chat.data)
		let taPagoSettings = data.settings.taPagoSettings

		//se n tiver configurações de ta pago, inicializa 
		if(!taPagoSettings){
			data.settings.taPagoSettings = {}
			taPagoSettings = data.settings.taPagoSettings
			this.saveGroupData(data, chat.id, chat.data)
		}
		return taPagoSettings
	},

	//retorna a validade de uma msg pra um ta pago com foto
	checkTaPagoPhoto: async function(msg){
		//autor da msg original
		const author = await this.getAuthor(msg)
		let result = {
			hasPhoto: false,
			sameAuthor: true
		}
		//se a msg original tiver foto
		if(msg.hasMedia){
			result.hasPhoto = true
		}else{
			//se a msg não tiver foto, mas estiver mencionando outra
			if(msg.hasQuotedMsg){
				try{
					//busca os dados da mensagem mencionada e valida
					const quotedMessage = await msg.getQuotedMessage()
					const quotedAuthor = await this.getAuthor(quotedMessage)
					result.hasPhoto = quotedMessage.hasMedia
					result.sameAuthor = author === quotedAuthor
				}catch(e){
					console.log(e)
					this.simulateTyping(msg, 'Ops.. algo deu errado.')
				}
			}
		}

		return result;
	},

	//retorna os parametros de uma chave que serão utilizados nas funções de tá pago
	getTaPagoKeyParams: function (key, param){
		switch (key) {
			case 'taPagoFoto':
				return {
					'settingsKey': 'blockTaPagoSemFoto',
					'outputPhrase': param ? "Apenas tá pago's com fotos serão registrados." : "Tá pago's sem fotos serão aceitos."
				}
		
			case 'taPagoGlobal':
				return {
					'settingsKey': 'useGlobalTaPago',
					'outputPhrase': param ? "Todos os registros de 'tá pago' dos usuários serão aceitos." : "Apenas registros feitos nesse grupo serão aceitos."
				}
			case 'ignorarMentions':
				return {
					'settingsKey': 'ignorarMentions',
					'outputPhrase': param ? "Apenas a mensagem de confirmação será enviada a cada novo registro." : "A lista de tá pagos do dia vai ser incrementada a cada novo registro." 
				}
			case 'silentTaPago':
				return {
					'settingsKey': 'silentTaPago',
					'outputPhrase': param ? "Nenhuma mensagem será enviada em novos tá pagos." : "O bot irá responder a cada novo registro." 
				}
			default:
				break;
		}
	},

	//adiciona um emoji de reação a uma mensgem
	addMsgReaction: async function(msg, emoji){
		await msg.react(emoji)
	},

	//adiciona um emoji de erro a uma mensgem
	addErrorReaction: async function(msg){
		await this.addMsgReaction(msg, '❌')
	},

	//valida se uma mensagem dispara alguma função de tá pago a partir dos triggers configurados nas configurações do bot
	validateTaPagoTrigger(msg){
		//busca as configurações de tá pago do bot
		let settings = this.getBotSettings().TA_PAGO_SETTINGS;
		let found

		//procura se a mensagem dispara algum comando de adicionar
		found = settings.find(setting => setting.ADD_TRIGGERS && setting.ADD_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "add"
			}
		}

		//procura se a mensagem dispara algum comando de tá pagos do dia
		found = settings.find(setting => setting.DO_DIA_TRIGGERS && setting.DO_DIA_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "todays"
			}
		}

		//procura se a mensagem dispara algum comando de ausentes do dia
		found = settings.find(setting => setting.FALTANTES_TRIGGERS && setting.FALTANTES_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "missing"
			}
		}

		//procura se a mensagem dispara algum comando de tá pagos da ultima semana
		found = settings.find(setting => setting.ULTIMA_SEMANA_TRIGGERS && setting.ULTIMA_SEMANA_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "lastWeek"
			}
		}

		//procura se a mensagem dispara algum comando de tá pagos do usuário
		found = settings.find(setting => setting.USER_TA_PAGO_TRIGGERS && setting.USER_TA_PAGO_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "user"
			}
		}

		//procura se a mensagem dispara algum comando de ranking tá pago
		found = settings.find(setting => setting.RANKING_TRIGGERS && setting.RANKING_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "ranking"
			}
		}

		//procura se a mensagem dispara algum comando de sorteio da última semana
		found = settings.find(setting => setting.SORTEIO_TRIGGERS && setting.SORTEIO_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "sorteio"
			}
		}

		//procura se a mensagem dispara algum comando de menu do tá pago
		found = settings.find(setting => setting.MENU_TRIGGERS && setting.MENU_TRIGGERS.includes(msg))
		if(found){
			return {
				"settings": found,
				"function": "menu"
			}
		}

		return found
	},

	//busca os dados de tá pago de um grupo a partir das configurações do grupo
	getGroupSettingsTaPago: function(chat, key){
		//busca os dados do grupo
		let data = this.loadGroupData(chat.id, chat.data)

		//inicia a variável que vai determinar se os dados do grupo serão atualizados ou não
		let update = false

		//todos os taPagos do grupo
		let taPagos = data.taPagos;

		//se não existir, inicia e marca a flag pra atualizar
		if(!taPagos){
			taPagos = {}
			update = true
		}

		//valida se o grupo possui o registro específico e inicializa, caso não houver
		let registros = taPagos[key]
		if(!registros){
			registros = []
			taPagos[key] = registros;
			update = true
		}

		//se a flag for true, atualiza os dados retorna
		if(update){
			data.taPagos = taPagos
			this.saveGroupData(data, chat.id)
		}

		//retorna os registros
		return registros


	},

	//busca os dados de tá pago de um grupo
	getUserTaPago: function(user, key){
		//busca os dados do usuário
		let data = this.loadUserData(user.id, user.contact)

		//inicia a variável que vai determinar se os dados do usuário serão atualizados ou não
		let update = false

		//todos os taPagos do usuário
		let taPagos = data.taPagos;

		//se não existir, inicia e marca a flag pra atualizar
		if(!taPagos){
			taPagos = {}
			update = true
		}

		//valida se o usuário possui o registro específico e inicializa, caso não houver
		let registros = taPagos[key]
		if(!registros){
			registros = []
			taPagos[key] = registros;
			update = true
		}

		//se a flag for true, atualiza os dados retorna
		if(update){
			data.taPagos = taPagos
			this.saveUserSettings(data, user.id)
		}

		//retorna os registros
		return registros
	},

	//busca os dados de tá pago de um usuário em um grupo
	getUserTaPagoInGroup: function(user, chat, key){
		//busca os dados do grupo
		let data = this.getGroupSettingsTaPago(chat, key)

		//procura os registros daquele usuário em meio aos dados do grupo
		let userData = data.find(registro => registro.part === user.id)

		//busca os dados de um grupo
		let groupData = this.loadGroupData(chat.id, chat.data)


		//se não existir, inicializa e salva
		if(!userData){
			userData = {
				"part": user.id,
				"name": (user.contact.verifiedName || user.contact.pushname),
				'registros': [],
				"cancelados": []
			}

			groupData.taPagos[key].push(userData)

		//se existir, atualiza o nome do usuário nos registros do grupo
		}else{
			//atualiza o nome do usuário
			groupData.taPagos[key].find(data => data.part === user.id).name = (user.contact.verifiedName || user.contact.pushname)
		}
		
		//atualiza os dados
		this.saveGroupData(groupData, chat.id, chat.data)

		
		//retorna os registros
		return {
			registros: userData.registros,
			cancelados: userData.cancelados
		}

	},

	//valida se uma lista de tá pagos já possui um registro específico ou o do dia atual (caso o dia específico n tenha sido informado)
	hasDateTaPago: function (registros, date){
		let dateToFind = date || new Date().toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"});
		return registros && registros.find(reg => reg == dateToFind)
	},

	//adiciona um registro de tá pago nas configurações do usuário. Se já existir, não faz nada 
	addUserTaPago: function(sender, key, allowMultiple, reg){
		let newReg = reg || new Date().toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"});

		//busca os tá pago do usuário
		let registros = this.getUserTaPago(sender, key)

		//valida se já existe registro de hoje e retorna caso n puder múltiplos
		if(this.hasDateTaPago(registros, newReg) && !allowMultiple){
			return false
		}

		//se não existir, inclui o registro na lista
		registros.push(newReg)


		//atualiza os dados e salva
		let userData = this.loadUserData(sender.id, sender.contact)

		userData.taPagos[key] = registros
		this.saveUserSettings(userData, sender.id)
	},

	//adiciona um registro de tá pago nas configurações do grupo
	addGroupTaPago: function(data, key, allowMultiple, contact, reg){
		//se o parametro tiver sido passado, o usuário é o parametro. Se n, é o autor da msg inicial (sender)
		let user = contact || data.sender
		
		//identifica os tá pago do usuário dentro dos registros do grupo
		let userTaPago = this.getUserTaPagoInGroup(user, data.chat, key).registros

		//inclui o registro na lista
		let newReg = reg || new Date().toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"});
		userTaPago.push(newReg)

		//busca os dados do grupo
		let groupData = this.loadGroupData(data.chat.id, data.chat.data)

		//acha o indice do usuário nos ta pago do grupo
		let index = groupData.taPagos[key].map(registros => registros.part).indexOf(user.id)

		//atualiza os registros
		groupData.taPagos[key][index].registros = userTaPago


		//adiciona o registro nas configurações do usuário, se não houver
		this.addUserTaPago(user, key, allowMultiple, newReg)


		//salva os dados do grupo
		this.saveGroupData(groupData, data.chat.id, data.chat.data)

	},

	//remove um registro de tá pago das configurações do grupo
	removeGroupTaPago: function(msgData, toRevoke){
		//identifica os tá pago do usuário dentro dos registros do grupo
		let userTaPago = this.getUserTaPagoInGroup(toRevoke.author, msgData.chat, toRevoke.key)


		//quantidade de registros antes
		let beforeLength = userTaPago.registros.length

		//remove uma ocorrência do tá pago pro usuário
		userTaPago.registros = removeOneOccurrenceFromArray(userTaPago.registros, toRevoke.date)

		//quantidade de registros depois
		let afterLength = userTaPago.registros.length

		//se o tamanho mudou, significa que algum dos registros foi removido. nesse caso, dar push nos cancelados
		if(beforeLength > afterLength){
			let motivo = toRevoke.reason ? ' - Motivo: '+toRevoke.reason : ''
			let cancelados = userTaPago.cancelados || []
			cancelados.push(`${toRevoke.date}${motivo}`)
		}

		//busca os dados do grupo
		let groupData = this.loadGroupData(msgData.chat.id, msgData.chat.data)

		//acha o indice do usuário nos ta pago do grupo
		let index = groupData.taPagos[toRevoke.key].map(registros => registros.part).indexOf(toRevoke.author.id)

		//atualiza os registros
		groupData.taPagos[toRevoke.key][index].registros = userTaPago.registros
		groupData.taPagos[toRevoke.key][index].cancelados = userTaPago.cancelados

		//salva os dados do grupo
		this.saveGroupData(groupData, msgData.chat.id, msgData.chat.data)

	},

	//busca a lista de tá pagos dos participantes um grupo. Essa lista pode ser montada a partir da configuração do grupo (useGlobalTaPago = false) ou a partir 
	//das configurações individuais dos usuários do grupo (useGlobalTaPago = true)
	getGroupTaPago: async function(data, key, client){
		let taPagoSettings = this.getGroupTaPagoSettings(data.chat)
		let groupParticipants = await this.getParticipants(data.msg.data, data.chat.data, client, null, false, true)
		let registros
		//se o grupo usar tá pagos globais, busca individualmente de cada usuário do grupo
		if(taPagoSettings.useGlobalTaPago){
			registros = groupParticipants.map(part => {
				let userTaPago = this.getUserTaPago(part, key)
				let partData = {
					id: part.id,
					contactToMention: part.contact,
					registros: userTaPago
				}
				return partData
			})
			
			
		//se não, busca das configurações do grupo
		}else{
			registros = groupParticipants.map(part =>{
				let userTaPago = this.getUserTaPagoInGroup(part, data.chat, key)
				let partData = {
					id: part.id,
					contactToMention: part.contact,
					registros: userTaPago.registros, 
					cancelados: userTaPago.cancelados
				}

				return partData
			})
		}

		//filtra apenas participantes que possuem ao menos um registro de tá pago
		return registros.filter(reg => reg.registros && reg.registros.length > 0)
	},

	//recebe os tá pago de um grupo e monta a estrutura necessária pra retornar o ranking ou o diário
	getGroupTaPagoStruct: async function(data, key, client){

		//busca os tá pago do grupo
		let registros = await this.getGroupTaPago(data, key, client)

		//adiciona a contagem de tá pagos diário/semanal/mensal/anual/geral pra cada registro
		registros.map(reg =>{
			return this.addRegCount(reg)
		})

		return registros

	},


	//busca os tá pago do dia atual de um grupo
	getTodaysTaPagos: async function(data, key, client, type){
		//busca os tá pago do grupo
		let structuredRegistry = await this.getGroupTaPagoStruct(data, key, client)
		

		//se o type for missing, filtra apenas os participantes que possuem algum registro, mas não no dia de hoje. se não, busca os usuários que possuem algum registro hoje
		let filtered = type === "missing" ?  structuredRegistry.filter(reg => reg.todayCount === 0 && reg.geralCount > 0) : structuredRegistry.filter(reg => reg.todayCount > 0) 

		//ordena por número de registros
		filtered = sort(filtered, 'todayCount')

		return filtered
	},

	//busca os tá pago do dia atual de um grupo
	getTaPagoRanking: async function(data, key, client){
		//busca os tá pago do grupo
		let structuredRegistry = await this.getGroupTaPagoStruct(data, key, client)
		
		//separa os dados em 5 rankings diferentes
		let rankings = ['todayCount', 'weekCount', 'monthCount', 'yearCount', 'geralCount', 'cancelledCount', 'lastWeekCount']

		/*Estrutura de retorno do map: 
			[
				{
					'ranking': nome,
					'data':[{ (ordenada)
						userContact,
						userId,
						ranking,
						count
					}]
				}
			]
		*/
		let ranking = {}
		let mappedRanking = rankings.map(ranking => {
			//busca os registros dos usuários para aquele ranking
			let userData = structuredRegistry.map(userData => {
				return {
					contactToMention: userData.contactToMention,
					id: userData.id,
					ranking: ranking,
					count: userData[ranking]
				}
			})
		
			//retorna os registros ordenados
			return {
				"ranking": ranking,
				"data": sort(userData, 'count')
			}
		})

		//separa os registros gerais e filtra os > 0 pra retornar os registros semanais de todo mundo que tem ao menos um registro geral
		let geralCount = mappedRanking.find(ranking => ranking.ranking === "geralCount")
		geralCount.data = geralCount.data.filter(data => data.count > 0)


		mappedRanking.forEach(rank =>{
			//se for o ranking da ultima semana, busca todos os que têm ao menos um registro geral.
			if(rank.ranking === "lastWeekCount"){
				ranking[rank.ranking] = rank.data.filter(participant => geralCount.data.find(data => data.id === participant.id))
			//se não, filtra apenas os registros maiores que 0
			}else{
				ranking[rank.ranking] = rank.data.filter(data => data.count > 0)
			}
		})


		/*Estrutura de retorno do map: 
			{
				todayCount: [],
				weekCount: [],
				monthCount: [],
				yearCount: [],
				geralCount: [],
				lastWeekCount: []
			}
		*/

		//se não existir nada no ranking geral, significa que o grupo n tem nenhum registro
		if(ranking.geralCount.length === 0){
			return null
		}

		return ranking 
		
	},

	//adiciona as contagens (diário, semanal, mensal e anual) a um registro de tá pago
	addRegCount: function(userData){
		//registros do dia
		let today = new Date().toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"});
		userData.today = userData.registros.filter(registro => registro === today)
		userData.todayCount = userData.today.length

		//registros da semana
		let week = getFullWeek()
		userData.week = userData.registros.filter(registro => week.includes(registro))
		userData.weekCount = userData.week.length

		//retorna o dia atual no formato ['dd', 'mm', 'aaaa']
		let todaySplit = today.split('/')

		//retorna o mes atual no formato 'mm/aaaa'
		let month = [todaySplit[1], todaySplit[2]].join('/')

		//registros do mês
		userData.month = userData.registros.filter(registro => registro.indexOf(month) !== -1)
		userData.monthCount = userData.month.length


		//retorna o ano no formato 'aaaa'
		let year = todaySplit[2]

		//registros do ano
		userData.year =  userData.registros.filter(registro => registro.indexOf(year) !== -1)
		userData.yearCount = userData.year.length

		//registros gerais
		userData.geral = userData.registros
		userData.geralCount = userData.registros.length

		//registros cancelados
		userData.cancelled = userData.cancelados || []
		userData.cancelledCount = userData.cancelados? userData.cancelados.length : 0

		//registros da ultima semana
		let lastWeek = this.getLastWeekDates()
		userData.lastWeek = userData.registros.filter(registro => lastWeek.includes(registro))
		userData.lastWeekCount = userData.lastWeek.length

		return userData
	},


	//recebe uma mensagem de cancelamento/adição de tá pago e retorna os parâmetros para a remoção/adição daquele registro
	getAdhocTaPago: async function (msg, inputChat, client, operation){
		//inicia a variável
		let params = {};


		//busca as configurações de tá pago do bot. Isso vai servir pra puxar os identificadores de cada registro
		let settings = this.getBotSettings().TA_PAGO_SETTINGS
		let taPagoOptions = settings.map(sett => sett.KEY)
		

		//inicia o template de mensagens de erro de acordo com a operação a ser executada
		let dadosDaOperacao = {
			verbo: operation === "add" ? 'adicionar' : 'remover',
			comando: operation === "add" ? '@addTaPago' : '@cancel',
			motivo: operation === "add" ? '' : ' | motivo do cancelamento'
		}

		let errorTemplate = {
			"paramsErrorMessage":{
				"text": "Não foi possível obter os dados da mensagem mencionada. Para "+dadosDaOperacao.verbo+" um tá pago sem mensagem mencionada, copie a próxima mensagem e edite os parâmetros. As chaves disponíveis são: "+taPagoOptions.map(opt => "_"+opt+"_").join(', ')+".",
				"quoted": true
			},
			"quotedlessCommand":{
				"text": `${dadosDaOperacao.comando} chaveDoTaPago @pessoa_do_tapago dd/mm/aaaa${dadosDaOperacao.motivo}`,
				"quoted": true
			}
		}
		
		//se a msg estiver mencionando outra e for uma operação de cancelamento
		if(msg.hasQuotedMsg && operation === 'cancel'){
			//busca os dados da mensagem mencionada
			const quotedMessage = await msg.getQuotedMessage()

			//se não for possível obter os dados da mensagem mencionada
			if(!quotedMessage){
				let messages = [errorTemplate.paramsErrorMessage, errorTemplate.quotedlessCommand]
				throw messages
			}

			//se achou, valida qual foi o trigger disparado por aquela mensagem
			let found = this.validateTaPagoTrigger(quotedMessage.body.toLowerCase())

			//se nenhum trigger de adição for encontrado
			if(!(found && found.function === 'add')){
				let messages = [
					{
						"text": "Selecione uma mensagem de adição de 'tá pago' para remover o registro.",
						"quoted": true
				}]
				throw messages
			}


			//busca os dados da mensagem mencionada
			let msgData = await this.getMsgData(quotedMessage, inputChat)

			//o author é quem enviou a msg mencionada
			params.author = msgData.sender

			//se a msg mencionada retornar o timestamp, a data do tá pago é a data do timestamp. se não, deixar null pra entrar na validação
			params.date = msgData.msg.timeStampMs ? new Date(msgData.msg.timeStampMs).toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"}) : null

			//pega o corpo da mensagem original (a que contem o '@cancel')
			let body = msg.body.toLowerCase()

			//o motivo é tudo que tiver depois do | na mensagem inicial
			params.reason = body.indexOf('|') !== -1 ? body.slice(body.indexOf('|')+1) : ''

			//a chave e configurações do registro a ser removido são de acordo com a chave da trigger ativada
			params.key = found.settings.KEY
			params.settings = found.settings
			
		//se n tiver mensagem mencionada
		}else{
			//busca os parâmetros de execução na própria mensagem original
			params = await getAdhocTaPagoParams(msg, settings, client)
		}



		//valida que todas as informações necessárias pra remover um tá pago foram obtidas
		if(!(params && params.key && params.date && validateDateString(params.date) && params.author && params.author.id)){
			//inicia as variáveis default que vão ser usadas na resposta
			let author = '@pessoa_do_tapago'
			let mentions = []
			let date = 'dd/mm/aaaa'
			let reason = 'motivo do cancelamento'
			let key = 'chaveDoTaPago'

			//se o calculo dos parametros tiver retornado alguma coisa, utilizar os parâmetros corretos encontrados para facilitar a resposta. dessa forma, a pessoa só vai precisar de completar o que n tiver sido possível obter
			if(params){
				author = params.author ? '@'+params.author.id : author
				mentions = params.author ? [params.author.contact] : mentions;
				date = params.date || date
				reason = params.reason || reason
				key = params.key || key
			}

			//a estrutura do motivo só deve aparecer nas operações de cancelamento
			let templateMotivo = operation === "add" ? '' : ' | '+reason+''


			//a primeira mensagem de erro é a mensagem padrão
			let messages = [
				errorTemplate.paramsErrorMessage
			]


			//a segunda é a mensagem com as variáveis
			let commandMsg = `${dadosDaOperacao.comando} ${key} ${author} ${date}${templateMotivo}`
			messages.push({
				"text": commandMsg,
				"quoted": true,
				"mentions": mentions
			})

			//o throw vai fazer com que as mensagens sejam enviadas a partir do catch
			throw messages
		}

		//retorna os parametros
		return params;
	},

	//retorna as datas da última semana encerrada com base na data atual
    getLastWeekDates: function() {
		const umDiaMs = 24 * 60 * 60 * 1000
		
		// Data de hoje
		let date = new Date()

		// pega o dia da semana
		let currentDayOfWeek = date.getDay();
	
		// a quantidade de dias entre o dia de hj e o último domingo
		let daysToLastSunday = currentDayOfWeek + 7;
	
		// busca o ultimo domingo
		let lastSunday = new Date(date.getTime() - (daysToLastSunday * umDiaMs));
	
		// inicia o array
		let weekDates = [];
	
		// preenche o array com as datas a partir de domingo
		for (let i = 0; i < 7; i++) {
		let currentDate = new Date(lastSunday.getTime() + (i * umDiaMs)).toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"});
			weekDates.push(currentDate);
		}
	
		return weekDates;
	},

	//valida se uma mensagem dispara alguma função de adicionar user settings (pix, socials, etc)
	validateUserSettingsTrigger: function(msg){
		//busca as configurações de tá pago do bot
		let settings = this.getBotSettings().USER_KEY_SETTINGS;
		let found

		//procura se a mensagem dispara algum comando de adicionar
		found = settings.find(setting => setting.ADD_TRIGGER && msg.indexOf(setting.ADD_TRIGGER) == 0)
		if(found){
			return {
				"settings": found,
				"function": "add"
			}
		}

		//procura se a mensagem dispara algum comando de deletar uma chave específica
		found = settings.find(setting => setting.DELETE_TRIGGER && msg.indexOf(setting.DELETE_TRIGGER) == 0)
		if(found){
			return {
				"settings": found,
				"function": "delete"
			}
		}

		//procura se a mensagem dispara algum comando de limpar a chave
		found = settings.find(setting => setting.CLEAR_TRIGGER && setting.CLEAR_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "clear"
			}
		}

		//procura se a mensagem dispara algum comando de mandar todas as chaves cadastradas
		found = settings.find(setting => setting.PRINT_ALL_TRIGGER && setting.PRINT_ALL_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "all"
			}
		}

		//procura se a mensagem dispara algum comando de mandar chaves de usuários específicos
		found = settings.find(setting => setting.PRINT_USER_TRIGGER && msg.indexOf(setting.PRINT_USER_TRIGGER) == 0)
		if(found){
			return {
				"settings": found,
				"function": "user"
			}
		}

		//procura se a mensagem dispara algum comando de mandar chaves do autor da msg
		found = settings.find(setting => setting.PRINT_AUTHOR_TRIGGER && setting.PRINT_AUTHOR_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "author"
			}
		}

		//procura se a mensagem dispara algum comando de mandar o menu da chave
		found = settings.find(setting => setting.MENU_TRIGGER && setting.MENU_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "menu"
			}
		}

		return found
	},

	//valida se uma mensagem dispara alguma função de adicionar group settings (pix, socials, etc)
	validateGroupSettingsTrigger: function(msg){
		//busca as configurações de chaves de grupos do bot
		let settings = this.getBotSettings().GROUP_KEY_SETTINGS;
		let found

		//procura se a mensagem dispara algum comando de adicionar
		found = settings.find(setting => setting.ADD_TRIGGER && msg.indexOf(setting.ADD_TRIGGER) == 0)
		if(found){
			return {
				"settings": found,
				"function": "add"
			}
		}

		//procura se a mensagem dispara algum comando de deletar uma chave específica
		found = settings.find(setting => setting.DELETE_TRIGGER && msg.indexOf(setting.DELETE_TRIGGER) == 0)
		if(found){
			return {
				"settings": found,
				"function": "delete"
			}
		}

		//procura se a mensagem dispara algum comando de limpar a chave
		found = settings.find(setting => setting.CLEAR_TRIGGER && setting.CLEAR_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "clear"
			}
		}

		//procura se a mensagem dispara algum comando de mandar todas as chaves cadastradas
		found = settings.find(setting => setting.PRINT_VALUE_TRIGGER && setting.PRINT_VALUE_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "value"
			}
		}


		//procura se a mensagem dispara algum comando de mandar o menu da chave
		found = settings.find(setting => setting.MENU_TRIGGER && setting.MENU_TRIGGER === msg)
		if(found){
			return {
				"settings": found,
				"function": "menu"
			}
		}

		return found
	},

	//valida se uma mensagem dispara alguma função de gerador de nomes
	validateNameGeneratorTrigger: function(msg){
		//busca as configurações de geradores do bot
		let settings = this.getBotSettings().NAME_GENERATORS;

		//procura se a mensagem dispara algum trigger de gerador de nome
		return settings.find(setting => setting.TRIGGERS.includes(msg))
	},

	//busca as chaves cadastrdas para os usuários de um grupo 
	getGroupParticipantsKeys: async function(data, client, inputKeys){
		//busca os participantes do grupo
		let groupParticipants = await this.getParticipants(data.msg.data, data.chat.data, client, null, false, true)

		//pra cada participante
		groupParticipants = groupParticipants.map(participant =>{
			//se forem várias chaves, monta um array com as chaves especificadas pra cada participante
			if(Array.isArray(inputKeys)){
				participant.keySettings = inputKeys.map(key =>{
					//busca o valor de cada chave
					let keyValue = this.getUserKey(participant, key)

					//monta a estrutura
					let data = {
						"key": key,
						data: Array.isArray(keyValue) ? keyValue.join(", ") : keyValue
					}
					
					//se não tiver dados, significa que o usuário n tem chaves
					if(!data || data.length === 0){
						return null
					}

					return data

				//filtra só as chaves que possuem valor
				}).filter(key => key.data)
			}else{
				//busca a chave
				let keyValue = this.getUserKey(participant, inputKeys)

				//se forem permitidos vários vvalores pra uma mesma chave, concatena tudo em uma unica string
				participant.keySettings = Array.isArray(keyValue) ? keyValue.join(", ") : keyValue
			}

			return participant
		
			//filtra os participantes
		}).filter(part =>{
			//se forem várias chaves, filtra apenas os participantes que tem valor em pelo menos uma delas
			if(Array.isArray(inputKeys)){
				return part.keySettings.length > 0
			
			//se for só uma chave, filtra só os participantes que tem valor nela
			}else{
				return part.keySettings
			}
		})

		
		return groupParticipants
	},

	//busca o valor de uma chave específica para um usuário  
	getUserKey: function(user, key){
		//busca os dados do usuário
		let userData = this.loadUserData(user.id, user.contact)

		//inicia o objeto de chaves, caso n haja
		userData.keySettings = userData.keySettings || {}

		//retorna o valor da chave solicitada
		return userData.keySettings[key] || null
	},

	//busca o valor de uma chave específica para um grupo  
	getGroupKey: function(chat, key){
		//busca os dados do usuário
		let groupData = this.loadGroupData(chat.id, chat.data)
		let groupSettings = groupData.settings

		//inicia o objeto de chaves, caso n haja
		groupSettings.keySettings = groupSettings.keySettings || {}

		//retorna o valor da chave solicitada
		return groupSettings.keySettings[key] || null
	},

	//sorteia X itens aleatórios de um array
	randomPick: function (arr, qtd){
		if (qtd >= arr.length){
			return arr
		}
		
		return arr.sort(function() { return .5 - Math.random() })//embaralha o array
			.slice(0, qtd) //seleciona os itemms
	},

	//recebe um array de mentions e retorna o id._serialized das mentions
	mapMentions: function(mentions){
		if(mentions && mentions.length){
			return mentions.map(mention => {
				if(mention && mention.id && mention.id._serialized){
					return mention.id._serialized
				}else{
					return mention
				}
			})
		}else{
			return mentions
		}
	},

	//adiciona um contador de uso do bot por chat e envia a msg do pix com determinada frequencia
	checkUserBotUsage: function(msgData){
		//busca o contador
		const contentFilePath = path.join(__dirname, '/../stats/userBotUsage.json')
		let count = load(contentFilePath)


		//carrega as configurações do bot
		const settings = this.getBotSettings()

		//nao considerar os adm do bot
		if(settings.BOT_ADMINS.includes(msgData.sender.id)){
			return
		}

		//adiciona à contagem de uso daquele chat
		count.chats[msgData.chat.id] = count.chats[msgData.chat.id] || 0;
		count.chats[msgData.chat.id] ++;
		save(count, contentFilePath)


		//a cada 10 usos, envia a mensagem
		if(count.chats[msgData.chat.id] % 10 === 0){
			let opcoes = [/*'pagar um baseado',*/ 'pagar um cafezinho', 'dar uma moral', 'pagar uma sessão de terapia', 'dar um salve', 'pagar um boleto', 'pagar uma coquinha', 'pagar uma paçoca']
			//sorteia uma opção do array
			let sorteado = this.getRandomInt(opcoes.length)
			//let prefix = "🚨❗️🚨❗️*Aviso*: Por razões técnicas, o número do bot será alterado em breve. Para continuar utilizando as funções no novo número, sigam o instagram oficial que assim que o número mudar ele será disponibilizado por lá: instagram.com/wpp.bot 🚨❗️🚨\n\n"
			let msg = `Me siga no instagram: instagram.com/wpp.bot. \nGostou do bot e quer ${opcoes[sorteado]} pro dev? A chave pix é ${settings.PIX_BOT} 😉`

			this.simulateTyping(msgData.msg.data, msg, null, null, null, true)
		}
	},

	//manda um bom dia desmotivacional
	sendBomDia: async function(msg, client){
		//gera um numero aleatório de 1 a <qtd de imagens na pasta>
		let random = this.getRandomInt(403, true)

		//adicionando à contagem
		this.count('bomDia')

		//busca uma imagem aleatória
		const contentFilePath = path.join(__dirname, '/../imgs/bom dia do mal/bom dia do mal ('+random+').PNG')
		let image
		try{
			image = MessageMedia.fromFilePath(contentFilePath)
		}catch(e){
			this.simulateTyping(msg, 'Ops.. algo deu errado', null, null, null, true)
		}

		//envia a imagem
		if(image){
			this.sendMessage(client, msg, image, 'Bom dia 🥰😍❤️💕', false, this.getMsgId(msg))

			//adiciona à contagem de uso do chat
			let data = await this.getMsgData(msg)
			this.checkUserBotUsage(data)
		}

	},

	//incrementa a contagem das imagens de background pra evitar problemas de fila
	increaseBackgroundCount: function(){
		const COUNT_DIR = path.join(__dirname, '/../imgs/background_remover/count.json');
		let contador = load(COUNT_DIR)

		//ao chegar no máximo, volta pro início
		if(contador.count == contador.max){
			contador.count = contador.min
		}else{
			contador.count++
		}
		
		save(contador, COUNT_DIR)

		return contador.count
	},

	//monta os stats do bot
	buildBotStats: function(){
		const STATS_DIR = path.join(__dirname, '/../stats/stats.json');
		const BOT_USAGE_DIR = path.join(__dirname, '/../stats/userBotUsage.json');
		const LAST_DIR = path.join(__dirname, '/../stats/statsLast.json');

		//carrega os arquivos
		let stats = load(STATS_DIR)
		let usage = load(BOT_USAGE_DIR)
		let last = load(LAST_DIR)

		//ordena as chaves
		let sortedStats = orderObjectKeys(stats.functions)

		let sortedUsage = orderObjectKeys(usage.chats)
		let compared = {};

		for (let key in sortedStats) {
			if(key !== "ts"){
				//compara os usos de cada key
				let keyUsage = sortedStats[key] - last[key]
				if(keyUsage > 0){
					compared[key] = keyUsage
				}
			
			}else{
				
			}
		}

		//copia o timestamp da ultima checagem
		compared.ts = last.ts

		//ordena por numero de ativações
		compared = orderObjectKeys(compared)

		//adiciona o horário da checagem
		sortedStats.ts = new Date().toLocaleString("Pt-br", {timeZone: "America/Sao_Paulo"})
		save(sortedStats, LAST_DIR)


		return {
			"stats": sortedStats,
			"usage": sortedUsage,
			"compared": compared
		}
	},

	//faz backup dos arquivos do bot (stats/usage/)
	backup: function(msg){
		const STATS_DIR = path.join(__dirname, '/../stats/stats.json');
		const BOT_USAGE_DIR = path.join(__dirname, '/../stats/userBotUsage.json');
		const BOT_SETTINGS_DIR = path.join(__dirname, '/../settings/bot_settings.json');
		const USER_SETTINGS_DIR = path.join(__dirname, '/../settings/user_settings.json');
		const GROUP_SETTINGS_DIR = path.join(__dirname, '/../settings/group_settings.json');
		const BACKUP_DIR = path.join(__dirname, '/../utils/backup/');

		//carrega os arquivos
		let stats = {"data": load(STATS_DIR), "fileName": "stats"}
		let usage = {"data": load(BOT_USAGE_DIR), "fileName": "userBotUsage"}
		let botSettings = {"data": load(BOT_SETTINGS_DIR), "fileName": "bot_settings"}
		let userSettings = {"data": load(USER_SETTINGS_DIR), "fileName": "user_settings"}
		let groupSettings = {"data": load(GROUP_SETTINGS_DIR), "fileName": "group_settings"} 

		let backupTs = new Date().getTime()

		let filesData = [stats, usage, botSettings, userSettings, groupSettings];
		
		//pra cada um dos arquivos
		filesData.forEach(fileData =>{
			let backupPath = `${BACKUP_DIR}${fileData.fileName}.${backupTs}.json`
			save(fileData.data, backupPath)
		})
		
		this.simulateTyping(msg, "Backup Realizado")

	},

	//faz uma chamada pra uma api e retorna o resultado
	callApi: async function(params){
		try{
			let resp 
			await rp(params).then((res)=>{
				resp = JSON.parse(res)
			})
			return resp
		}catch(e){
			throw "Erro ao chamar a API.";
		}	
	},

	//baixa uma midia a partir de uma URL e envia como mensagem
	downloadFromURLAndSend: async function(url, msg, client, caption, sendAsSticker, sendTo, msgReaction){
		//define o destinatário da mensagem
		let to = sendTo || msg.from
		try{
			//baixa a imagem
			request.get(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					//monta a midia
					let media = new MessageMedia(response.headers["content-type"], Buffer.from(body).toString('base64'), 'downloadedMedia.jpg')
					
					//envia a mensagem com todos os parâmetros passados no input do método
					client.sendMessage(to, media, {caption: caption, quotedMessageId: msg.id._serialized, sendMediaAsSticker: sendAsSticker})
				}else{
					throw "erro ao baixar a imagem."
				}
			});

			//reage à msg, caso tenha sido passado o parâmetro
			if(msgReaction){
				this.addMsgReaction(msg, msgReaction)
			}
		}catch(e){
			this.addErrorReaction(msg)
			this.sendMessage(client, msg, 'Ops.. algo deu errado')
		}
	},

	generateLotterySet: function(){
		let set = []
		while (set.length < 6) {
			let number = this.getRandomInt(60, true)
			if(!set.includes(number)){
				set.push(number)
			}
		}
		return set.sort(function(a, b){return a-b}).join(', ')
	},

	//envia o menu do bot
	sendMenu(msg){
		let toLowerBody = msg.body.toLowerCase()

		//menu raiz
		if(toLowerBody == '@menu'){
			let rootMenu = "*Lista de funcionalidades*: \n\n"
				rootMenu += "🛠 *@menuUtils* -> Envia os comandos de utilitários"
				rootMenu += "\n🎉 *@menuEnt* -> Envia os comandos de entretenimento"
				rootMenu += "\n👷‍♀️ *@menuServ* -> Envia os comandos de consulta de serviços"
				rootMenu += "\n👥 *@menuGrupos* -> Envia os comandos utilitários para grupos"
				rootMenu += "\n📃 *@menuValores* -> Envia os comandos de valores que o bot pode salvar"
				rootMenu += "\n💪 *@menuTaPago* -> Envia os comandos de tá pago"
				rootMenu += "\n🔃 *@menuNovidades* -> Envia os últimos comandos implementados"

			this.simulateTyping(msg, rootMenu)
		}


		if(toLowerBody == '@menuutils'){
			let menuUtils = "*Lista de comandos utilitários:* \n\n"
				menuUtils += "🖼 *@sticker* -> faz uma figurinha a partir de uma imagem/gif. Para utilizar, envie o comando como legenda da foto ou respondendo uma mensagem com mídia"
				menuUtils += "\n🖼 *@bg* -> remove o fundo de uma imagem"
				menuUtils += "\n🖼 *@stickerbg* -> remove o fundo de uma imagem e envia como sticker"
				menuUtils += "\n📝 *@tts* -> transforma um texto em sticker. Para exemplos de utilização, digite _@tts_"
				menuUtils += "\n🔢 *@d#* -> gera um número aleatório entre 1 e o número selecionado. Ex: @d6, @d20, @d100, @d999"
				menuUtils += "💰 *@loteria* -> gera um jogo de 6 números aleatórios de 1 a 60"

			this.simulateTyping(msg, menuUtils)
		}

		if(toLowerBody == '@menuent'){
			let menuEnt = "*Lista de comandos de entretenimento:* \n\n"
				menuEnt += "✒️ *@geradores* -> gera um nome para você\n"
				menuEnt += "🍥 *@roletarussa* -> provavelmente, nada vai acontecer.. provavelmente\n"
				menuEnt += "⁉ *@tcm* -> Transa, Casa e Mata\n"
				menuEnt += "🎁 *@presente* -> descubra qual presente você ganhou\n"
				menuEnt += "💋 *@beijo* -> descubra quem do grupo vc quer pegar\n"
				menuEnt += "👅 *@sexo* -> descubra qual vai ser o esquema\n"
				menuEnt += "🔥 *@vddOuCons/@verdadeouconsequencia* -> Verdade ou consequência: sorteia um participante do grupo pra perguntar, outro pra responder\n"
			
			this.simulateTyping(msg, menuEnt)
		}

		if(toLowerBody == '@menuserv'){
			let menuServ = "*Lista de comandos de serviços:* \n\n"
				menuServ += "📧 *@rastreio codigo1 codigo2* -> faz o rastreio de uma encomenda nos correios\n"
				menuServ += "🌠 *@apod random* -> Envia uma APOD (Astronomy Picture of the Day) aleatória\n"
				menuServ += "🌠 *@apod dd/mm/aaaa* -> Envia a APOD (Astronomy Picture of the Day) de uma data específica\n"
				menuServ += "🌠 *@apod* -> Envia a APOD (Astronomy Picture of the Day) de hoje\n"
				menuServ += "🎥 *@filme nome do filme* -> Envia as informações de um filme\n"
				menuServ += "🎥 *@série nome da série* -> Envia as informações de uma série\n"
				menuServ += "🐈 *@gato/@cat/@gatinho/@gatinhu* -> Envia uma foto de um gato aleatório\n"
				menuServ += "🦆 *@pato* -> Envia uma foto de um pato aleatório\n"
				menuServ += "🐶 *@dog/@doguinho/@cachorro/@catchurro* -> Envia uma foto de um doguinho aleatório\n"
			
				this.simulateTyping(msg, menuServ)
		}

		if(toLowerBody == '@menugrupos'){
			let menuGrupos = "*Utilitários para grupos:* \n\n"
				menuGrupos += "📢 *@allAdd on/off* (apenas admins) -> permite/bloqueia que qualquer pessoa utilize as funções de adicionar um participante a um grupo\n"
				menuGrupos += "🔗 *@link* -> envia o link de convite do grupo\n"
				menuGrupos += "➕ *@add* -> adiciona um participante ao grupo a partir de um VCard\n"
				menuGrupos += "👑 *@admin/ @admin @pessoa1 @pessoa2* (apenas admins) -> dá (ou tira) admin do autor da mensagem mencionada ou dos usuários mencionados\n"
				menuGrupos += "❌ *@remove* (apenas admins) -> remove um participante do grupo (use respondendo uma mensagem de quem quer remover, ou mencionando a pessoa diretamente)\n"
				menuGrupos += "📢 *@closeGroup/@openGroup* -> Fecha o grupo para que só admins possam mandar mensagens/Abre o grupo pra qualquer membro mandar mensagem\n"
				menuGrupos += "📃 *@desc* -> Imprime a descrição do grupo\n"
				menuGrupos += "🍀 *@sorteio* -> sorteia algum membro do grupo inteiro, ou a partir de uma lista de menções (@sorteio @pessoa1 @pessoa2 @pessoa3). Para sortear mais de uma pessoa, utilize @sorteio # (substituindo o '#' pelo número desejado)\n"
				menuGrupos += "📣 *@everyone/@geral* (apenas admins de grupos autorizados) -> Menciona todo mundo do grupo"
				this.simulateTyping(msg, menuGrupos)
		}
			
		if(toLowerBody == '@menuvalores'){
			let menuValores = "*Lista de valores que o bot consegue armazenar (para exibir os comandos, digite o comando do menu correspondente):* \n\n"

			//busca as configurações do bot
			let botSettings = this.getBotSettings()

			//chaves de grupos
			let groupSettings = botSettings.GROUP_KEY_SETTINGS;

			//filtra as chaves 'publicas'
			let publicGroupSettings = groupSettings.filter(sett => !sett.PRIVATE)
			if(publicGroupSettings && publicGroupSettings.length > 0){
				menuValores += "👥 Valores para grupos: \n"
				menuValores += publicGroupSettings.map(sett => {
					return `Valor: *${sett.NOME}* - Menu: *${sett.MENU_TRIGGER}*`
				}).join('\n')
			}


			//chaves de usuários
			let userSettings = botSettings.USER_KEY_SETTINGS

			//filtra as chaves 'publicas'
			let publicUserSettings = userSettings.filter(sett => !sett.PRIVATE)
			if(publicUserSettings && publicUserSettings.length > 0){
				menuValores += "\n\n👤 Valores para usuários: \n"
				menuValores += publicUserSettings.map(sett => {
					return `Valor: *${sett.NOME}* - Menu: *${sett.MENU_TRIGGER}*`
				}).join('\n')
			}

			this.simulateTyping(msg, menuValores)

		}
		
		if(toLowerBody == '@menutapago'){
			let menuTaPago = "*Lista de comandos - Tá Pago*\n\n"
				menuTaPago += "*@taPagoOptions* -> Imprime os comandos específicos dos vários tipos de 'tá pago' cadastrados."
				menuTaPago += "\n\n*Os comandos a seguir só podem ser usados por administradores de grupos:*\n\n"
				menuTaPago += "🖼 *@tapagofoto on/off* -> habilita/desabilita a necessidade de enviar uma foto para registrar um tá pago\n"
				menuTaPago += "🌎 *@tapagoglobal on/off* -> habilita/desabilita o uso de tá pagos globais (usa todos os registros do usuário, e não só os daquele grupo)\n"
				menuTaPago += "🔇 *@ignorarMentions on/off* -> caso ativado, faz com que o bot responda a um novo registro de tá pago sem mencionar todo mundo que tem registro no dia\n"
				menuTaPago += "❌ *@cancel* -> cancela um registro de tá pago. Pode ser usado respondendo uma mensagem de adição de _tá pago_ ou seguindo o template _@cancel chaveDoTaPago @pessoa_do_tapago dd/mm/aaaa | motivo do cancelamento_\n"
				menuTaPago += "✅ *@addTaPago* -> adiciona um registro de tá pago. para ser usado, use o seguinte template: _@addTaPago chaveDoTaPago @pessoa_do_tapago dd/mm/aaaa_\n"
				menuTaPago += "#️⃣ *@frequencia #* -> configura a frequencia de tá pago para o grupo (substituindo o '#' pela frequencia desejada) ou mostra qual a frequencia do grupo (@frequencia)\n"	
				menuTaPago += "💰 *@valor #* -> configura o valor a ser pago por falta para o grupo (substituindo o '#' pelo valor desejado) ou mostra qual o valor configurado para o grupo (@valor)\n"
			this.simulateTyping(msg, menuTaPago)
		}	
		

		if(toLowerBody == '@menunovidades'){
			let ultimasFuncoes = "Últimas funções implementadas: \n\n"
				ultimasFuncoes += "💰 *@loteria* -> gera um jogo de 6 números aleatórios de 1 a 60"
			this.simulateTyping(msg, ultimasFuncoes)
		}
		
	},


	//cria um arquivo de log com um json
	log(obj){
		const LOG_DIR = path.join(__dirname, '/../utils/log.json');
		save(obj, LOG_DIR)
	}

};


//carrega um arquivo a partir de um path
function load(contentFilePath){
	const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
	const contentJson = JSON.parse(fileBuffer)
	return contentJson
}

//salva um arquivo a partir de um content e um path
function save(content, contentFilePath){
	const contentString = JSON.stringify(content)
	return fs.writeFileSync(contentFilePath, contentString)
}


//retorna os dias da semana atual no formato dd/mm/aaaa
function getFullWeek(){
	//um dia em milissegunds
    const umDiaMs = 24 * 60 * 60 * 1000;
	
	//dia da semana atual
    let day = new Date().getDay()
    
	//domingo da semana atual
    let dom = new Date(new Date().getTime() - (day*umDiaMs))
	
	//array de dias da semana
    let week = [dom.toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"})]

	//começando no domingo, adiciona todos os dias no array até sábado
    for(let i = 1; i<7; i++){
        week.push(new Date(new Date(dom).getTime() + (i*umDiaMs)).toLocaleDateString("Pt-br", {timeZone: "America/Sao_Paulo"}))
    }
    
	//retorna a semana
    return week
}

//ordena um objeto de acordo com os valores das suas chaves 
function orderObjectKeys(obj){
	let sortable = [];
	for (let key in obj) {
		sortable.push([key, obj[key]]);
	}

	sortable.sort(function(a, b) {
		return b[1] - a[1];
	});

	let formatted = {}

	sortable.forEach(k =>{
		formatted[k[0]] = k[1]
	})


	return formatted
}


//extrai os parametros de um tá pago avulso a partir de uma mensagem
async function getAdhocTaPagoParams(msg, settings, client){
	//estrutura da mensagem ideal:
	//@cancel chaveDoTaPago @pessoa_do_tapago dd/mm/aaaa | motivo do cancelamento
	//@add chaveDoTaPago @pessoa_do_tapago dd/mm/aaaa
	let body = msg.body || msg;

	//separa os parametros e remove os espaços vazios
	let bodySplit = body.split(' ').filter(param => param);

	//motivo é tudo que tiver depois da |
	let reason = body.indexOf('|') >= 0 ? body.substring(body.indexOf('|')+1) : ''

	//a chave é o primeiro parametro depois do comando
	let key = bodySplit[1].toLowerCase()

	//validando se chave é uma chave válida de acordo com as configurações
	let options = settings.map(sett => sett.KEY.toLowerCase())
	key = options.includes(key) ? key : ''

	//se a key for validada, buscar as configurações do tá pago em questão
	let keySettings 
	if(key){
		keySettings = settings.find(config => config.KEY.toLowerCase() === key)
	}
		

	//o autor do tá pago é quem tá mencionado na mensagem
	let authorId = msg.mentionedIds[0]

	//validando que houve uma mention
	if (!authorId){
		return null
	}

	//validando o contato do autor
	let authorContact = await client.getContactById(authorId)
	if(!authorContact){
		return null
	}

	//monta a estrutura do autor pra mencionar
	let author = {
		idSerialized: msg.mentionedIds[0],
		contact: authorContact,
		id: authorContact.id.user
	}


	//validando o autor
	if(!(author && author.idSerialized && author.contact && author.id)){
		author = ''
	}

	//a data é o terceiro parâmetro
	let date = bodySplit[3]

	//validando a estrutura da data
	date = validateDateString(date) ? date : ''


	//retorna a estrutura necessária para o cancelamento/adição
	return {
		'date': date,
		"reason": reason,
		"author": author,
		"key": keySettings.KEY,
		"settings": keySettings
  	}
}

//valida que uma string segue o padrão dd/mm/aaaa de data
function validateDateString(string){
	let regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/
	return regexData.test(string)
}

//função para ordenar um array de objetos a partir de uma chave desses objetos
function sort(arr, key){
    return arr.sort((a, b) =>{
        return b[key] - a[key]
    })
}


//recebe um input e um array. retorna o array sem uma ocorrencia do input (usado pra remover tá pagos)
function removeOneOccurrenceFromArray(arr, inputString) {
	const index = arr.indexOf(inputString);
	if (index !== -1) {
		arr.splice(index, 1);
	}
	return arr;
}


