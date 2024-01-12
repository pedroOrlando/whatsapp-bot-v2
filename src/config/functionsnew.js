//arquivo com as funções utilizadas pelo bot
const utils = require ("./functions/utils.js")
const groupUtils = require ("./functions/groupUtils.js")
const groupFun = require ("./functions/groupFun.js")
const botFun = require ("./functions/botFun.js")
const apiFunctions = require ("./functions/apiFunctions.js")

// const configuration = new Configuration({
//     organization: process.env.ORGANIZATION_ID,
//     apiKey: process.env.OPENAI_KEY,
// });

// const openai = new OpenAIApi(configuration);


const tempFrasesAmigoOculto = ["inteligente", "gente boa", "legal", "simpática", "atenciosa", "agradável", "autêntica", "aventureira", "aberta", "acessível", "bem-educada", "bem-humorada", "carismática", "camarada", "divertida", "dedicada", "disciplinada", "educada", "eficiente", "elegante", "empenhada", "evoluída", "franca", "fantástica", "fiel", "gentil", "generosa", "honesta", "honrada", "hábil", "habilidosa", "íntegra", "intuitiva", "inspirador", "idônea", "independente", "justa", "leal", "legal", "maneira", "madura", "meticulosa", "nobre", "organizada", "original", "otimista", "paciente", "parceira", "polida", "pontual", "prestativa", "querida", "responsável", "respeitosa", "resiliente", "receptiva", "simpática", "sábia", "sincera", "sensata", "sensacional", "solidária", "sagaz", "talentosa", "tranquila", "transparente", "tolerante", "trabalhadora", "verdadeira", "valente"]

const ALLOW_ALL = true;

module.exports = {
	reply: async function (msg, client){
		utils.reply(msg, client)
		groupUtils.reply(msg, client)
		groupFun.reply(msg, client)
		botFun.reply(msg, client)
		apiFunctions.reply(msg, client)
		return;
		//Menus
		if(msg.body.toLowerCase() === "@menu"){
			var menu = "*Para saber o que eu consigo fazer, digite:*\n"
			menu += "\n🗣️ *@menuSocials*: Funções de redes sociais"
			menu += "\n🍿 *@menuEnt*: Funções de entretenimento"
			menu += "\n🔝 *@menuUtils*: Lista de utilitários"
			menu += "\n💢 *@menuOutros*: Outras funções"
			menu += "\n💲 *@menuPix*: Comandos pix"
			menu += "\n🕹 *@menuPoke*: Comandos Pokemon Go"
			menu += "\n🤖 *@menuGpt*: ChatGPT/DALL-E"
			menu += "\n💪 *@menuTaPago*: Menu dos comandos 'tá pago'"
			menu += "\n💻 *@menuGoogle*: Menu dos comandos de busca do Google"
			menu += "\n💰 *Curtiu o bot e quer mandar uma coquinha e uma paçoca pro dev?* manda um *@pixBot* 😉"
			
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menutapago"){
			var menu = "*Lista de comandos 'Tá Pago':*\n"
			menu += "\n🗣️ *meus  [tá pago/tá pago alimentação/tá pago nerd]*: retorna a lista de tá pagos respectivos"
			menu += "\n💪 *[tá pago/tá pago alimentação/tá pago nerd]*: adiciona um registro do respectivo tá pago"
			menu += "\n📊 *ranking [tá pago/tá pago nerd/tá pago alimentação]*: retorna o ranking do respectivo tá pago"
			menu += "\n❓ *quem [pagou/estudou/foi fit] hoje?*: retorna quais participantes possuem registros no dia de hoje"
			menu += "\n🔁 *@tapagofoto on/@tapagofoto off*: bloqueia/permite tá pagos sem foto (apenas 'tá pago')"
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menuoutros"){
			var menu = "*Lista de comandos - Outros:*\n"
			menu += "\n🔢 *@numero | _NUM_:* Fato aleatório sobre um número específico"
			menu += "\n🐦 *@birb:* Pássaro aleatório"
			menu += "\n🐶 *@shiba:* Shiba aleatório"
			// menu += "\n🍆 *@vampetaRussa:* 5/6 de chances de vir uma foto fofinha. 1/6 de chance de vir um vampetaço 😈 (NSFW)"
			menu += "\n🚀 *@apod | dd/mm/aaaa:* busca Foto Astronômica do Dia de um dia específico"
			menu += "\n🚀 *@apod:* busca Foto Astronômica do Dia da Nasa"
			menu += "\n🚀 *@randApod:* busca uma Foto Astronômica do Dia aleatória da Nasa"
			menu += "\n🦎 *@axolotl:* fato e foto aleatórios sobre Axolotes"
			menu += "\n🐶 *@dogFact:* fato aleatório sobre cachorros"
			menu += "\n❓ *@randomFact:* fato aleatório"
			menu += "\n🦊 *@fox:* raposa aleatória"
			menu += "\n🦆 *@pato:* pato aleatório"
			menu += "\n🤣 *@meme:* meme aleatório"
			menu += "\n🐕 *@doguinho:* cachorro aleatório"
			menu += "\n🐈 *@gatinhu:* gato aleatório"
			// menu += "\n🕵🏿‍♀️ *@aiperson:* retorna um rosto gerado por IA de uma pessoa que não existe"
			menu += "\n🤡 *@joke:* piada aleatória"
			menu += "\n🤓 *@devJoke:* piada aleatória de devs"
			menu += "\n🐱 *@catFact:* fato aleatório sobre gatos"
			menu += "\n👴🏽 *@advice:* conselho aleatório"
			menu += "\n👨🏿 *@kanye:* quote aleatório do Kanye West"
			menu += "\n🦸‍♂️ *@chucknorris:* piada aleatória do Chuck Norris"
			
			
			simulateTyping(msg, menu)
			// msg.reply(menu)
		}

		if(msg.body.toLowerCase() === "@menupix"){
			var menu = "*Lista de comandos - PIX (apenas para grupos):*\n"
			menu += "\n💲 *@pixCreate | _chave pix_:* Cadastra o pix do usuário"
			menu += "\n💲 *@pixUpdate | _chave pix_:* Atualiza o pix do usuário"
			menu += "\n💲 *@pixDelete:* Deleta o pix do usuário"
			menu += "\n💲 *@pixAll:* Imprime os pix's cadastrados dos usuários do grupo"
			menu += "\n💲 *@pix | @pessoa:* Imprime os pix's cadastrados da(s) pessoa(s) mencionada(s)"
			menu += "\n💲 *@pix* Imprime o pix cadastrado do autor da mensagem"
			
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menupoke"){
			var menu = "*Lista de comandos - Pokemon Go (apenas para grupos):*\n"
			menu += "\n🕹 *@pokeCreate | _código de treinador_:* Cadastra o código de treinador do usuário"
			menu += "\n🕹 *@pokeUpdate | _código de treinador_:* Atualiza o código Pokemon Go do usuário"
			menu += "\n🕹 *@pokeDelete:* Deleta o código Pokemon Go do usuário"
			menu += "\n🕹 *@pokeall:* Imprime os códigos's cadastrados dos usuários do grupo"
			menu += "\n🕹 *@poke | @pessoa:* Imprime o código cadastrado da(s) pessoa(s) mencionada(s)"
			menu += "\n🕹 *@poke* Imprime o código cadastrado do autor da mensagem"
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menuent"){
			var menu = "*Lista de comandos - Entretenimento:*\n"
			menu += "\n🍥 *@roletaRussa:* provavelmente nada vai acontecer.. se acontecer, eu te kicko do grupo"
			menu += "\n🃏 *@truco:* Quer jogar truco, mas tá sem baralho? Digite *@truco* que eu te dou uma mão"
			menu += "\n🃏 *@carta:* Tira uma carta aleatória do baralho"
			menu += "\n👅 *@sexo:* descubra qual vai ser o esquema"
			menu += "\n🩸 *@genocida:* descubra seu nome de genocida"
			menu += "\n💅🏻 *@drag:* descubra seu nome de drag"
			menu += "\n👠 *@quenga:* descubra seu nome de quenga"
			menu += "\n🍻 *@cachaceiro:* descubra seu nome de cachaceiro"
			menu += "\n✂ *@sapatao:* descubra seu nome de sapatão"
			menu += "\n👹 *@trevoso:* descubra seu nome de trevoso"
			menu += "\n⁉ *@tcm:* Transa, Casa e Mata"
			menu += "\n🎁 *@presente:* descubra qual presente você ganhou"
			menu += "\n💋 *@beijo:* descubra quem do grupo vc quer pegar"
			menu += "\n🐣 *@pinto:* descubra o tamanho do seu pipiu"
			menu += "\n🔥 *@vddOuCons:* Verdade ou consequência: sorteia um participante do grupo pra perguntar, outro pra responder"
			menu += "\n💀 *@noia:* descubra seu nome de noiado"
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menuutils"){
			var menu = "*Lista de comandos - Utilitários:*\n"
			menu += "\n📧 *@codigoAdd | _código_:* Cadastra um novo código de rastreio dos correios"
			menu += "\n📧 *@codigoRemove | _código_:* Remove um código de rastreio da sua lista de códigos"
			menu += "\n📧 *@rastreio:* Rastreia todos os seus códigos de rastreio dos correios cadastrados"
			menu += "\n📧 *@myCodes:* Exibe todos os seus códigos de rastreio dos correios cadastrados"
			menu += "\n👥 *@allAdd _on_/_off_:* permite ou impede que qualquer usuário do grupo consiga adicionar pessoas através do comando _@add_ (apenas admins podem usar o @allAdd)"
			menu += "\n❌ *@closeGroup:* limita as mensagens do grupo apenas para administradores (apenas admins podem usar)"
			menu += "\n⭕ *@openGroup:* libera para que todo mundo possa mandar mensagem no grupo (apenas admins podem usar)"
			// menu += "\n🖼 *@imagemstck _descrição da imagem_ | _número de resultados_:* faz uma busca pela imagem e retorna o número de resultados definido como Sticker (padrão 1, máximo 5)"
			// menu += "\n🖼 *@imagem _descrição da imagem_ | _número de resultados_:* faz uma busca pela imagem e retorna o número de resultados definido (padrão 1, máximo 5)"
			menu += "\n🔐 *@amigoOculto | @pessoa1 @pessoa2:* realiza um sorteio de amigo oculto entre o autor da mensagem e os participantes mencionados."
			// menu += "\n🔐 *@amigoOcultoAll:* realiza um sorteio de amigo oculto entre todos os participantes do grupo (apenas admins podem usar)"
			menu += "\n❌ *@remove* Remove o autor da mensagem mencionada. Apenas admins podem usar (e o bot precisa ser admin do grupo pra funcionar)"
			menu += "\n❌ *@remove | @pessoa:* Remove os contatos mencionados do grupo. Apenas admins podem usar (e o bot precisa ser admin do grupo pra funcionar)"
			menu += "\n➕ *@add:* responda uma mensagem com VCard(s) (contato enviado pelo whatsapp) para adicioná-lo(s) ao grupo. Se não tiver VCard, o bot tenta adicionar o autor da mensagem. Apenas admins podem usar (e o bot precisa ser admin do grupo pra funcionar)"
			menu += "\n🔗 *@link:* Envia o link de convite para o grupo. Apenas admins podem usar (e o bot precisa ser admin do grupo pra funcionar)"
			menu += "\n📑 *@tts _frase para o sticker_ | _cor da fonte_ _cor do fundo_ _tamanho da fonte_:* gera um sticker a partir de um texto. Digite @tts para exemplos"
			menu += "\n🍀 *@sorteio:* sorteia algum membro do grupo"
			menu += "\n🕸 *@sticker:* cria um sticker a partir de uma imagem/gif/video. Também pode ser executado mencionando uma mensagem com mídia."
			menu += "\n📄 *@desc:* Imprime a descrição do grupo"
			menu += "\n🔊 *@everyone:* Menciona todo mundo no grupo (apenas para admins)"
			menu += "\n📧 *@rastreio | _código de rastreio 1_ _código de rastreio 2_:* Rastreia encomendas nos correios"
			menu += "\n🎥 *@filme | _nome do filme_:* busca dados do filme"
			menu += "\n📹 *@serie | _nome da série_:* busca dados da série"
			menu += "\n🎲 *@d6, @d20, @d100:* Roda um d6, d20 ou d100"
			menu += "\n🗺 *@cep | _cep_:* Busca os dados do cep"
			menu += "\n🌐 *@url | _url_:* encurta a url"
			menu += "\n⛏ *@eth | _wallet_:* busca dados de uma wallet na Ethermine.org"
			menu += "\n💰 *@crypto:* Busca as cotações atualizadas das principais cryptos"
			// menu += "\n❌ *@delete:* faz com que o bot apague uma mensagem (só funciona pras mensagens dele)"
			
			
			simulateTyping(msg, menu)
		}


		if(msg.body.toLowerCase() === "@menusocials"){
			var menu = "*Lista de comandos - Redes sociais (apenas para grupos):*\n"
			menu += "\n\n➕ *@igCreate/@ttCreate/@fbCreate/@twCreate/@lnCreate/@ppCreate | _usuário_:* \nCadastra o usuário do Instagram (ig), Twitter (tt), Facebook (fb), Twitch (tw), LikedIn (ln) ou PicPay (pp)"
			menu += "\n\n🔃 *@igUpdate/@ttUpdate/@fbUpdate/@twUpdate/@lnUpdate/@ppUpdate | _usuário_:* \nAtualiza o usuário do Instagram (ig), Twitter (tt), Facebook (fb), Twitch (tw), LikedIn (ln) ou PicPay (pp)"
			menu += "\n\n❌ *@igDelete/@ttDelete/@fbDelete/@twDelete/@lnDelete/@ppDelete:* \nDeleta o usuário do Instagram (ig), Twitter (tt), Facebook (fb), Twitch (tw), LikedIn (ln) ou PicPay (pp)"
			menu += "\n\n🗣️ *@ig/@tt/@fb/@tw/@ln/@pp:* \nMostra o usuário do Instagram (ig), Twitter (tt), Facebook (fb), Twitch (tw), LikedIn (ln) ou PicPay (pp) do autor da mensagem"
			menu += "\n\n🗣️ *@socialsAll:* \nMostra as redes sociais cadastradas dos usuários do grupo"
			menu += "\n\n🗣️ *@socials | @pessoa:* \nMostra as redes sociais cadastradas da(s) pessoa(s) mencionada(s)"
			menu += "\n\n🗣️ *@socials* \nMostra as redes sociais cadastradas do autor da mensagem"
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menugpt"){
			var menu = "*Lista de comandos - ChatGPT/DALL-E:*\n"
			menu += "\n\n❓ *@howTo:* \nComo obter as chaves para usar a API"
			menu += "\n\n➕ *@keyCreate | _OPENAI_KEY_ _ORGANIZATION_ID_:* \nCadastra/atualiza as chaves OpenAi do usuário"
			menu += "\n\n❌ *@clearKeys:* \nLimpa as chaves OpenAi do usuário"
			menu += "\n\n🗣️ *@myKeys* \nImprime as chaves OpenAi cadastradas do usuário"
			menu += "\n\n*Importante: Por questões de segurança, os comandos @keycreate e @mykeys só devem ser utilizados no privado*"
			menu += "\n\n🤖 *@gpt | <Sua frase aqui>:* \nPesquisa a frase no ChatGPT"
			menu += "\n\n🖼 *@dalle | <Sua frase aqui>:* \nGera uma imagem de acordo com a descrição fornecida usando o DALL-E"
			menu += "\n\n🔛 *@gptOn/@gptOff* \nDisponível apenas para chats individuais. Habilita/desabilita o uso do chat como prompt do gpt. Caso esteja ativada, essa configuração fará com que o bot responda qualquer mensagem (exceto as que começem com '@') utilizando o ChatGpt."
			
			simulateTyping(msg, menu)
		}

		if(msg.body.toLowerCase() === "@menugoogle"){
			var menu = "*Lista de comandos - Google:*\n"
			menu += "\n💻 *@google _descrição da busca_ | _número de resultados_:* faz uma busca pelo texto e retorna o número de resultados definido (padrão 1, máximo 5). É possível responder uma mensagem com @google para utilizar o texto como input."
			menu += "\n\n🖼 *@imagem _descrição da imagem_ | _número de resultados_:* faz uma busca pela imagem e retorna o número de resultados definido (padrão 1, máximo 5). É possível responder uma mensagem com @imagem para utilizar o texto como input."
			
			simulateTyping(msg, menu)
		}

		//Google search
		if(msg.body.toLowerCase().indexOf('@google ') === 0){
			if(msg.hasQuotedMsg){
				const quotedMessage = await msg.getQuotedMessage()
				if(quotedMessage && quotedMessage.body){
					let frase = quotedMessage.body
					googleSearch(msg, client, frase, getGoogleParams(msg.body).modifiers)
				}else{
					simulateTyping(msg,'A mensagem mencionada não possui conteúdo', 3)
				}
			}else{
				let params = getGoogleParams(msg.body)
				googleSearch(msg, client, params.texto, params.modifiers)
			}
		}else if(msg.body.toLowerCase().indexOf('@google') === 0){
			if(msg.body.toLowerCase() === '@google' && msg.hasQuotedMsg){
				const quotedMessage = await msg.getQuotedMessage()
				if(quotedMessage && quotedMessage.body){
					let frase = quotedMessage.body
					googleSearch(msg, client, frase, getGoogleParams(msg.body).modifiers)
				}else{
					simulateTyping(msg,'A mensagem mencionada não possui conteúdo', 3)
				}
			}else{
				simulateTyping(msg,'Para utilizar esse comando, copie a mensagem a seguir e edite a frase de input', 0)
				simulateTyping(msg,'@google <sua frase de input aqui>')
			}
		}

		if(msg.body.toLowerCase().indexOf('@imagem ') === 0){
			if(msg.hasQuotedMsg){
				const quotedMessage = await msg.getQuotedMessage()
				if(quotedMessage && quotedMessage.body){
					let frase = quotedMessage.body
					googleSearch(msg, client, frase, getGoogleParams(msg.body).modifiers, true)
				}else{
					simulateTyping(msg,'A mensagem mencionada não possui conteúdo', 3)
				}
			}else{
				let params = getGoogleParams(msg.body)
				googleSearch(msg, client, params.texto, params.modifiers, true)
			}
		}else if(msg.body.toLowerCase().indexOf('@imagem') === 0){
			if(msg.body.toLowerCase() === '@imagem' && msg.hasQuotedMsg){
				const quotedMessage = await msg.getQuotedMessage()
				if(quotedMessage && quotedMessage.body){
					let frase = quotedMessage.body
					googleSearch(msg, client, frase, getGoogleParams(msg.body).modifiers, true)
				}else{
					simulateTyping(msg,'A mensagem mencionada não possui conteúdo', 3)
				}
			}else{
				simulateTyping(msg,'Para utilizar esse comando, copie a mensagem a seguir e edite a frase de input', 0)
				simulateTyping(msg,'@imagem <sua frase de input aqui>')
			}
		}


		//CHAT GPT/DALLE

		if(msg.body[0] !== '@'){
			const chat = await msg.getChat()
			if(!chat.isGroup){
				let config = getGptConfig(msg)
				if(config){
					let keys = getOpenAiKeys(msg)
					if(!keys){
						simulateTyping(msg,"Você ainda não possui chave openAi cadastrada. Para cadastrar uma chave, utilize o comando '@keyCreate | _OPENAI_KEY_ _ORGANIZATION_ID_'. \n\n*SEMPRE UTILIZE ESSE COMANDO NO CHAT PRIVADO!*")
						return;
					}
					let frase = msg.body
					msg.reply('Um momento...')
					try{
						let resp = await getDavinciResponse(frase, keys)
						msg.reply(resp);
					}catch(e){
						msg.reply('Ops.. algo deu errado. ' + e.message)
					}
					return;
				}
			}
		}

		if(msg.body.toLowerCase() === '@gpton' || msg.body.toLowerCase() === '@gptoff'){
			const chat = await msg.getChat();
			if(!chat.isGroup){
				toggleGptFunction(msg)
			}else{
				simulateTyping(msg,"Comando disponível apenas para o chat privado.")
			}
			return;
		}

		if(msg.body.toLowerCase() === "@howto"){
			let message = 'Para obter uma chave de utilização da OpenAi, deve-se acessar o endereço https://platform.openai.com/account/api-keys e gerar uma chave para copiá-la. \n'
			message += '\nAlém disso, é necessário cadastrar o ID da organização. Para isso, o endereço é https://platform.openai.com/account/org-settings.'
			
			message += '\n\nPara que o comando funcione, é necessário que a conta vinculada possua créditos de utilização (o cadastro no site da openai dá 18 dólares de crédito como free trial). Informações de uso e preço podem ser encontradas em https://platform.openai.com/account/usage e https://openai.com/pricing, respectivamente.'
			message += '\n\nCom as chaves em mãos, utilize o comando @keyCreate para cadastrá-las. *Atenção: Só utilize esse comando no privado para não publicar suas chaves*'
			simulateTyping(msg, message)
		}

		if(msg.body.toLowerCase() === "@mykeys"){
			const chat = await msg.getChat();
			
			if(chat.isGroup){
				simulateTyping(msg,"Por motivos de segurança, esse comando só pode ser utilizado no chat privado.")
			}else{
				printOpenAiKeys(msg)
			}
		}

		if(msg.body.toLowerCase().indexOf('@keycreate |') === 0){
			const chat = await msg.getChat();
			if(chat.isGroup){
				simulateTyping(msg,"Por motivos de segurança, esse comando só pode ser utilizado no chat privado.")
			}else{
				createOpenaiKeys(msg)
			}
		}else if(msg.body.toLowerCase().indexOf('@keycreate') === 0){
			const chat = await msg.getChat();
			if(chat.isGroup){
				simulateTyping(msg,"Por motivos de segurança, esse comando só pode ser utilizado no chat privado.")
				return;
			}
			simulateTyping(msg,'Para utilizar esse comando, copie a mensagem a seguir e edite a frase de input', 0)
			simulateTyping(msg,'@keycreate | _OPENAI_KEY_ _ORGANIZATION_ID_', 3)
		}

		if(msg.body.toLowerCase() === "@clearkeys"){
			clearKeys(msg)
		}

		if(msg.body.toLowerCase().indexOf('@gpt |') === 0){
			let keys = getOpenAiKeys(msg)
			if(!keys){
				simulateTyping(msg,"Você ainda não possui chave openAi cadastrada. Para cadastrar uma chave, utilize o comando '@keyCreate | _OPENAI_KEY_ _ORGANIZATION_ID_'. \n\n*SEMPRE UTILIZE ESSE COMANDO NO CHAT PRIVADO!*")
				return;
			}
			let frase = getParamWithSpaces(msg, '@gpt |')
			msg.reply('Um momento...')
			try{
				let resp = await getDavinciResponse(frase, keys)
				msg.reply(resp);
			}catch(e){
				msg.reply('Ops.. algo deu errado. ' + e.message)
			}
		}else if(msg.body.toLowerCase().indexOf('@gpt') === 0){
			if(msg.body.toLowerCase() === '@gpt' && msg.hasQuotedMsg){
				let keys = getOpenAiKeys(msg)
				if(!keys){
					simulateTyping(msg,"Você ainda não possui chave openAi cadastrada. Para cadastrar uma chave, utilize o comando '@keyCreate | _OPENAI_KEY_ _ORGANIZATION_ID_'. \n\n*SEMPRE UTILIZE ESSE COMANDO NO CHAT PRIVADO!*")
					return;
				}
				const quotedMessage = await msg.getQuotedMessage()
				if(quotedMessage && quotedMessage.body){
					let frase = quotedMessage.body
					msg.reply('Um momento...')
					try{
						let resp = await getDavinciResponse(frase, keys)
						msg.reply(resp);
					}catch(e){
						msg.reply('Ops.. algo deu errado. ' + e.message)
					}
				}else{
					simulateTyping(msg,'A mensagem mencionada não possui conteúdo', 3)
				}
			}else{
				simulateTyping(msg,'Para utilizar esse comando, copie a mensagem a seguir e edite a frase de input', 0)
				simulateTyping(msg,'@gpt | <sua frase de input aqui>', 3)
			}
			
		}

		if(msg.body.toLowerCase().indexOf('@dalle |') === 0){
			let keys = getOpenAiKeys(msg)
			if(!keys){
				simulateTyping(msg,"Você ainda não possui chave openAi cadastrada. Para cadastrar uma chave, utilize o comando '@keyCreate | _OPENAI_KEY_ _ORGANIZATION_ID_'. \n\n*SEMPRE UTILIZE ESSE COMANDO NO CHAT PRIVADO!*")
				return;
			}

			let frase = getParamWithSpaces(msg, '@dalle |')
			msg.reply('Um momento...')
			try{
				let resp = await getDalleResponse(frase, keys)

				if(isURL(resp)){
					download(resp, client, msg, frase)
				}else{
					simulateTyping(msg, resp)
				}
			}catch(e){
				msg.reply('Ops.. algo deu errado.')
			}
			
			// console.log(resp)
			
			// reply (msg, resp);
		}else if(msg.body.toLowerCase().indexOf('@dalle') === 0){
			simulateTyping(msg,'Para utilizar esse comando, copie a mensagem a seguir e edite a frase de input', 0)
			simulateTyping(msg,'@dalle | <sua frase de input aqui>', 3)
		}

		const authorDaMsg = getAuthor(msg)
		if(authorDaMsg == DEVEDOR_CERVEJA){
			const chat = await msg.getChat();
			if(chat && chat.id && chat.id.user === ID_SISTRETATICOS){
				let contadorFilePath = path.join(__dirname, '/contador_cerveja.json')
				let contador = load(contadorFilePath);
				contador.contador +=1 ;
				
				save(contador, contadorFilePath)
				const contentFilePath = path.join(__dirname, '/imgs/devendo-cerveja.png')
				if(contador.contador%10===0){
					let dataInicial = new Date('12/09/2022')
					let atual = new Date();
					const umDiaMs = 24 * 60 * 60 * 1000;
					let dias = Math.round((atual - dataInicial)/umDiaMs);
					let message = "Cervejas pagas: 0. Mensagens enviadas sem pagar cerveja: "+ contador.contador+". Dias sem pagar cerveja: "+dias;
					client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {caption: message, quotedMessageId: msg.id._serialized, sendMediaAsSticker: false})
				}
			}
		}

		if(msg.body.toLowerCase() === '@contadorcerveja'){
			const chat = await msg.getChat();
			if(chat && chat.id && chat.id.user === ID_SISTRETATICOS){
				let contadorFilePath = path.join(__dirname, '/contador_cerveja.json')
				let contador = load(contadorFilePath);
				let dataInicial = new Date('12/09/2022')
				let atual = new Date();
				const umDiaMs = 24 * 60 * 60 * 1000;
				let dias = Math.round((atual - dataInicial)/umDiaMs);
				let message = "@"+DEVEDOR_CERVEJA+" já pagou 0 cervejas. Mensagens enviadas sem pagar cerveja: "+ contador.contador+". Dias sem pagar cerveja: "+dias;
				var mentions = []

				let mention = {
					id: {
					  server: 'c.us',
					  user: DEVEDOR_CERVEJA,
					  _serialized: DEVEDOR_CERVEJA+'@c.us'
					}
				}
				mentions.push(mention)

				client.sendMessage(msg.from, message, {mentions})
			}
		}
		
		//admin
		if (msg.body === "@allowGroup" ) {
			const msgAuthor = getAuthor(msg)
			if(ADMINS.find(adm => adm === msgAuthor)){
				const contentFilePath = path.join(__dirname, '/authorized_groups.json')
				const groups = load(contentFilePath);
				const chat = await msg.getChat();
				if(groups.groups && groups.groups.find(g => g.id === chat.id.user)){
					msg.reply('Grupo já autorizado')
				}else{
					groups.groups.push({"id": chat.id.user})
					save(groups, contentFilePath)
					msg.reply('Grupo autorizado')
				}
			}
		}

		if(msg.body === "@checkStatus"){
			const msgAuthor = getAuthor(msg)
			const chaty = await msg.getChat()
			var interval = setInterval(function(){sendMessage(chaty)}, 1000);
			console.log(interval.toString())
			clearInterval(interval)
			if(ADMINS.find(adm => adm === msgAuthor)){
				//msg, segundos, iterações
				// checkStatus(msg, 600, 200)
			}
		}

		

		//admin
		if(msg.body === "@resetGroups"){
			// const msgAuthor = getAuthor(msg)
			// if(ADMINS.find(adm => adm === msgAuthor)){
			// 	const contentFilePath = path.join(__dirname, '/authorized_groups.json')

			// 	groups = {"groups": []};

			// 	console.log(save(groups, contentFilePath))
			// }
		}

		//resetando os pixs
		if(msg.body === "@resetPixies"){
			// const contentFilePath = path.join(__dirname, '/pixies.json')

			// infos = {"contacts": [{"id":"553898856415","pix":"022d9517-0bb4-4ea0-850c-38e60cc4b004"}]};

			// console.log(save(infos, contentFilePath))

		}



		if(msg.body.toLowerCase() === "@geradorelogio"){
			var randomPick = tempFrasesAmigoOculto.sort(function() { return .5 - Math.random() }) // Shuffle array
					.slice(0, 3); // Get first 3 items
					simulateTyping(msg,'O meu amigo oculto é uma pessoa extremamente '+ randomPick[0]+', '+randomPick[1]+' e '+randomPick[2])
		}

		if(msg.body.toLowerCase() === '@link'){
			const chat = await msg.getChat();
			
			const author = getAuthor(msg)
			const chatAdmins = chat.participants && chat.participants.filter(p => p.isAdmin) || []
			if(chat.isGroup){
				//confere se o bot e o author são admins desse grupo, ou se o bot é admin e todo mundo pode adicionar
				if(await isFromAdminAndBotIsAdmin(msg, chat) || (await botIsAdmin(msg, chat) && await canAllAdd(msg, chat))){
					const link = await chat.getInviteCode()
					if(link){
						await chat.sendMessage("O link de convite para o grupo é: \n\nhttps://chat.whatsapp.com/"+link);
					}else{
						await chat.sendMessage("Não foi possível obter o link do grupo no momento");
					}
					return;
				}else{
					simulateTyping(msg,'Esse comando só pode ser executado por administradores, ou para grupos com _@alladd on_. Além disso, eu preciso ser admin pra realizar a ação')
				}
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos')
			}
		}
		
		if(msg.body.toLowerCase() === '@add'){
			const chat = await msg.getChat();
			
			const author = getAuthor(msg)
			const chatAdmins = chat.participants && chat.participants.filter(p => p.isAdmin) || []
			if(chat.isGroup){
				//confere se o bot e o author são admins desse grupo, ou se o bot é admin e todo mundo pode adicionar
				if(await isFromAdminAndBotIsAdmin(msg, chat) || (await botIsAdmin(msg, chat) && await canAllAdd(msg, chat))){
					if(msg.hasQuotedMsg){
						try{
							const quotedMessage = await msg.getQuotedMessage()
							if(quotedMessage && quotedMessage.vCards && quotedMessage.vCards.length > 0){
								try{
									await chat.addParticipants(getContactFromVCard(quotedMessage.vCards)).then(resp =>{
										simulateTyping(msg,'Contatos adicionados. Caso algum contato não tenha sido adicionado, pode ser devido configurações pessoais de privacidade, contato já é membro do grupo, ou contato inválido (número sem whatsapp). \nAdicionalmente, é possível utilizar o comando _@link_ para obter o link de convite do grupo')
									})
								}catch(err){
									console.log(getContactFromVCard(quotedMessage.vCards))
									console.log(err)
									simulateTyping(msg,'Opa.. algo deu errado. Tente utilizar o comando _@link_ para obter o link de convite para o grupo')
								}
							}else{
								try{
									await chat.addParticipants([quotedMessage.author]).then(resp =>{
										simulateTyping(msg,'Contatos adicionados. Caso algum contato não tenha sido adicionado, pode ser devido configurações pessoais de privacidade, contato já é membro do grupo, ou contato inválido (número sem whatsapp). \nAdicionalmente, é possível utilizar o comando _@link_ para obter o link de convite do grupo')
									})
								}catch(err){
									simulateTyping(msg,'Opa.. algo deu errado. Tente utilizar o comando _@link_ para obter o link de convite para o grupo')
								}
							}
						}catch(err){
							simulateTyping(msg,'Ops.. algo deu errado. Tente utilizar o comando _@link_ para obter o link de convite para o grupo')
						}
					}else{
						simulateTyping(msg,'Nenhum contato encontrado')
					}
				}else{
					simulateTyping(msg,'Esse comando só pode ser executado por administradores, ou para grupos com _@alladd on_. Além disso, eu preciso ser admin pra realizar a ação')
				}
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos')
			}
		}

		if(msg.body.toLowerCase()=== '@remove'){
			const chat = await msg.getChat();
			const author = getAuthor(msg)
			const chatAdmins = chat.participants.filter(p => p.isAdmin)
			if(chat.isGroup){
				//confere se o bot e o author são admins desse grupo
				if(await isFromAdminAndBotIsAdmin(msg, chat)){
					if(msg.hasQuotedMsg){
						try{
							const quotedMessage = await msg.getQuotedMessage()
							try{
								await chat.removeParticipants([quotedMessage.author]).then(resp =>{
									simulateTyping(msg,'Contato removido.')
								})
							}catch(err){
								simulateTyping(msg,'Opa.. algo deu errado')
							}
							
						}catch(err){
							simulateTyping(msg,'Ops.. algo deu errado')
						}
					}else{
						simulateTyping(msg,'Nenhuma mensagem mencionada encontrada')
					}
				}else{
					simulateTyping(msg,'Esse comando só pode ser executado por administradores. Além disso, eu preciso ser admin pra realizar a ação')
				}
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos')
			}
		}

		if(msg.body.toLowerCase().indexOf('@remove | ') === 0){
			if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
				simulateTyping(msg,'Mencione alguém para remover do grupo');
			}else{
				const chat = await msg.getChat();
				const author = getAuthor(msg)
				const chatAdmins = chat.participants.filter(p => p.isAdmin)
				if(chat.isGroup){
					//confere se o bot e o author são admins desse grupo
					if(await isFromAdminAndBotIsAdmin(msg, chat)){
						try{
							try{
								await chat.removeParticipants(msg.mentionedIds).then(resp =>{
									simulateTyping(msg,'Contatos removidos.')
								})
							}catch(err){
								simulateTyping(msg,'Opa.. algo deu errado')
							}
							
						}catch(err){
							simulateTyping(msg,'Ops.. algo deu errado')
						}
					}else{
						simulateTyping(msg,'Esse comando só pode ser executado por administradores. Além disso, eu preciso ser admin pra realizar a ação')
					}
				}else{
					simulateTyping(msg,'Comando disponível apenas para grupos')
				}
			}
		}else if(msg.body.toLowerCase().indexOf('@remove ') === 0){
			simulateTyping(msg,'Para utilizar esse comando, copie a mensagem a seguir e edite os participantes mencionados', 0)
			simulateTyping(msg,'@remove | @pessoa1 @pessoa2', 3)
		}

		if(msg.body.toLowerCase() === "@alladd on" || msg.body.toLowerCase() === "@alladd off"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				if(await isFromAdmin(msg, chat)){
					allowAllAdd(msg, chat)
				}else{
					simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.')
				}
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === "@tapagofoto on" || msg.body.toLowerCase() === "@tapagofoto off"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				if(await isFromAdmin(msg, chat)){
					setBlockTaPagoSemFoto(msg, chat)
				}else{
					simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.')
				}
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		
	

		//temp
		const pathRadar = path.join(__dirname, '/radarBf.json')
		const keywords = load(pathRadar);
		if(keywords.find(kw => msg.body.toLowerCase().includes(kw))){
			// var author = getAuthor(msg)
			await encaminharOfertas(msg)
		}

		if(msg.body.toLowerCase().indexOf('galaxy note 20') !== -1){
			await encaminharOfertasDeNote20(msg)
		}

		if(msg.body.toLowerCase().indexOf('blablabla') !== -1){
			msg.reply('teste1')
		}

		


		
		


		//COMANDOS - ENTRETENIMENTO
		if(msg.body.toLowerCase()==="@roulette"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				if(await botIsAdmin(msg)){
					russianRoulette(msg)
				}else{
					simulateTyping(msg, "I need admin status to run this command")
				}
			}else{
				simulateTyping(msg,'This command is group-chat only.')
			}
			
		}

		if(msg.body.toLowerCase()==="@roletarussa"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				if(await botIsAdmin(msg)){
					roletaRussa(msg)
				}else{
					simulateTyping(msg, "Eu preciso ser admin de pra poder executar o comando")
				}
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
			
		}


		if(msg.body.toLowerCase() === "@truco"){
			if(await validateGroup(msg)){
				var msg1 = "Para gerar uma nova mão de truco, digite o comando '@truco | @pessoa1 @pessoa2 @pessoa3' (marcando 3 pessoas do grupo) e irei distribuir 3 cartas pra cada participante no privado. Pra facilitar, copie a próxima mensagem e edite as marcaçoes"
				var msg2 = '@truco | @pessoa1 @pessoa2 @pessoa3'
				msg.reply(msg1)
				simulateTyping(msg,msg2)
			}else{
				simulateTyping(msg,'Grupo não autorizado.')
			}
		}

		if(msg.body.toLowerCase().indexOf("@truco | ") === 0){
			if(await validateGroup(msg)){
				const chat = await msg.getChat()
				if(chat.isGroup){
					truco(msg, client)
				}else{
					simulateTyping(msg,'Comando disponível apenas para grupos.')
				}
			}else{
				simulateTyping(msg,'Grupo não autorizado.')
			}
		}

		if(msg.body.toLowerCase() === "@carta"){
			randomCard(msg, client)
		}


		if(msg.body.toLowerCase() === '@presente'){
			const chat = await msg.getChat()
			const sender = await msg.getContact()
			const contentFilePath = path.join(__dirname, '/presentes.json')
			const PRESENTESS = load(contentFilePath).presentes;

			//se tiver em um grupo
			if(chat.isGroup){
				//filtra os participantes do grupo, excluindo o autor da msg e o próprio bot
				var filteredParticipants = chat.participants.filter(part => part.id.user !== sender.id.user && part.id.user !== BOT)
				var selectedParticipant
				if(filteredParticipants.length > 1){
					selectedParticipant = filteredParticipants[getRandomInt(filteredParticipants.length)]
				}else{
					selectedParticipant = filteredParticipants[0]
				}
				
				//adiciona o participante selecionado no array de mentions
				var mentions = [selectedParticipant]

				//monta a msg e envia
				chat.sendStateTyping()
				var i = getRandomInt(3, true)
				setTimeout(function () {
					chat.clearState()
					chat.sendMessage(`@${selectedParticipant.id.user}` + " te deu "+ PRESENTESS[getRandomInt(PRESENTESS.length)], {mentions, quotedMessageId: msg.id._serialized})
				}, i*1000);
				
				
			}else{
				var presente = 'Você ganhou '+ PRESENTESS[getRandomInt(PRESENTESS.length)]
				simulateTyping(msg, presente)
			}
		}

		if(msg.body.toLowerCase() === '@beijo'){
			const chat = await msg.getChat()
			const sender = await msg.getContact()
			if(chat.isGroup){
				//filtra os participantes do grupo, excluindo o próprio bot
				var filteredParticipants = chat.participants.filter(part => part.id.user !== sender.id.user && part.id.user !== BOT)
				var selectedParticipant
				if(filteredParticipants.length > 1){
					selectedParticipant = filteredParticipants[getRandomInt(filteredParticipants.length)]
				}else if(filteredParticipants.length === 1){
					selectedParticipant = filteredParticipants[0]
				}else{
					simulateTyping(msg, 'Número de participantes insuficiente')
					return;
				}
				var mentions = [sender, selectedParticipant]

				// chat.sendStateTyping()
				// var i = getRandomInt(3, true)
				// setTimeout(function () {
					// chat.clearState()
					chat.sendMessage(`@${sender.id.user}` + " quer dar uns pega em "+ `@${selectedParticipant.id.user}`, {mentions, quotedMessageId: msg.id._serialized})
				// }, i*1000);

				let pic = getPartPics(mentions, chat)
				if(pic){
					let picPath = path.join(__dirname, '/imgs/barraca do beijo/'+pic)
					client.sendMessage(msg.from, MessageMedia.fromFilePath(picPath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
				}
				
				
			}else{
				simulateTyping(msg, 'Este comando só está disponível para grupos')
			}
		}

		if(msg.body.toLowerCase() === '@sexo'){
			const chat = await msg.getChat()
			const sender = await msg.getContact()
			if(chat.isGroup){
				//filtra os participantes do grupo, excluindo o próprio bot
				var filteredParticipants = chat.participants.filter(part => part.id.user !== sender.id.user && part.id.user !== BOT)
				var selectedParticipant
				if(filteredParticipants.length > 0){
					if(filteredParticipants.length > 1){
						selectedParticipant = filteredParticipants[getRandomInt(filteredParticipants.length)]
					}else{
						selectedParticipant = filteredParticipants[0]
					}
					var mentions = [sender, selectedParticipant]
					var opt = ['dar para', 'comer']

					// chat.sendStateTyping()
					// var i = getRandomInt(3, true)
					// setTimeout(function () {
						// chat.clearState()
						chat.sendMessage(`@${sender.id.user}` + " quer "+opt[getRandomInt(2)]+ ` @${selectedParticipant.id.user}`, {mentions, quotedMessageId: msg.id._serialized})
					// }, i*1000);
					let pic = getPartPics(mentions, chat)
					if(pic){
						let picPath = path.join(__dirname, '/imgs/barraca do beijo/'+pic)
						client.sendMessage(msg.from, MessageMedia.fromFilePath(picPath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
					}
				}else{
					simulateTyping(msg, 'Número de participantes insuficiente')
				}
				
				
			}else{
				simulateTyping(msg, 'Este comando só está disponível para grupos')
			}
		}

		if(msg.body.toLowerCase() === '@sex'){
			const chat = await msg.getChat()
			const sender = await msg.getContact()
			if(chat.isGroup){
				//filtra os participantes do grupo, excluindo o próprio bot
				var filteredParticipants = chat.participants.filter(part => part.id.user !== sender.id.user && part.id.user !== BOT)
				var selectedParticipant
				if(filteredParticipants.length > 0){
					if(filteredParticipants.length > 1){
						selectedParticipant = filteredParticipants[getRandomInt(filteredParticipants.length)]
					}else{
						selectedParticipant = filteredParticipants[0]
					}
					var mentions = [sender, selectedParticipant]
					var opt = ['fuck', 'get fucked by']

					chat.sendStateTyping()
					var i = getRandomInt(3, true)
					setTimeout(function () {
						chat.clearState()
						chat.sendMessage(`@${sender.id.user}` + " wants to "+opt[getRandomInt(2)]+ ` @${selectedParticipant.id.user}`, {mentions, quotedMessageId: msg.id._serialized})
					}, i*1000);
				}else{
					simulateTyping(msg, 'Not enough participants')
				}
				
				
			}else{
				simulateTyping(msg, 'This command is group-chat only')
			}
		}

		if(msg.body === "@peepee"){

			let tamanho = getRandomInt(35, true)
			var mensagem = "Your pee-pee measures *"+ tamanho + " cm."
			if(tamanho < 5){
				
				mensagem += "*"
				msg.reply(mensagem)
				const contentFilePath = path.join(__dirname, '/imgs/weewee.png')
				
				const chat = await msg.getChat() 
				chat.sendStateTyping()
				var i = getRandomInt(3, true)
				setTimeout(function () {
					chat.clearState()
					client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {sendMediaAsSticker: true})
				}, i*1000);

				
			}else if(tamanho < 8){
				mensagem += " Let's hope you know how to use your tongue* 🐣🐣🐣"
				
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)

			}else if(tamanho < 13){
				mensagem += " Let's say it could be worse* "
				
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}
			else if(tamanho < 19){
				mensagem += " Meh.. average, I guess* "
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}else if(tamanho < 25){
				mensagem += " Damn, what a nice shlong* 🍆🍆🍆"
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}else if(tamanho < 30){
				mensagem += " You can definetelly sign up for Brazzers*"
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}else{
				mensagem += " Careful. You might pass out if you get a hard on*"
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}
		}


		if(msg.body === "@pinto"){

			let tamanho = getRandomInt(35, true)
			var mensagem = "Seu pinto mede *"+ tamanho + " cm."
			if(tamanho < 5){
				
				mensagem += "*"
				msg.reply(mensagem)
				const contentFilePath = path.join(__dirname, '/imgs/piroquinha.png')
				
				const chat = await msg.getChat() 
				chat.sendStateTyping()
				var i = getRandomInt(3, true)
				setTimeout(function () {
					chat.clearState()
					client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {sendMediaAsSticker: true})
				}, i*1000);

				
			}else if(tamanho < 8){
				mensagem += " Vamos torcer pra que vc seja bom de língua* 🐣🐣🐣"
				
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)

			}else if(tamanho < 13){
				mensagem += " Digamos que poderia ser pior* "
				
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}
			else if(tamanho < 19){
				mensagem += " É.. acho que tá na média* "
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}else if(tamanho < 25){
				mensagem += " Um belo dum beringelão* 🍆🍆🍆"
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}else if(tamanho < 30){
				mensagem += " Pode mandar o currículo pro Brasileirinhas*"
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}else{
				mensagem += " Cuidado. Se ficar de pau duro, é capaz de desmaiar*"
				simulateTyping(msg, mensagem)
				// msg.reply(mensagem)
			}
		}


		if(msg.body.toLowerCase() === '@noia'){
			geradorDeNome(msg, 'gerador_noia', 'noiado');
		}

		if(msg.body.toLowerCase() === '@trevoso'){
			geradorDeNome(msg, 'gerador_trevoso', 'trevoso(a)');
		}

		if(msg.body.toLowerCase() === '@sapatao'){
			geradorDeNome(msg, 'gerador_sapatao', 'sapatão');
		}

		if(msg.body.toLowerCase() === '@cachaceiro'){
			geradorDeNome(msg, 'gerador_cachaceiro', 'cachaceiro');
		}

		if(msg.body.toLowerCase() === '@quenga'){
			geradorDeNome(msg, 'gerador_quenga', 'quenga');
		}

		if(msg.body.toLowerCase() === '@drag'){
			geradorDeNome(msg, 'gerador_drag', 'drag');
		}

		if(msg.body.toLowerCase() === '@genocida'){
			simulateTyping(msg,'Seu nome de genocida é Jair Messias Bolsonaro')
		}

		if(msg.body.toLowerCase() === '@miliciano'){
			simulateTyping(msg,'Seu nome de miliciano é Jair Messias Bolsonaro')
		}



		if(msg.body.toLowerCase() === '@verdadeouconsequencia' || msg.body.toLowerCase() === '@vddoucons') {
			const sender = await msg.getContact()
			const chat = await msg.getChat()
			if(chat.isGroup){

				const participants = chat.participants.filter(p => p.id && p.id.user && p.id.user !== BOT)
				if (participants.length >= 2){
					var randomPick = participants.sort(function() { return .5 - Math.random() }) // Shuffle array
					.slice(0, 2); // Get first 2 items
					if(randomPick && randomPick[0] && randomPick[1]){
						let text = "";
						let mentions = randomPick;
						
						text += `Pergunta: @${randomPick[0].id.user} ` + `=> Responde: @${randomPick[1].id.user}`;
						
						chat.sendStateTyping()
						var i = getRandomInt(3, true)
						setTimeout(function () {
							chat.clearState()
							chat.sendMessage(text, { mentions , quotedMessageId: msg.id._serialized});
						}, i*1000);
					}
				}
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
				// msg.reply('Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === '@tcm') {
			const sender = await msg.getContact()
			const chat = await msg.getChat()
			if(chat.isGroup){

				//filtra os participantes excluindo o autor da msg e o bot
				const participants = chat.participants.filter(p => p.id && p.id.user && p.id.user !== sender.id.user && p.id.user !== BOT)
				if (participants.length > 2){
					var randomPick = participants.sort(function() { return .5 - Math.random() }) // Shuffle array
					.slice(0, 3); // Get first 3 items
					if(randomPick && randomPick[0] && randomPick[1] && randomPick[2]){
						let text = "";
						let mentions = randomPick;
						
						text += `Transa: @${randomPick[0].id.user} ` + `\nCasa: @${randomPick[1].id.user}` + `\nMata: @${randomPick[2].id.user}`;
								
						chat.sendStateTyping()
						var i = getRandomInt(3, true)
						setTimeout(function () {
							chat.clearState()
							chat.sendMessage(text, { mentions , quotedMessageId: msg.id._serialized});
						}, i*1000);
					}
				}else{
					simulateTyping(msg, "Número de participantes no grupo insuficiente")
				}
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === '@kfm') {
			const sender = await msg.getContact()
			const chat = await msg.getChat()
			if(chat.isGroup){

				//filtra os participantes excluindo o autor da msg e o bot
				const participants = chat.participants.filter(p => p.id && p.id.user && p.id.user !== sender.id.user && p.id.user !== BOT)
				if (participants.length > 2){
					var randomPick = participants.sort(function() { return .5 - Math.random() }) // Shuffle array
					.slice(0, 3); // Get first 3 items
					if(randomPick && randomPick[0] && randomPick[1] && randomPick[2]){
						let text = "";
						let mentions = randomPick;
						
						text += `Kill: @${randomPick[0].id.user} ` + `\nFuck: @${randomPick[1].id.user}` + `\nMarry: @${randomPick[2].id.user}`;
								
						chat.sendStateTyping()
						var i = getRandomInt(3, true)
						setTimeout(function () {
							chat.clearState()
							chat.sendMessage(text, { mentions , quotedMessageId: msg.id._serialized});
						}, i*1000);
					}
				}else{
					simulateTyping(msg, "Not enough participants")
				}
			}else{
				simulateTyping(msg, 'This command is group-chat only.')
			}
		}


		//COMANDOS - UTILITÁRIOS 
		//tá cago
		if(msg.body.toLowerCase() === "ta cago" || msg.body.toLowerCase() === "tá cago"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taCago(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(findInMessage(msg.body.toLowerCase(), ["quem fez merda hoje?", "quem fez merda hj?", "qm fez merda hj?", "qm fez merda hoje?", "qm cagou hoje?", "quem cagou hj?", "qm cagou hj?", "quem cagou hoje?"])){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taCago(msg, null, true)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase()  === "ranking tá cago" || msg.body.toLowerCase()  === "ranking ta cago"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getRankingTaCago(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === "meus tá cago" || msg.body.toLowerCase() === "meus ta cago"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getPartTaCago(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}
		
		//tá pago alimentação
		if(msg.body.toLowerCase() === "ta pago alimentação" || msg.body.toLowerCase() === "tá pago alimentação" || msg.body.toLowerCase() === "tá comido" || msg.body.toLowerCase() === "ta comido"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taPagoAlimentacao(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(findInMessage(msg.body.toLowerCase(), ["quem foi fit hoje?", "quem foi fit hj?", "qm foi fit hj?", "qm foi fit hoje?"])){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taPagoAlimentacao(msg, null, true)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase()  === "ranking tá pago alimentação" || msg.body.toLowerCase()  === "ranking ta pago alimentação"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getRankingTaPagoAlimentacao(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === "meus tá pago alimentação" || msg.body.toLowerCase() === "meus ta pago alimentação"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getPartTaPagoAlimentacao(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		//tá pago nerd
		if(msg.body.toLowerCase() === "ta pago nerd" || msg.body.toLowerCase() === "tá pago nerd"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taPagoNerd(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(findInMessage(msg.body.toLowerCase(), ["quem estudou hoje?", "quem estudou hj?", "qm estudou hj?", "qm estudou hoje?"])){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taPagoNerd(msg, null, true)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase()  === "ranking tá pago nerd" || msg.body.toLowerCase()  === "ranking ta pago nerd"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getRankingTaPagoNerd(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === "meus tá pago nerd" || msg.body.toLowerCase() === "meus ta pago nerd"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getPartTaPagoNerd(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		//tá pago
		if(msg.body.toLowerCase() === "ta pago" || msg.body.toLowerCase() === "tá pago"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taPago(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		//cancelando o tá pago
		if(msg.body.indexOf("@cancel") === 0){
			const chat = await msg.getChat()
			if(chat.isGroup){
				if(await isFromAdmin(msg, chat)){
					revokeTaPago(msg, chat)
				}else{
					simulateTyping(msg, 'Este comando só pode ser utilizado por administradores.')
				}
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(findInMessage(msg.body.toLowerCase(), ["quem pagou hoje?", "quem pagou hj?", "qm pagou hj?", "qm pagou hoje?"])){
			const chat = await msg.getChat()
			if(chat.isGroup){
				taPago(msg, null, true)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase()  === "ranking tá pago" || msg.body.toLowerCase()  === "ranking ta pago"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getRankingTaPago(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === "meus tá pago" || msg.body.toLowerCase() === "meus ta pago"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				await getPartTaPago(msg, chat)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para grupos.')
			}
		}

		if(msg.body.toLowerCase() === "@historicomenst" || msg.body.toLowerCase() === "@historicomenstrual"){
			var codes = getSettings(msg, 'periodHistory')
			if(codes && codes.length && codes.length > 0){
				reply = "Datas dos registros: \n"
				if(msg.body.toLowerCase() === "@historicomenst"){
					codes = codes.slice(-6)
					reply = "Datas dos últimos 6 registros (para acessar o histórico completo, utilize o comando _@historicoMenstrual_): \n"
				}
				for (var i = codes.length - 1; i >= 0; i--) {
					reply += "\n*"+ codes[i]+"*"
				}
				simulateTyping(msg, reply, 2)
			}else{
				let reply = "Você não possui nenhuma data registrada. Para adicionar uma nova, utilize o comando _@menstruei_"
				simulateTyping(msg, reply)
			}
		}

		if(msg.body.toLowerCase() === "@menstruei"){
			let data = new Date()
			let newReg = formatarData(data)
			addUserSettings(msg, 'periodHistory', newReg, true)
		}

		if(msg.body.toLowerCase() === "@rastreio"){
			var codes = getSettings(msg, 'trackingCodes')
			if(codes && codes.length && codes.length > 0){
				reply = "*Seus códigos de rastreio são:* "+codes.toString().toUpperCase().replaceAll(',', ', ')
				simulateTyping(msg, reply, 2)
				rastrearEncomendas(msg, codes)
			}else{
				let reply = "Você não possui nenhum código de rastreio cadastrado. Para rastrear manualmente, utilize o comando @rastreio | _código_ ou, caso queira adicionar um novo código, @codigoAdd | _código_"
				simulateTyping(msg, reply)
			}
		}

		if(msg.body.toLowerCase() === "@mycodes"){
			var codes = getSettings(msg, 'trackingCodes')
			let reply 
			if(codes && codes.length && codes.length > 0){
				reply = "*Seus códigos de rastreio são:* "+codes.toString().toUpperCase().replaceAll(',', ', ')
			}else{
				reply = "Você não possui nenhum código de rastreio cadastrado."
			}

			simulateTyping(msg, reply)
		}

		if(msg.body.toLowerCase().indexOf("@codigoadd | ") === 0){
			addUserSettings(msg, 'trackingCodes')
		}else if(msg.body.toLowerCase().indexOf('@codigoadd ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas o código de rastreio')
			simulateTyping(msg,'@codigoadd | _código_')
		}

		if(msg.body.toLowerCase().indexOf("@codigoremove | ") === 0){
			removeUserSettings(msg, 'trackingCodes')
		}else if(msg.body.toLowerCase().indexOf('@codigoremove ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas o código de rastreio')
			simulateTyping(msg,'@codigoremove | _código_')
		}


		if(msg.body.toLowerCase() === "@closegroup"){
			if(await isFromAdminAndBotIsAdmin(msg)){
				const chat = await msg.getChat();
				await chat.setMessagesAdminsOnly([true])
			}else{
				simulateTyping(msg, 'Comando disponível apenas para administradores de grupos. Além disso, eu preciso ser admin do grupo para executar a ação')
			}
		}

		if(msg.body.toLowerCase() === "@opengroup"){
			if(await isFromAdminAndBotIsAdmin(msg)){
				const chat = await msg.getChat();
				await chat.setMessagesAdminsOnly(false)
			}else{
				simulateTyping(msg, 'Comando disponível apenas para administradores de grupos. Além disso, eu preciso ser admin do grupo para executar a ação')
			}
		}

		// if(msg.body.toLowerCase().indexOf('@imagemstck ') === 0){
		// 	imageSearch(msg, client, true, "@imagemstck ")
		// }

		// if(msg.body.toLowerCase().indexOf('@imagem ') === 0){
		// 	imageSearch(msg, client, false, "@imagem ")
		// }

		if(msg.body.toLowerCase() ==='@amigoocultoall'){
			// amigoOculto(msg, client, true)
		}

		if(msg.body.toLowerCase().indexOf('@amigooculto | ') === 0){
			if(await validateGroup(msg)){
				amigoOculto(msg, client, false)
			}else{
				simulateTyping(msg,'Grupo não autorizado.')
			}
		}else if(msg.body.toLowerCase().indexOf('@amigooculto ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas os participantes mencionados')
			simulateTyping(msg,'@amigooculto | @pessoa1 @pessoa2')
		}

		if(msg.body.indexOf('@tts ') == 0){
			TTs(msg)
		}

		if(msg.body === "@tts"){
			if(msg.hasQuotedMsg){
				TTs(msg)
			}else{
				var t = "Para fazer um sticker de texto, digite o comando @tts *_texto_*. \n\nPor padrão, a cor do texto é preta, o fundo é branco e o tamanho da fonte é 72.\nSe a mensagem estiver mencionando outra mensagem, o texto da outra mensagem será utilizado para o sticker.\n\nPara mudar as propriedades, use o comando:"+
				"\n\n@tts *_texto_* | *_cor_da_letra_*  *_cor_do_fundo_*  *_tamanho_da_letra_* \n\n \nExemplos:"+
				"\n@tts texto padrão" +
				"\n@tts texto padrão | green"+
				"\n@tts texto padrão | green black"+
				"\n@tts texto padrão | red transparent 120"
	
				simulateTyping(msg, t)
			}
		}


		if(msg.body.toLowerCase() === '@desc'){
			const chat = await msg.getChat()
			if(chat.isGroup){
				if(chat && chat.groupMetadata && chat.groupMetadata.desc){
					simulateTyping(msg,"A descrição do grupo é: \n"+ chat.groupMetadata.desc)
				}else{
					simulateTyping(msg,"O grupo não possui descrição atualmente")
				}
			}
			else{
				simulateTyping(msg,"Comando disponível apenas para grupos.")
			}
		}

		if(msg.body.toLowerCase() === '@everyone') {
			if(await validateGroup(msg)){
				const sender = await msg.getContact()
				const chat = await msg.getChat()
				if(chat.isGroup){
					const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)
					if(adminParticipants && adminParticipants.find(p => p === sender.id.user)){
						let text = "";
						let mentions = [];
						for(let participant of chat.participants) {
							const contact = await client.getContactById(participant.id._serialized);
							mentions.push(contact);
							text += `@${participant.id.user} `;
						}

						let quoted;
						if(msg.hasQuotedMsg){
							const quotedMessage = await msg.getQuotedMessage()
							quoted = quotedMessage && quotedMessage.id && quotedMessage.id._serialized
						}

						
						chat.sendStateTyping()
						var i = getRandomInt(3, true)
						setTimeout(function () {
							chat.clearState()
							chat.sendMessage(text, { mentions, quotedMessageId: quoted });
						}, i*1000);
					}else{
						simulateTyping(msg,'Apenas administradores podem usar esse comando.')
					}
				}else{
					simulateTyping(msg,'Comando disponível apenas para grupos.')
				}
			}else{
				simulateTyping(msg,'Grupo não autorizado.')
			}
		}

		//Rastrear encomenda dos correios
		if (msg.body.toLowerCase().indexOf("@rastreio | ")== 0) {
			rastrearEncomendas(msg)
		}else if(msg.body.toLowerCase().indexOf('@rastreio ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas o código de rastreio')
			simulateTyping(msg,'@rastreio | CÓDIGO_DE_RASTREIO')
		}

		if(msg.body.toLowerCase().indexOf('@filme |') === 0){
			movieSearch(msg, client)
		}else if(msg.body.toLowerCase().indexOf('@filme ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite o nome do filme')
			simulateTyping(msg,'@filme | nome do filme')
		}

		if(msg.body.toLowerCase().indexOf('@serie |') === 0){
			tvShowSearch(msg, client)
		}else if(msg.body.toLowerCase().indexOf('@serie ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite o nome da série')
			simulateTyping(msg,'@serie | nome da série')
		}

		//rodar um d6, d20 ou d100 
		if(msg.body === "@d6"){
			simulateTyping(msg,"Número rodado: "+ getRandomInt(6, true))
		}

		if(msg.body === "@d20"){
			simulateTyping(msg,"Número rodado: "+ getRandomInt(20, true))
		}

		if(msg.body === "@d100"){
			simulateTyping(msg,"Número rodado: "+ getRandomInt(100, true))
		}

		//confere cep
		if(msg.body.indexOf("@cep | ") === 0){
			cepCheck(msg)
		}else if(msg.body.toLowerCase().indexOf('@cep ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite o CEP')
			simulateTyping(msg,'@filme | SEU_CEP')
		}

		//encurtador de url
		if(msg.body.indexOf('@url | ') === 0){
			// msg.reply("Marca aí, 2 palito")
			shortenURL(getParam(msg.body), msg)
		}else if(msg.body.toLowerCase().indexOf('@url ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite a URL')
			simulateTyping(msg,'@url | URL')
		}

		//miner stats check
		if(msg.body === "@ethpedro"){
			getMinerStats("B4e0308A09E384EfDce369556FeB5fd5d6Df5B04", msg)
		}

		if(msg.body === "@ethelon"){
			getMinerStats("0x2d86FeF8689f4893227416a6dd4afF8EB8E1ddA6", msg)
		}

		if(msg.body.indexOf('@eth | ') === 0){
			getMinerStats(getParam(msg.body), msg)
		}else if(msg.body.toLowerCase().indexOf('@eth ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite o endereço da wallet da Ethermine')
			simulateTyping(msg,'@eth | SUA_WALLET')
		}

		if(msg.body.toLowerCase() === '@sorteio') {
			const sender = await msg.getContact()
			const chat = await msg.getChat()
			if(chat.isGroup){
				//filtra os participantes excluindo o bot
				const participants = chat.participants.filter(p => p.id && p.id.user && p.id.user !== BOT)
				if (participants.length > 0){
					var randomPick = participants.sort(function() { return .5 - Math.random() }) // Shuffle array
					.slice(0, 1); // Get first 3 items
					if(randomPick && randomPick[0]){
						let text = "";
						let mentions = randomPick;
						
						text += `Membro sorteado: @${randomPick[0].id.user} `;
						
						chat.sendStateTyping()
						var i = getRandomInt(3, true)
						setTimeout(function () {
							chat.clearState()
							chat.sendMessage(text, { mentions , quotedMessageId: msg.id._serialized});
						}, i*1000);
						
					}
				}else{
					simulateTyping(msg,"Número de participantes no grupo insuficiente")
				}
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}

		//crypto price check
		if(msg.body === "@crypto"){
			cryptoCheck(msg)
		}
		
		if (msg.body === '@delete') {
			// if (msg.hasQuotedMsg) {
			// 	const quotedMsg = await msg.getQuotedMessage();
			// 	if (quotedMsg.fromMe) {
			// 		try{
			// 			await quotedMsg.delete(true);
			// 		}catch(err){
			// 			msg.reply('Não foi possível apagar a mensagem selecionada.')
			// 		}
					
			// 	} else {
			// 		//var sentMessage = await 
			// 		msg.reply('Só posso apagar minhas próprias mensagens.');
			// 		//await sentMessage.delete(true)
			// 	}
			// }
		}

		//COMANDOS - OUTROS
		//fato aleatório sobre um número
		if (msg.body.toLowerCase().indexOf("@numero | ") === 0 || msg.body.toLowerCase().indexOf("@número | ") === 0) {
			numberTrivia(msg, client)
		}else if(msg.body.toLowerCase().indexOf("@numero ") === 0 || msg.body.toLowerCase().indexOf("@número ") === 0){
			msg.reply('Para obter um fato sobre um número específico, copie o comando a seguir e edite apenas o número')
			simulateTyping(msg,'@numero | _NUM_')
		}

		//pássaro aleatório
		if (msg.body.toLowerCase() === "@birb") {
			randomBirb(msg, client)
		}

		//shiba aleatório
		if (msg.body.toLowerCase() === "@shiba") {
			randomShibe(msg, client)
		}

		//APOD
		if (msg.body.toLowerCase().indexOf("@apod | ") === 0) {
			dateApod(msg, client)
		}else if(msg.body.toLowerCase().indexOf("@apod ") === 0){
			msg.reply('Para obter uma foto de uma data específica, copie o comando a seguir e edite apenas a data no formato DD/MM/AAAA')
			simulateTyping(msg,'@apod | dd/mm/aaaa')
		}

		//APOD
		if (msg.body.toLowerCase() === "@apod") {
			apod(msg, client)
		}

		//VAMPETA RUSSA
		if(msg.body.toLowerCase() === "@vampetarussa"){
			// vampetaRussa(msg, client)
		}

		//APOD ALEATÓRIA
		if (msg.body.toLowerCase() === "@randapod") {
			randomApod(msg, client)
		}

		//FATO ALEATÓRIO SOBRE AXOLOTES
		if (msg.body.toLowerCase() === "@axolotl") {
			randomAxolotl(msg, client)
		}
		
		//FATO ALEATÓRIO SOBRE DOGS
		if (msg.body.toLowerCase() === "@dogfact") {
			dogFact(msg, client)
		}

		//FATO ALEATÓRIO
		if (msg.body.toLowerCase() === "@randomfact") {
			randomFact(msg, client)
		}
		
		//RAPOSA ALEATORIA
		if (msg.body.toLowerCase() === "@fox") {
			randomFox(msg, client)
		}

		//PATO ALEATORIO
		if (msg.body.toLowerCase() === "@pato") {
			randomDuck(msg, client)
		}


		//meme aleatório
		if (msg.body.toLowerCase() === "@meme") {
			try{
				randomMeme(msg, client)
			}catch(err){
				simulateTyping(msg,'Ops.. alguma coisa deu errado =(')
			}
			
		}

		//DOGUINHO ALEATORIO
		if (msg.body.toLowerCase() === "doguinho" || msg.body.toLowerCase() === "@doguinho") {
			randomDog(msg, client)
		}

		
		

		//GATINHO ALEATORIO 
		if (msg.body.toLowerCase() === "gatinhu" || msg.body.toLowerCase() === "@gatinhu") {
			randomCat(msg, client)
		}
		
		//rosto aleatório DEPRECATED
		// if (msg.body.toLowerCase() === "@aiperson") {
		// 	randomPerson(msg, client)
		// }
		
		//piada aleatória
		if(msg.body.toLowerCase() === "@joke"){
			getRandomJoke(msg)
		}

		if(msg.body.toLowerCase() === "@devjoke"){
			getRandomDevJoke(msg)
		}

		if(msg.body.toLowerCase() === "@catfact"){
			getRandomCatFact(msg)
		}

		if(msg.body.toLowerCase() === "@advice"){
			getRandomAdvice(msg)
		}

		if(msg.body.toLowerCase() === "@kanye"){
			getRandomKanyeQuote(msg)
		}

		if(msg.body.toLowerCase() === "@chucknorris"){
			getRandomChuckNorrisJoke(msg)
		}

		//COMANDOS - PIX
		//cadastrando pix
		if (msg.body.toLowerCase().indexOf('@pixcreate | ') === 0) {
			pixCreate(msg)
		}else if(msg.body.toLowerCase().indexOf('@pixcreate') === 0){
			msg.reply('Para utilizar o comando @pixCreate, copie a mensagem a seguir e edite apenas a sua chave pix')
			simulateTyping(msg,'@pixCreate | sua_chave_aqui')
		}

		//alterando pix
		if (msg.body.toLowerCase().indexOf('@pixupdate | ') === 0) {
			pixUpdate(msg)
		}else if(msg.body.toLowerCase().indexOf('@pixupdate') === 0){
			msg.reply('Para utilizar o comando @pixUpdate, copie a mensagem a seguir e edite apenas a sua chave pix')
			simulateTyping(msg,'@pixUpdate | sua_chave_aqui')
		}

		//excluindo o pix
		if (msg.body.toLowerCase().indexOf('@pixdelete') === 0) {
			pixDelete(msg)
		}

		//imprimindo os pix
		if (msg.body.toLowerCase().indexOf('@pixall') === 0) {
			const chat = await msg.getChat()
			if(chat.isGroup){
				pixAll(msg)
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}

		//imprimindo pix específico
		if (msg.body.toLowerCase().indexOf('@pix | ') === 0) {
			const chat = await msg.getChat()
			if(chat.isGroup){
				printPix(msg)
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}else if(msg.body.toLowerCase().indexOf('@pix ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas as marcações')
			simulateTyping(msg,'@pix | @pessoa1 @pessoa2')
		}

		//imprimindo pix do autor
		if (msg.body.toLowerCase() === '@pix') {
			printAuthorPix(msg)
		}

		//manda meu pix
		if(msg.body.toLowerCase() === "@pixbot"){
			msg.reply("Curtiu o bot? Se quiser dar uma ajuda pro dev, manda um pix 😉")
			simulateTyping(msg,"022d9517-0bb4-4ea0-850c-38e60cc4b004")
		}

		//COMANDOS - POKEMON GO

		//cadastrando código POGO
		if (msg.body.toLowerCase().indexOf('@pokecreate | ') === 0) {
			poGoCreate(msg)
		}else if(msg.body.toLowerCase().indexOf('@pokecreate') === 0){
			msg.reply('Para utilizar o comando @pokeCreate, copie a mensagem a seguir e edite apenas o seu código de treinador')
			simulateTyping(msg,'@pokeCreate | seu_código_de_treinador_aqui')
		}

		//alterando código POGO
		if (msg.body.toLowerCase().indexOf('@pokeupdate | ') === 0) {
			poGoUpdate(msg)
		}else if(msg.body.toLowerCase().indexOf('@pokeupdate') === 0){
			msg.reply('Para utilizar o comando @pokeUpdate, copie a mensagem a seguir e edite apenas o seu código de treinador')
			simulateTyping(msg,'@pokeUpdate | seu_código_de_treinador_aqui')
		}

		//excluindo o código POGO
		if (msg.body.toLowerCase().indexOf('@pokedelete') === 0) {
			pogoDelete(msg)
		}

		//imprimindo os código POGO
		if (msg.body.toLowerCase().indexOf('@pokeall') === 0) {
			const chat = await msg.getChat()
			if(chat.isGroup){
				pogoAll(msg)
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}

		//imprimindo código POGO específico
		if (msg.body.toLowerCase().indexOf('@poke | ') === 0) {
			const chat = await msg.getChat()
			if(chat.isGroup){
				printPogo(msg)
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}else if(msg.body.toLowerCase().indexOf('@poke ') === 0){
			msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas as marcações')
			simulateTyping(msg,'@poke | @pessoa1 @pessoa2')
		}

		//imprimindo código POGO do autor da msg
		if (msg.body.toLowerCase() === '@poke') {
			printAuthorPogo(msg)
		}
		

		//COMANDOS REDES SOCIAIS
		if(msg.body.toLowerCase().indexOf("@igcreate | ") === 0){
			socialsCreate(msg, 'ig')
		}else if(msg.body.toLowerCase().indexOf("@igcreate") === 0){
			msg.reply('Para utilizar o comando @igCreate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@igCreate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@ttcreate | ") === 0){
			socialsCreate(msg, 'tt')
		}else if(msg.body.toLowerCase().indexOf("@ttcreate") === 0){
			msg.reply('Para utilizar o comando @ttCreate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@ttCreate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@twcreate | ") === 0){
			socialsCreate(msg, 'tw')
		}else if(msg.body.toLowerCase().indexOf("@twcreate") === 0){
			msg.reply('Para utilizar o comando @twCreate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@twCreate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@fbcreate | ") === 0){
			socialsCreate(msg, 'fb')
		}else if(msg.body.toLowerCase().indexOf("@fbcreate") === 0){
			msg.reply('Para utilizar o comando @fbCreate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@igCreate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@lncreate | ") === 0 || msg.body.toLowerCase().indexOf("@increate | ") === 0){
			socialsCreate(msg, 'ln')
		}else if(msg.body.toLowerCase().indexOf("@lncreate") === 0 || msg.body.toLowerCase().indexOf("@increate") === 0){
			msg.reply('Para utilizar o comando @lnCreate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@lnCreate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@ppcreate | ") === 0){
			socialsCreate(msg, 'pp')
		}else if(msg.body.toLowerCase().indexOf("@ppcreate") === 0){
			msg.reply('Para utilizar o comando @ppCreate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@ppCreate | seu_usuário')
		}



		if(msg.body.toLowerCase().indexOf("@igupdate | ") === 0){
			socialsUpdate(msg, 'ig')
		}else if(msg.body.toLowerCase().indexOf("@igupdate") === 0){
			msg.reply('Para utilizar o comando @igUpdate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@igUpdate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@ttupdate | ") === 0){
			socialsUpdate(msg, 'tt')
		}else if(msg.body.toLowerCase().indexOf("@ttupdate") === 0){
			msg.reply('Para utilizar o comando @ttUpdate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@ttUpdate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@twupdate | ") === 0){
			socialsUpdate(msg, 'tw')
		}else if(msg.body.toLowerCase().indexOf("@twupdate") === 0){
			msg.reply('Para utilizar o comando @twUpdate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@twUpdate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@fbupdate | ") === 0){
			socialsUpdate(msg, 'fb')
		}else if(msg.body.toLowerCase().indexOf("@fbupdate") === 0){
			msg.reply('Para utilizar o comando @fbUpdate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@fbUpdate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@lnupdate | ") === 0 || msg.body.toLowerCase().indexOf("@inupdate | ") === 0){
			socialsUpdate(msg, 'ln')
		}else if(msg.body.toLowerCase().indexOf("@lnupdate") === 0 || msg.body.toLowerCase().indexOf("@inupdate") === 0){
			msg.reply('Para utilizar o comando @lnUpdate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@lnUpdate | seu_usuário')
		}

		if(msg.body.toLowerCase().indexOf("@ppupdate | ") === 0){
			socialsUpdate(msg, 'pp')
		}else if(msg.body.toLowerCase().indexOf("@ppupdate") === 0){
			msg.reply('Para utilizar o comando @ppUpdate, copie a mensagem a seguir e edite apenas o seu usuário')
			simulateTyping(msg,'@ppUpdate | seu_usuário')
		}



		if(msg.body.toLowerCase() === "@igdelete"){
			socialsDelete(msg, 'ig')
		}

		if(msg.body.toLowerCase() === "@ttdelete"){
			socialsDelete(msg, 'tt')
		}

		if(msg.body.toLowerCase() === "@twdelete"){
			socialsDelete(msg, 'tw')
		}

		if(msg.body.toLowerCase() === "@fbdelete"){
			socialsDelete(msg, 'fb')
		}

		if(msg.body.toLowerCase() === "@lndelete" || msg.body.toLowerCase() === "@indelete"){
			socialsDelete(msg, 'ln')
		}

		if(msg.body.toLowerCase() === "@ppdelete"){
			socialsDelete(msg, 'pp')
		}



		if(msg.body.toLowerCase() === "@socialsall"){
			const chat = await msg.getChat()
			if(chat.isGroup){
				socialsAll(msg)
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}

		if (msg.body.toLowerCase().indexOf('@socials | ') === 0) {
			const chat = await msg.getChat()
			if(chat.isGroup){
				printSocials(msg)
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}else if(msg.body.toLowerCase().indexOf('@socials ') === 0){
			const chat = await msg.getChat()
			if(chat.isGroup){
				msg.reply('Para utilizar esse comando, copie a mensagem a seguir e edite apenas as marcações')
				simulateTyping(msg,'@socials | @pessoa1 @pessoa2')
			}else{
				simulateTyping(msg,'Comando disponível apenas para grupos.')
			}
		}

		if (msg.body.toLowerCase() === '@socials') {
			printAuthorSocials(msg)
		}


		if (msg.body.toLowerCase() === '@ig') {
			printAuthorSocial(msg, 'ig')
		}

		if (msg.body.toLowerCase() === '@tt') {
			printAuthorSocial(msg, 'tt')
		}

		if (msg.body.toLowerCase() === '@fb') {
			printAuthorSocial(msg, 'fb')
		}

		if (msg.body.toLowerCase() === '@tw') {
			printAuthorSocial(msg, 'tw')
		}

		if (msg.body.toLowerCase() === '@ln' || msg.body.toLowerCase() === '@in') {
			printAuthorSocial(msg, 'ln')
		}

		if (msg.body.toLowerCase() === '@pp') {
			printAuthorSocial(msg, 'pp')
		}
		
		
		// easter eggs

		//bom dia do mal
		if (msg && msg.body.toLowerCase() === '@bom dia') {
			let random = getRandomInt(402, true)
			const contentFilePath = path.join(__dirname, '/imgs/bom dia do mal/bom dia do mal ('+random+').PNG')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {caption: 'Bom dia 🥰😍❤️💕', quotedMessageId: msg.id._serialized, sendMediaAsSticker: false})
			}, i*1000);
			
		}

		//oi, vó
		if(msg.body.toLowerCase() === "oi, vó" || msg.body.toLowerCase() === "oi vó"){
			const chat = await msg.getChat() 
			await chat.sendStateTyping()
			setTimeout(function () {
				chat.clearState()
				msg.reply('Oi')
			}, 25*1000);
		}

		//se alguem falar do jogo ou 'perdi
		if (msg.body.toLowerCase() === "o jogo" || msg.body.toLowerCase() === "perdi") {
			simulateTyping(msg,'Perdi')
		}

		//se alguem pedir sticker pro bot errado
		if (msg.body === "!sticker") {
			const contentFilePath = path.join(__dirname, '/imgs/aiajty.jpg')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
			
		}

		//se alguem mencionar o bot
		if (msg && msg.mentionedIds && msg.mentionedIds.find(id => id.slice(0, id.indexOf("@")) === BOT )) {
			const contentFilePath = path.join(__dirname, '/imgs/papaco.jpg')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
			
		}

		//se alguem falar 'nazista'
		if (msg && msg.body.toLowerCase().indexOf('nazista') !== -1) {
			const contentFilePath = path.join(__dirname, '/imgs/nazi.mp4')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
			
		}

		//se alguem falar 'racista'
		if (msg && msg.body.toLowerCase().indexOf('racista') !== -1) {
			const contentFilePath = path.join(__dirname, '/imgs/racismo.jpg')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
			
		}

		//Olavo
		if (msg && msg.body && msg.body.toLowerCase().includes('olavo')) {
			simulateTyping(msg,'💀')
		}

		/*
		//ai, credo
		if (msg && (msg.body.toLowerCase() === 'ai, credo' || msg.body.toLowerCase() === 'ai credo' || msg.body.toLowerCase() === 'ai credo!' || msg.body.toLowerCase() === 'ai, credo!')) {
			simulateTyping(msg,'O Galão ganhou mais uma vez ⚫⚪🐓🐓⚫⚪🐓🐓⚫⚪🏆🏆🏆')
			// simulateTyping(msg,'O Galo empatou 😐😐😐')
			// simulateTyping(msg,'O Galo gosta de emoçao 😐😐😐')

		}


		//e o galo?
		if (msg && msg.body.toLowerCase().indexOf('e o galo?') !== -1) {
			simulateTyping(msg,'O Galo ganhou!!!!!!!! 🐓🐓🐓🐓 ⚫⚪⚫⚪⚫⚪')
			// simulateTyping(msg,'O Galo empatou 😐😐😐')
			// simulateTyping(msg,'O Galo gosta de emoçao 😐😐😐')

		}

		//se alguem falar 'galo'
		if (msg && msg.body.toLowerCase().indexOf('galo') !== -1) {
			const contentFilePath = path.join(__dirname, '/imgs/galo.png')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
		}

		*/
		
		//perguntas começadas com 'Alguém'
		if(msg.body && perguntaComAlguem(msg.body)){
			if(!authorIsOwner(msg)){
				const replies = ["Sim, alguém", "Não, espero ter ajudado"]
				simulateTyping(msg,replies[getRandomInt(2)])
			}
		}

		//frases com guelpeli
		if(msg.body && msg.body.toLowerCase().indexOf('guelpeli') !== -1){
			simulateTyping(msg,"🤮")
		}

		//frases com bolsonaro
		if(msg.body && hasBozo(msg.body)){
			// simulateTyping(msg,'Genocida filha da puta!')
			const contentFilePath = path.join(__dirname, '/imgs/naoEleito.png')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
		}

		//frases com janir
		if(msg.body && findInMessage(msg.body.toLowerCase(), ['janir'])){
			// simulateTyping(msg,'Genocida filha da puta!')
			const contentFilePath = path.join(__dirname, '/imgs/naoEleitoJanir.png')
			const chat = await msg.getChat() 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
			}, i*1000);
		}

		//frases com fx caiu?
		if(msg.body && hasFxCaiu(msg.body)){
			if(!authorIsOwner(msg)){
				simulateTyping(msg,'Sim, caiu.')
			}
		}

		//anti fake news
		// if(msg.isForwarded){
		// 	msg.reply("Mensagem encaminhada? Sei não, hein.. cheirinho de fake news 👃👃👃")
		// }

	}
};
