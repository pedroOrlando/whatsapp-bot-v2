//funções utilitárias
const dotenv = require('dotenv');
const SupportFunctions = require('./supportFunctions.js')
// const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const { group, groupCollapsed } = require('console');
const supportFunctions = require('./supportFunctions.js');
dotenv.config()

module.exports = {
	reply: async function (msg, client){	
		const toLowerBody = msg.body.toLowerCase();

		//autorizando o grupo
		if (toLowerBody === "@teste" ) {
			await fetchMessages(msg)
		}


		//autorizando o grupo
		if (toLowerBody === "@allowgroup" ) {
			await allowGroup(msg)
		}

		//obtendo o link do grupo
		if(toLowerBody === '@link'){
			await getGroupLink(msg)
		}

		//adicionando contato(s)
		if(toLowerBody === '@add'){
			await addParticipant(msg)
		}

		//removendo contato(s)
		if(toLowerBody.indexOf('@remove') === 0){
			await removeParticipant(msg)
		}

		//promovendo/demovendo participantes a adm
		if(toLowerBody.indexOf('@admin') === 0){
			await toggleAdm(msg, client)
		}
		
		//ativando/desativando o modo de apenas admins mandarem mensagem 
		if(toLowerBody === "@opengroup" || toLowerBody === "@closegroup"){
			openCloseGroup(msg)
		}
		
		//envia a descrição do grupo
		if(toLowerBody === "@desc"){
			getGroupDesc(msg)
		}
		
		//mencionando todo mundo no grupo
		if(toLowerBody.indexOf("@everyone") === 0 || toLowerBody.indexOf("@geral") === 0){
			callEveryone(msg, client)
		}



		/*Funções Auxiliares - Tá Pago*/
		//cancelando um tá pago
		if(toLowerBody.indexOf("@cancel") === 0){
			revokeTaPago(msg, client)
		}

		//adicionando um tá pago 'adhoc'
		if(toLowerBody.indexOf("@addtapago") === 0){
			taPagoAdhoc(msg, client)
		}

		


		//alterando as permissões de adicionar no grupo
		if(toLowerBody.indexOf("@alladd") === 0){
			toggleAllAdd(msg)
		}

		//alterando as permissões tá pago com foto
		if(toLowerBody.indexOf("@tapagofoto") === 0){
			toggleTaPagoParam(msg, 'taPagoFoto')
		}

		//alterando as permissões tá pago global
		if(toLowerBody.indexOf("@tapagoglobal") === 0){
			toggleTaPagoParam(msg, 'taPagoGlobal')
		}

		
		//alterando as configurações de resposta de tá pagos (mentions na resposta)
		if(toLowerBody.indexOf("@ignorarmentions") === 0){
			toggleTaPagoParam(msg, 'ignorarMentions')
		}

		//alterando as configurações de resposta de tá pagos (resposta)
		if(toLowerBody.indexOf("@tapagosilencioso") === 0){
			toggleTaPagoParam(msg, 'silentTaPago')
		}

 
		let groupSettingsTrigger = SupportFunctions.validateGroupSettingsTrigger(toLowerBody)
		if(groupSettingsTrigger){
			switch (groupSettingsTrigger.function) {
				case 'add':
					updateGroupKeys(msg, groupSettingsTrigger.settings)
					break;
				case 'delete':
					deleteGroupKeys(msg, groupSettingsTrigger.settings)
					break;
				case 'clear':
					clearGroupKeys(msg, groupSettingsTrigger.settings)
					break;
				case 'value':
					printKeyValue(msg, groupSettingsTrigger.settings)
					break;
				case 'menu':
					printKeyMenu(msg, groupSettingsTrigger.settings)
					break;
				default:
					break;
			}
		}
    }
};



//autoriza um grupo a usar funções especiais que precisam desse nivel de autorização
async function allowGroup(msg){
	//busca o autor da msg
	const msgAuthor = await SupportFunctions.getAuthor(msg)

	//verifica se o autor da mensgem é um dos administradores do bot
	if(SupportFunctions.getBotAdmins().find(adm => adm === msgAuthor)){
		//busca os dados do grupo
		const chat = await msg.getChat();
		let id = chat.id.user



		//carrega as configurações do grupo
		let groupSettings = SupportFunctions.loadGroupData(id, chat);
		//se já tiver autorizado
		if(groupSettings.authorized){
			SupportFunctions.simulateTyping(msg, 'Grupo já autorizado')
		
		//se não tiver
		}else{
			//atualiza o valor
			groupSettings = SupportFunctions.updateSettings(groupSettings, 'authorized', true, 'replace')

			//salva as configurações
			SupportFunctions.saveGroupData(groupSettings, id, chat)
			SupportFunctions.simulateTyping(msg, 'Grupo autorizado',null, null, null, true)
		}
	}
}

//retorna o link de convite pra um grupo
async function getGroupLink(msg){
	//adicionando à contagem
    SupportFunctions.count('grouplink')
	const chat = await msg.getChat();

	if(chat.isGroup){
		//confere se o bot e o author são admins desse grupo, ou se o bot é admin e todo mundo pode adicionar
		let admins = await SupportFunctions.checkAdmins(msg, chat);

		if((admins.bot && admins.sender) || (admins.bot && await SupportFunctions.canAllAdd(msg, chat))){

			//busca o link do grupo
			const link = await chat.getInviteCode()
			if(link){
				SupportFunctions.simulateTyping(msg, "O link de convite para o grupo é: \n\nhttps://chat.whatsapp.com/"+link,null, null, null, true);
			}else{
				SupportFunctions.simulateTyping(msg, "Não foi possível obter o link do grupo no momento",null, null, null, true);
			}
			return;
		}else{
			SupportFunctions.simulateTyping(msg,'Esse comando só pode ser executado por administradores, ou para grupos com _@alladd on_. Além disso, eu preciso ser admin pra realizar a ação',null, null, null, true)
		}
	}else{
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
	}
} 


//adiciona participantes ao grupo
async function addParticipant(msg){
	//adicionando à contagem
    SupportFunctions.count('groupAdd')
	const chat = await msg.getChat();
	
	if(chat.isGroup){
		//confere se o bot e o author são admins desse grupo, ou se o bot é admin e todo mundo pode adicionar
		let admins = await SupportFunctions.checkAdmins(msg, chat);
		if((admins.bot && admins.sender) || (admins.bot && await SupportFunctions.canAllAdd(msg, chat))){
			//valida que a mensagem está mencionando alguma outra mensagem, que deve ter um VCard
			if(msg.hasQuotedMsg){

				try{
					//busca os dados da mensgem mencionada
					const quotedMessage = await msg.getQuotedMessage()

					//valida que a mensagem mencionada possui VCards
					if(quotedMessage && quotedMessage.vCards && quotedMessage.vCards.length > 0){
						try{
							let contacts = SupportFunctions.getContactFromVCard(quotedMessage.vCards)
							if(contacts){
								//usa o método da biblioteca pra adicionar os contatos que foram obtidos do VCard
								await chat.addParticipants(contacts).then(resp =>{
									SupportFunctions.simulateTyping(msg,'Contatos adicionados. Caso algum contato não tenha sido adicionado, pode ser devido configurações pessoais de privacidade, contato já é membro do grupo, ou contato inválido (número sem whatsapp). \nAdicionalmente, é possível utilizar o comando _@link_ para obter o link de convite do grupo',null, null, null, true)
								})
							//se não existir um contato, responder no chat
							}else{
								SupportFunctions.simulateTyping(msg,'Nenhum contato encontrado',null, null, null, true)
							}
						
						//caso aconteça algum erro, é possível usar o comando @link pra obter o link do grupo
						}catch(err){
							console.log(SupportFunctions.getContactFromVCard(quotedMessage.vCards))
							console.log(err)
							SupportFunctions.simulateTyping(msg,'Opa.. algo deu errado. Tente utilizar o comando _@link_ para obter o link de convite para o grupo',null, null, null, true)
						}
					
					//caso não exista vCards na mensagem mencionada, tenta adicionar o autor da mensagem mencionada
					}else{
						try{
							await chat.addParticipants([quotedMessage.author]).then(resp =>{
								SupportFunctions.simulateTyping(msg,'Contatos adicionados. Caso algum contato não tenha sido adicionado, pode ser devido configurações pessoais de privacidade, contato já é membro do grupo, ou contato inválido (número sem whatsapp). \nAdicionalmente, é possível utilizar o comando _@link_ para obter o link de convite do grupo',null, null, null, true)
							})
						}catch(err){
							SupportFunctions.simulateTyping(msg,'Opa.. algo deu errado. Tente utilizar o comando _@link_ para obter o link de convite para o grupo',null, null, null, true)
						}
					}
				//caso algo dê errado ao longo da execução
				}catch(err){
					console.log(err)
					SupportFunctions.simulateTyping(msg,'Ops.. algo deu errado. Tente utilizar o comando _@link_ para obter o link de convite para o grupo',null, null, null, true)
				}
			//caso não exista mensagem mencionada
			}else{
				SupportFunctions.simulateTyping(msg,'Nenhum contato encontrado',null, null, null, true)
			}
		//caso as configurações do grupo não permitam a adição do contato
		}else{
			SupportFunctions.simulateTyping(msg,'Esse comando só pode ser executado por administradores, ou para grupos com _@alladd on_. Além disso, eu preciso ser admin pra realizar a ação',null, null, null, true)
		}
	//caso o comando seja chamado fora de um grupo
	}else{
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
	}
}

//remove participantes do grupo
async function removeParticipant(msg){
	//adicionando à contagem
    SupportFunctions.count('groupRemove')

	// busca informações do chat
	const chat = await msg.getChat();

	//valida que o chat é um grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
		return;
	}

	//confere se o bot e o autor da msg são admins desse grupo
	const admins = await SupportFunctions.checkAdmins(msg, chat);
	if(!(admins.bot && admins.sender)){
		SupportFunctions.simulateTyping(msg,'Esse comando só pode ser executado por administradores. Além disso, eu preciso ser admin pra realizar a ação',null, null, null, true)
		return;
	}

	//se a trigger tiver sido só '@remove'
	if(msg.body.toLowerCase() === '@remove'){
		//se a mensagem tiver mencionando outra, o bot tenta remover o autor da msg mencionada
		if(msg.hasQuotedMsg){
			try{
				//busca os dados da msg mencionada
				const quotedMessage = await msg.getQuotedMessage()

				//define o autor da mensagem como o target pra remover 
				let author = quotedMessage && quotedMessage._data && quotedMessage._data.id && quotedMessage._data.id.participant && quotedMessage._data.id.participant._serialized
				let target = SupportFunctions.formatNumber(author)

				//valida se o autor da mensagem mencionada é o criador do grupo
				let sudo = await SupportFunctions.isSudo(null, chat, target)
					
				//se não for, tenta retirar
				if(!sudo){
					try{
						await chat.removeParticipants([author]).then(resp =>{
							SupportFunctions.simulateTyping(msg,'Contato removido.',null, null, null, true)
						})
					}catch(err){
						SupportFunctions.simulateTyping(msg,'Opa.. algo deu errado',null, null, null, true)
					}
				
				//se for, manda msg de erro
				}else{
					SupportFunctions.simulateTyping(msg,'Não é possível remover o criador do grupo.',null, null, null, true)
				}
				
			}catch(err){
				SupportFunctions.simulateTyping(msg,'Ops.. algo deu errado',null, null, null, true)
			}
		//se não tiver nenhuma mensagem mencionada, responde a mensagem enviada
		}else{
			SupportFunctions.simulateTyping(msg,'Nenhuma mensagem mencionada encontrada',null, null, null, true)
		}
	}

	//se a trigger tiver sido '@remove | ', o script espera que existam mentions na resposta
	if(msg.body.toLowerCase().indexOf('@remove |') === 0){
		//caso nenhum usuário tenha sido mencionado
		if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
			SupportFunctions.simulateTyping(msg,'Mencione alguém para remover do grupo',null, null, null, true);
		}else{
			//filtra os usuários que foram mencionados na mensagem
			let targets = msg.mentionedIds.map(id => SupportFunctions.formatNumber(id))

			//valida se algum deles é criador do grupo. Nesse caso, n é possível remover
			let sudo = await SupportFunctions.isSudo(null, chat, targets);

			if(!sudo){
				//tenta remover os participantes
				try{
					await chat.removeParticipants(msg.mentionedIds).then(resp =>{
						SupportFunctions.simulateTyping(msg,'Contatos removidos.',null, null, null, true)
					})
				}catch(err){
					SupportFunctions.simulateTyping(msg,'Opa.. algo deu errado',null, null, null, true)
				}
		
			//se o criador estiver entre os mencionados
			}else{
				SupportFunctions.simulateTyping(msg,'Não é possível remover o criador do grupo.',null, null, null, true)
			}
		}
	//caso o comando tenha sido mandado da forma errada, responde a mensagem com o comando correto
	}else if(msg.body.toLowerCase().indexOf('@remove ') === 0){
		let text = 'Para utilizar esse comando, copie a mensagem a seguir e edite os participantes mencionados';
		let command = '@remove | @pessoa1 @pessoa2';
		let messagesToSend = [{text: text}, {text: command}]
		await SupportFunctions.sendSequentialMessages(msg, messagesToSend, true)

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}
}

//promove/demove um participante a adm
async function toggleAdm(msg, client){
	//adicionando à contagem
    SupportFunctions.count('toggleAdm')

	// busca informações do chat
	const chat = await msg.getChat();

	//valida que o chat é um grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
		return;
	}

	//confere se o bot e o autor da msg são admins desse grupo
	const admins = await SupportFunctions.checkAdmins(msg, chat);
	if(!(admins.bot && admins.sender)){
		SupportFunctions.simulateTyping(msg,'Esse comando só pode ser executado por administradores. Além disso, eu preciso ser admin pra realizar a ação',null, null, null, true)
		return;
	}


	//se a msg n tiver mentions
	if(msg.body.toLowerCase() === '@admin'){
		//valida que existe uma msg mencionada
		if(msg.hasQuotedMsg){
			try{
				//busca os dados da msg mencionada
				const quotedMessage = await msg.getQuotedMessage()

				//valida se o autor da mensagem mencionada é o criador do grupo
				let sudo = await SupportFunctions.isSudo(quotedMessage, chat)

				//se não for, tenta retirar
				if(!sudo){

					//valida se o author é adm ou não
					let mappedTarget = await SupportFunctions.mapPermissions(quotedMessage, chat)
					mappedTarget = mappedTarget[0]

					try{
						//se for adm, tira o adm
						if(mappedTarget.isAdm){
							await chat.demoteParticipants([mappedTarget.id])
						//se não, coloca
						}else{
							await chat.promoteParticipants([mappedTarget.id])
						}

						SupportFunctions.simulateTyping(msg,'Contato alterado',null, null, null, true)
						SupportFunctions.addMsgReaction(msg, '✅')
						return

					}catch(err){
						console.log(err)
						SupportFunctions.simulateTyping(msg,'Opa.. algo deu errado',null, null, null, true)
						
						//reage à msg
						SupportFunctions.addErrorReaction(msg)
						return
						
					}
				
				//se for, manda msg de erro
				}else{
					SupportFunctions.simulateTyping(msg,'Não é possível alterar o criador do grupo.',null, null, null, true)

					//reage à msg
					SupportFunctions.addErrorReaction(msg)
					return
				}
			}catch(err){
				SupportFunctions.simulateTyping(msg,'Ops.. algo deu errado',null, null, null, true)

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
				return
			}
		}else{
			SupportFunctions.simulateTyping(msg,'Nenhuma mensagem mencionada encontrada',null, null, null, true)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}
	}else{
		//caso nenhum usuário tenha sido mencionado
		if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
			SupportFunctions.simulateTyping(msg,'Mencione alguém para alterar as permissões',null, null, null, true);

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}else{
			//filtra os usuários que foram mencionados na mensagem
			let targetIds = msg.mentionedIds.map(id => SupportFunctions.formatNumber(id))

			//valida se algum deles é criador do grupo. Nesse caso, n é possível alterar
			let sudo = await SupportFunctions.isSudo(null, chat, targetIds);

			if(!sudo){
				//valida quais participantes são adm e quais não são
				let mappedTargets = await SupportFunctions.mapPermissions(msg, chat, msg.mentionedIds)

				try{
					//filtra os adms e os não adms 
					let admins = mappedTargets.filter(targ => targ.isAdm).map(targ => targ.id)
					let nonAdmins = mappedTargets.filter(targ => !targ.isAdm).map(targ => targ.id)
					
					//promove os não adms e demove os adms
					await chat.demoteParticipants(admins)
					await chat.promoteParticipants(nonAdmins)

					SupportFunctions.simulateTyping(msg,'Contato(s) alterado(s).',null, null, null, true)

					SupportFunctions.addMsgReaction(msg, '✅')
					return
				}catch(err){
					SupportFunctions.simulateTyping(msg,'Opa.. algo deu errado',null, null, null, true)

					//reage à msg
					SupportFunctions.addErrorReaction(msg)
					return
				}
		
			//se o criador estiver entre os mencionados
			}else{
				SupportFunctions.simulateTyping(msg,'Não é possível alterar o criador do grupo.',null, null, null, true)

				//reage à msg
				SupportFunctions.addErrorReaction(msg)
				return
			}
		}
	}

}

//permite/bloqueia que todas as pessoas adicionem alguem ao grupo
async function toggleAllAdd(msg){

	//valida que o chat é um grupo
	const chat = await msg.getChat()
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, 'Comando disponível apenas para grupos.',null, null, null, true)
		return;
	}

	//valida que o comando foi enviado por um admin
	const admins = await SupportFunctions.checkAdmins(msg, chat);
	if(!admins.sender){
		SupportFunctions.simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.',null, null, null, true)
		return;
	}

	//extrai os parametros de execução
	let param = msg.body.split(' ')[1] || ''
	if(param.toLowerCase() === 'on'){
		param = true
	}else if(param.toLowerCase() === 'off'){
		param = false
	}else{
		SupportFunctions.simulateTyping(msg, 'Comando incorreto. Utilize "@allAdd on" ou "@allAdd off".',null, null, null, true)
		return;
	}

	//carrega as configurações do grupo
	let id = chat.id.user
	let groupSettings = SupportFunctions.loadGroupData(id, chat);

	//atualiza os parâmetros correspondentes
	groupSettings.settings = SupportFunctions.updateSettings(groupSettings.settings, 'allowAllAdd', param, 'replace')


	//salva as configurações
	SupportFunctions.saveGroupData(groupSettings, id, chat)

	//monta a frase e responde a msg
	let frase
	if(param){
		frase = "Qualquer pessoa pode adicionar contatos através do comando @add."
	}else{
		frase = "Apenas administradores podem utilizar o comando @add."
	}

	SupportFunctions.simulateTyping(msg,"Operaçao realizada. "+ frase,null, null, null, true)

}

//permite/bloqueia alguma configuração do ta pago
async function toggleTaPagoParam(msg, key){
	const data = await SupportFunctions.getMsgData(msg)

	//valida que o chat é um grupo
	const chat = data.chat.data
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg, 'Comando disponível apenas para grupos.',null, null, null, true)
		return;
	}

	//valida que o comando foi enviado por um admin
	const admins = await SupportFunctions.checkAdmins(msg, chat);
	if(!admins.sender){
		SupportFunctions.simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.',null, null, null, true)
		return;
	}

	

	//extrai os parametros de execução
	let param = msg.body.split(' ')[1] || ''
	if(param.toLowerCase() === 'on'){
		param = true
	}else if(param.toLowerCase() === 'off'){
		param = false
	}else{
		SupportFunctions.simulateTyping(msg, 'Comando incorreto. Utilize "@'+key+' on" ou "@'+key+' off".',null, null, null, true)
		return;
	}

	//busca os parametros de resposta de acordo com a chave passada
	let keyParams = SupportFunctions.getTaPagoKeyParams(key, param)

	//carrega as configurações do grupo
	let id = data.chat.id

	let taPagoSettings = SupportFunctions.getGroupTaPagoSettings(data.chat)

	//atualiza os parâmetros correspondentes nas configurações do taPago
	taPagoSettings = SupportFunctions.updateSettings(taPagoSettings, keyParams.settingsKey, param, 'replace')
	
	//atualiza as configurações gerais do grupo
	let groupData = SupportFunctions.loadGroupData(id, chat);
	groupData.settings.taPagoSettings = taPagoSettings;


	//salva as configurações
	SupportFunctions.saveGroupData(groupData, id, chat)

	//responde a msg
	SupportFunctions.simulateTyping(msg,"Operaçao realizada. "+ keyParams.outputPhrase,null, null, null, true)

}

//ativa/desativa o modo de apenas admins mandarem mensagem
async function openCloseGroup(msg){
	//adicionando à contagem
    SupportFunctions.count('openCloseGroup')
	
	// busca informações do chat
	const chat = await msg.getChat();

	//valida que o chat é um grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos',null, null, null, true)
		return;
	}

	//confere se o bot e o autor da msg são admins desse grupo
	const admins = await SupportFunctions.checkAdmins(msg, chat);
	if(!(admins.bot && admins.sender)){
		SupportFunctions.simulateTyping(msg,'Esse comando só pode ser executado por administradores. Além disso, eu preciso ser admin pra realizar a ação',null, null, null, true)
		return;
	}

	//se o comando for pra abrir, libera pra qualquer pessoa mandar mensagem
	if(msg.body.toLowerCase() === "@opengroup"){
		await chat.setMessagesAdminsOnly(false)
		SupportFunctions.simulateTyping(msg, "Qualquer membro pode enviar mensagem.",null, null, null, true)
	}

	//se o comando for pra fechar, bloqueia só pra admistrador mandar mensagens
	if(msg.body.toLowerCase() === "@closegroup"){
		await chat.setMessagesAdminsOnly([true])
		SupportFunctions.simulateTyping(msg, "Apenas administradores podem mandar mensagem.",null, null, null, true)
	}
}

//envia a descrição do grupo
async function getGroupDesc(msg){
	//adicionando à contagem
    SupportFunctions.count('groupDesc')
	
	const chat = await msg.getChat()
	//valida que o chat é um grupo
	if(chat.isGroup){
		//se tiver descrição
		if(chat && chat.groupMetadata && chat.groupMetadata.desc){
			SupportFunctions.simulateTyping(msg,"A descrição do grupo é: \n"+ chat.groupMetadata.desc,null, null, null, true)
		}else{
			SupportFunctions.simulateTyping(msg,"O grupo não possui descrição atualmente",null, null, null, true)
		}
	}else{
		SupportFunctions.simulateTyping(msg,"Comando disponível apenas para grupos.",null, null, null, true)
	}
} 

//menciona todo mundo do grupo
async function callEveryone(msg, client){
	//adicionando à contagem
    SupportFunctions.count('everyone')
	
	const chat = await msg.getChat();
	
	//valida que é grupo
	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,'Comando disponível apenas para grupos.',null, null, null, true)
		return;
	}


	//checa permissões da msg (se quem enviou é adm e se o grupo é autorizado)
	const perms = await SupportFunctions.checkAdmins(msg, chat)
	if(!perms.group){
		SupportFunctions.simulateTyping(msg,'Grupo não autorizado.',null, null, null, true)
		return;
	}

	if(!perms.sender){
		SupportFunctions.simulateTyping(msg,'Apenas administradores podem usar esse comando.',null, null, null, true)
		return;
	}

	
	//busca os participantes do grupo
	let participants = await SupportFunctions.getParticipants(msg, chat, client)
	
	//monta o texto com as menções aos participantes
	let text = "";
	let mentions = [];
	participants.forEach(part =>{
		mentions.push(part.contact)
		text += `@${part.id} `;
	})

	//se tiver mensagem mencionada, o bot vai responder a mencionada. se n, vai responder a msg com o comando
	let quotedId = msg.id._serialized;
	if(msg.hasQuotedMsg){
		const quotedMessage = await msg.getQuotedMessage()
		quotedId = quotedMessage && quotedMessage.id && quotedMessage.id._serialized
	}


	//monta a mensagem e envia
	SupportFunctions.simulateTyping(msg, text, 3, chat, mentions, quotedId, quotedId)
}

//cancela um registro de tá pago
async function revokeTaPago(msg, client){
	//adicionando à contagem
    SupportFunctions.count('cancelTaPago')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,"Comando disponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	let admins = await SupportFunctions.checkAdmins(msg, chat.data)

	if(!admins.sender){
		SupportFunctions.simulateTyping(msg,"Apenas administradores podem usar esse comando.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	let taPagoSettings = SupportFunctions.getGroupTaPagoSettings(chat)
	if(taPagoSettings.useGlobalTaPago){
		SupportFunctions.simulateTyping(msg,"Comando indisponível para grupos que utilizam _tá pagos_ globais.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	let toRevoke
	try{
		toRevoke = await SupportFunctions.getAdhocTaPago(msg, chat, client, 'cancel')
	}catch(e){
		if(Array.isArray(e)){
			SupportFunctions.sendSequentialMessages(msg, e)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}else{
			SupportFunctions.simulateTyping(msg,"Ops, algo deu errado ao obter os parâmetros de cancelamento.")
	
			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}
	}

	try{
		SupportFunctions.removeGroupTaPago(data, toRevoke)
	}catch(e){
		SupportFunctions.simulateTyping(msg,"Ops, não foi possível remover o registro do usuário.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}


	let motivo = toRevoke.reason ? `Motivo : ${toRevoke.reason}` : ''
	let mentions = [toRevoke.author.contact]
	SupportFunctions.simulateTyping(msg,`Registro ${toRevoke.date} de ${toRevoke.key} do usuário @${toRevoke.author.id} removido ou não encontrado. ${motivo}`, null, chat.data, mentions, true)
	SupportFunctions.addMsgReaction(msg, '✅')
}

//adiciona um tá pago manualmente
async function taPagoAdhoc(msg, client){
	//adicionando à contagem
    SupportFunctions.count('addTaPago')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	if(!chat.isGroup){
		SupportFunctions.simulateTyping(msg,"Comando disaponível apenas para grupos.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//valida quem mandou a msg
	let admins = await SupportFunctions.checkAdmins(msg, chat.data)
	if(!admins.sender){
		SupportFunctions.simulateTyping(msg,"Apenas administradores podem usar esse comando.")

		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//busca os parametros de adição do registro
	let toAdd
	try{
		toAdd = await SupportFunctions.getAdhocTaPago(msg, chat, client, "add")
	}catch(e){
		if(Array.isArray(e)){
			SupportFunctions.sendSequentialMessages(msg, e)

			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}else{
			console.log(e)
			SupportFunctions.simulateTyping(msg,"Ops, algo deu errado ao obter os parâmetros de adição.")
	
			//reage à msg
			SupportFunctions.addErrorReaction(msg)
			return
		}
	}

	//buscando as mentions para a resposta
	let mentions = [toAdd.author.contact]

	//busca configurações de taPago do grupo
	let taPagoSettings = SupportFunctions.getGroupTaPagoSettings(chat)

	//busca os tá pago do usuário
	let userTaPago

	//caso o grupo use tá pagos globais, busca os registros salvos no usuário
	if (taPagoSettings.useGlobalTaPago) {
		userTaPago = SupportFunctions.getUserTaPago(toAdd.author, toAdd.key)

	//caso contrário, busca os registros do usuário no grupo
	} else {
		userTaPago = SupportFunctions.getUserTaPagoInGroup(toAdd.author, data.chat, toAdd.key).registros
	}

	//valida se o registro já existe nos tá pago do usuário e se as configurações permitem registros múltiplos
	const IS_MULT = SupportFunctions.hasDateTaPago(userTaPago, toAdd.date);
	if(IS_MULT && !toAdd.settings.ALLOW_MULTIPLE){
		SupportFunctions.simulateTyping(msg,`O usuário @${toAdd.author.id} já possui o registro ${toAdd.date} de ${toAdd.key}.`, null, chat.data, mentions, true)
	
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		return
	}

	//adiciona o registro à contagem
	SupportFunctions.addGroupTaPago(data, toAdd.key, toAdd.settings.ALLOW_MULTIPLE, toAdd.author, toAdd.date)

	//responde e reage à msg
	SupportFunctions.simulateTyping(msg,`${toAdd.key} ${toAdd.date} adicionado para o usuário @${toAdd.author.id}.`, null, chat.data, mentions, true)
	SupportFunctions.addMsgReaction(msg, toAdd.settings.EMOJI)

}

//adiciona um valor a alguma configuração de chave do grupo
async function updateGroupKeys(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('groupSettingsUpdate')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	
	//se n for grupo, ignora
	if(!data.chat.isGroup){
		return;
	}


	//valida se o comando é apenas para admins
	if(settings.ADMIN_ONLY)	{
		const admins = await SupportFunctions.checkAdmins(msg, data.chat.data);
		if(!admins.sender){
			SupportFunctions.simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.',null, null, null, true)
			return;
		}
	}


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

	//se a chave exigir normalização (tudo minusculo)
	if(settings.NORMALIZE){
		valor = valor.toLowerCase()
	}

	//busca as configurações do grupo
	let groupData = SupportFunctions.loadGroupData(data.chat.id, data.chat.data)
	let groupSettings = groupData.settings

	//inicia a configuração de chaves, caso não haja
	groupSettings.keySettings = groupSettings.keySettings || {}

	//monta a resposta
	let resposta
	
	//se a chavve permitir vários valores 
	if(settings.ALLOW_MULTIPLE){
		//inicia o array, caso n exista
		groupSettings.keySettings[settings.KEY] = groupSettings.keySettings[settings.KEY] || []
		groupSettings.keySettings[settings.KEY].push(valor)
		resposta = `Valor ${valor} adicionado aos ${settings.NOME_PLURAL} do grupo. Para conferir todos os valores salvos, utilize o comando _${settings.PRINT_VALUE_TRIGGER}_`
	}else{
		//atualiza o valor
		groupSettings.keySettings[settings.KEY] = valor
		resposta = `${settings.NOME} do grupo atualizado com o valor *${valor}*. Para consultar o valor salvo, utilize o comando _${settings.PRINT_VALUE_TRIGGER}_`
	}

	//atualiza o valor nas configurações
	groupData = SupportFunctions.updateSettings(groupData, 'settings', groupSettings, 'replace')

	//salva as configurações
	SupportFunctions.saveGroupData(groupData, data.chat.id, data.chat.data)

	//responde
	SupportFunctions.simulateTyping(msg, resposta)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//remove um valor específico de uma chave
async function deleteGroupKeys(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('groupSettingsDelete')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//se n for grupo, ignora
	if(!data.chat.isGroup){
		return;
	}

	//valida se o comando é apenas para admins
	if(settings.ADMIN_ONLY)	{
		const admins = await SupportFunctions.checkAdmins(msg, data.chat.data);
		if(!admins.sender){
			SupportFunctions.simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.',null, null, null, true)
			return;
		}
	}

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
	

	//se a chave não permitir espaço
	if(!settings.ALLOW_SPACES){
		valor = valor.replace(/\s/g, '')
	}

	//se a chave exigir normalização (tudo minusculo)
	if(settings.NORMALIZE){
		valor = valor.toLowerCase()
	}

	//busca as configurações do grupo
	let groupData = SupportFunctions.loadGroupData(data.chat.id, data.chat.data)
	let groupSettings = groupData.settings
	
	//inicia a configuração de chaves, caso não haja
	groupSettings.keySettings = groupSettings.keySettings || {}

	//monta a resposta
	let resposta
	let emoji

	//se a chave permitir vários valores 
	if(settings.ALLOW_MULTIPLE){
		//inicia o array, caso n exista
		groupSettings.keySettings[settings.KEY] = groupSettings.keySettings[settings.KEY] || []
		groupSettings.keySettings[settings.KEY] = groupSettings.keySettings[settings.KEY].filter(key => key !== valor)
		resposta = `Valor ${valor} removido ou não encontrado nos seus ${settings.NOME_PLURAL}. Para conferir todos os valores salvos, utilize o comando _${settings.PRINT_VALUE_TRIGGER}_`
		emoji = '✅'
	}else{
		//atualiza o valor
		resposta = `Para limpar o valor cadastrado do seu ${settings.NOME}, utilize o comando _${settings.CLEAR_TRIGGER}_`
		emoji = '❌'
	}

	//atualiza o valor nas configurações
	groupData = SupportFunctions.updateSettings(groupData, 'settings', groupSettings, 'replace')

	//salva as configurações
	SupportFunctions.saveGroupData(groupData, data.chat.id, data.chat.data)

	//responde
	SupportFunctions.simulateTyping(msg, resposta)

	//reage
	SupportFunctions.addMsgReaction(msg, emoji)
}

//limpa os valores de uma chave especifica
async function clearGroupKeys(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('groupSettingsClear')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//se n for grupo, ignora
	if(!data.chat.isGroup){
		return;
	}

	//valida se o comando é apenas para admins
	if(settings.ADMIN_ONLY)	{
		const admins = await SupportFunctions.checkAdmins(msg, data.chat.data);
		if(!admins.sender){
			SupportFunctions.simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.',null, null, null, true)
			return;
		}
	}

	//busca as configurações do grupo
	let groupData = SupportFunctions.loadGroupData(data.chat.id, data.chat.data)
	let groupSettings = groupData.settings
	
	//inicia a configuração de chaves, caso não haja
	groupSettings.keySettings = groupSettings.keySettings || {}

	//monta a resposta
	let resposta
	let grep = settings.NEEDS_GREP ? '| ' : ''
	//se a chave permitir vários valores 
	if(settings.ALLOW_MULTIPLE){
		//inicia o array, caso n exista
		groupSettings.keySettings[settings.KEY] = []
		resposta = `Lista de ${settings.NOME_PLURAL} apagada. Para adicionar um novo valor, utilize o comando _${settings.ADD_TRIGGER}${grep}valor_`
	}else{
		//atualiza o valor
		groupSettings.keySettings[settings.KEY] = null
		resposta = `Valor de ${settings.NOME} apagado. Para inserir um novo valor, utilize o comando _${settings.ADD_TRIGGER}${grep}valor_`
	}

	//atualiza o valor nas configurações
	groupData = SupportFunctions.updateSettings(groupData, 'settings', groupSettings, 'replace')

	//salva as configurações
	SupportFunctions.saveGroupData(groupData, data.chat.id, data.chat.data)

	//responde
	SupportFunctions.simulateTyping(msg, resposta)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//envia as chaves de determinados participantes
async function printKeyValue(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('printGroupKeyValue')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//se n for grupo, ignora
	if(!data.chat.isGroup){
		return;
	}


	//busca as configurações do grupo
	let keyValue = SupportFunctions.getGroupKey(chat, settings.KEY)
	let resposta

	//se não existir valor
	if(!keyValue || keyValue.length == 0){
		let grep = settings.NEEDS_GREP ? '| ' : ''
		resposta = `Valor de ${settings.NOME} não cadastrado para o grupo. Para adicionar um valor, utilize o comando _${settings.ADD_TRIGGER}${grep}<valor>_`

		//responde
		SupportFunctions.simulateTyping(msg, resposta, 1, chat.data)

		//reage à msg
		SupportFunctions.addErrorReaction(msg)

		return
	}

	//se for um array, concatena os valores
	let joinString = settings.LINE_BREAK ? '\n' : ', '
	keyValue = Array.isArray(keyValue) ? keyValue.join(joinString) : keyValue

	//inicia a resposta
	resposta = `Valor de ${settings.NOME} cadastrado para o grupo:\n\n${keyValue}`

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

//envia as chaves do autor da msg
async function printKeyMenu(msg, settings){
	//adicionando à contagem
	SupportFunctions.count('groupSettingsMenu')

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	const chat = data.chat;

	//se n for grupo, ignora
	if(!chat.isGroup){
		return;
	}


	//inicia a resposta
	let resposta
	let grep = settings.NEEDS_GREP ? '| ' : ''

	let addTrigger = settings.ADD_TRIGGER ? `\n➕ *${settings.ADD_TRIGGER}${grep}_valor_*: adiciona um novo valor de ${settings.NOME}` : ''
	let clearTrigger = settings.CLEAR_TRIGGER ? `\n❌ *${settings.CLEAR_TRIGGER}*: limpa os valores de ${settings.NOME} do grupo` : ''
	let deleteTrigger = settings.DELETE_TRIGGER ? `\n❌ *${settings.DELETE_TRIGGER}${grep}_valor_*: remove um valor específico de ${settings.NOME_PLURAL} do grupo` : ''
	let printValue = settings.PRINT_VALUE_TRIGGER ? `\n👤 *${settings.PRINT_VALUE_TRIGGER}*: envia o valor de ${settings.NOME} do grupo` : ''
	let header = (addTrigger || clearTrigger || deleteTrigger || printValue) ? `Lista de comandos - ${settings.NOME}` : ''

	resposta = header ? `${header}${addTrigger}${clearTrigger}${deleteTrigger}${printValue}` : 'Não existem comandos cadastrados para a chave selecionada.'

	//responde
	SupportFunctions.simulateTyping(msg, resposta, 1, chat.data)

	//reage
	SupportFunctions.addMsgReaction(msg, '✅')
}

async function fetchMessages(msg){
	const data = await SupportFunctions.getMsgData(msg)
	let messages = await data.chat.data.fetchMessages({limit: 100})
	console.log('entrou')
	SupportFunctions.log(messages.map(m =>{
		return {
			body: m.body,
			from: m.from
		}
	}))
}