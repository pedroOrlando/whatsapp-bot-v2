//arquivo com as funções utilizadas pelo bot

const rp = require('request-promise');
const fs = require('fs')
const path = require('path');
const request = require('request').defaults({encoding: null})
const { MessageMedia } = require('whatsapp-web.js');
const { networkInterfaces } = require('os');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');
const client = require('./client');
const { get } = require('request');
const PEP = '553891354666'
const SAR = '553898245666'
const BOT = '553897570686'
const DEVEDOR_CERVEJA = "553899564734"
const ID_CANCELO = '553193373122-1574291304@g.us' //certo
// const ID_GRUPO_TESTE = '553891354666-1635459199@g.us' //teste
const ID_SISTRETATICOS = "553891354666-1440021402";
const ADMINS = [PEP, SAR]
const MOVIEDB_KEY = "01d57a08b022b25468981c5b49accf5d"
const nodeHtmlToImage = require('node-html-to-image')
const shell = require('shelljs') 
const dotenv = require('dotenv');
const OpenAIApi = require('openai').OpenAIApi;
const Configuration = require('openai').Configuration;
dotenv.config()

// const configuration = new Configuration({
//     organization: process.env.ORGANIZATION_ID,
//     apiKey: process.env.OPENAI_KEY,
// });

// const openai = new OpenAIApi(configuration);


const tempFrasesAmigoOculto = ["inteligente", "gente boa", "legal", "simpática", "atenciosa", "agradável", "autêntica", "aventureira", "aberta", "acessível", "bem-educada", "bem-humorada", "carismática", "camarada", "divertida", "dedicada", "disciplinada", "educada", "eficiente", "elegante", "empenhada", "evoluída", "franca", "fantástica", "fiel", "gentil", "generosa", "honesta", "honrada", "hábil", "habilidosa", "íntegra", "intuitiva", "inspirador", "idônea", "independente", "justa", "leal", "legal", "maneira", "madura", "meticulosa", "nobre", "organizada", "original", "otimista", "paciente", "parceira", "polida", "pontual", "prestativa", "querida", "responsável", "respeitosa", "resiliente", "receptiva", "simpática", "sábia", "sincera", "sensata", "sensacional", "solidária", "sagaz", "talentosa", "tranquila", "transparente", "tolerante", "trabalhadora", "verdadeira", "valente"]

const ALLOW_ALL = true;

module.exports = {
	reply: async function (msg, client){

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
			menu += "\n🕵🏿‍♀️ *@aiperson:* retorna um rosto gerado por IA de uma pessoa que não existe"
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
			menu += "\n➕ *@add:* responda uma mensagem com VCard(s) (contato enviado pelo whatsapp) para adicioná-lo(s) ao grupo. Se não tiver VCard, o bot tenta adicionar o autor da mensagem Apenas admins podem usar (e o bot precisa ser admin do grupo pra funcionar)"
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
			menu += "\n\n🤖 *@gpt | <Sua frase aqui>:* \nPesquisa a chave no ChatGPT"
			menu += "\n\n🖼 *@dalle | <Sua frase aqui>:* \nGera uma imagem de acordo com a descrição fornecida usando o DALL-E"
			menu += "\n\n🔛 *@gptOn/@gptOff* \nDisponível apenas para chats individuais. Habilita/desabilita o uso do chat como prompt do gpt. Caso esteja ativada, essa configuração fará com que o bot responda qualquer mensagem (exceto as que começem com '@') utilizando o ChatGpt."
			
			simulateTyping(msg, menu)
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
										simulateTyping(msg,'Contatos adicionados. Caso algum contato não tenha sido adicionado, pode ser devido configurações pessoais de privacidade, contato já é membro do grupo, ou contato inválido (número sem whatsapp).')
									})
								}catch(err){
									simulateTyping(msg,'Opa.. algo deu errado')
								}
							}else{
								try{
									await chat.addParticipants([quotedMessage.author]).then(resp =>{
										simulateTyping(msg,'Contatos adicionados. Caso algum contato não tenha sido adicionado, pode ser devido configurações pessoais de privacidade, contato já é membro do grupo, ou contato inválido (número sem whatsapp).')
									})
								}catch(err){
									simulateTyping(msg,'Opa.. algo deu errado')
								}
							}
						}catch(err){
							simulateTyping(msg,'Ops.. algo deu errado')
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
			msg.reply('teste')
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
				}else{
					selectedParticipant = filteredParticipants[0]
				}
				var mentions = [sender, selectedParticipant]

				chat.sendStateTyping()
				var i = getRandomInt(3, true)
				setTimeout(function () {
					chat.clearState()
					chat.sendMessage(`@${sender.id.user}` + " quer dar uns pega em "+ `@${selectedParticipant.id.user}`, {mentions, quotedMessageId: msg.id._serialized})
				}, i*1000);
				
				
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

					chat.sendStateTyping()
					var i = getRandomInt(3, true)
					setTimeout(function () {
						chat.clearState()
						chat.sendMessage(`@${sender.id.user}` + " quer "+opt[getRandomInt(2)]+ ` @${selectedParticipant.id.user}`, {mentions, quotedMessageId: msg.id._serialized})
					}, i*1000);
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

		if(findInMessage(msg.body.toLowerCase(), ["quem fez merda hoje?", "quem fez merda hj?", "quem cagou hj?", "qm fez merda hj?", "qm fez merda hoje?", "qm cagou hoje?"])){
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

		if(msg.body.toLowerCase().indexOf('@imagemstck ') === 0){
			imageSearch(msg, client, true, "@imagemstck ")
		}

		if(msg.body.toLowerCase().indexOf('@imagem ') === 0){
			imageSearch(msg, client, false, "@imagem ")
		}

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

						
						chat.sendStateTyping()
						var i = getRandomInt(3, true)
						setTimeout(function () {
							chat.clearState()
							chat.sendMessage(text, { mentions });
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
		
		//rosto aleatório
		if (msg.body.toLowerCase() === "@aiperson") {
			randomPerson(msg, client)
		}
		
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

function getKeyParams(msg){
	let params = getParamWithSpaces(msg, '@keyCreate | ').split(' ')
	if(params[0] && params[1]){
		return {
		'key': params[0],
		'orgId': params[1]
		}
  	}
}

function clearKeys(msg){
	createOpenaiKeys(msg, {'key': null, 'orgId': null})
}

function createOpenaiKeys(msg, paramsInput){
	//Definindo o author da mensagem
	let msgAuthor = getAuthor(msg)

	let params = paramsInput || getKeyParams(msg)

	if(!params){
		simulateTyping(msg,"Parâmetros não encontrados. Utilize o comando @howTo para ajuda com a obtenção das chaves ou certifique-se de que o formato de entrada siga o seguinte padrão:", 0)
		simulateTyping(msg,'@keycreate | _OPENAI_KEY_ _ORGANIZATION_ID_', 3)
		return;
	}

	

	//carregando o arquivo com os settings's
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const settings = load(contentFilePath);
	if(!settings || !settings.contacts){
		simulateTyping(msg,"Não foi possível atualizadas as chaves no momento.")
	}
	if(settings && settings.contacts){
		// procura o setting do author
		var author = settings.contacts.find(contact => contact.id === msgAuthor);
		//pix ainda não cadastrado
		if(!author){
			settings.contacts = settings.contacts || []
			settings.contacts.push({
				"id": msgAuthor,
				"openAiKeys": params
			})
			save(settings, contentFilePath)
			simulateTyping(msg,"Chaves atualizadas com sucesso. Para conferi-las, use o comando @myKeys.")
			
		}else{
			// console.log(pixies.contacts.find(contact => contact.id === msgAuthor))
			settings.contacts.find(contact => contact.id === msgAuthor).openAiKeys = params;
			save(settings, contentFilePath)
			simulateTyping(msg,"Chaves atualizadas com sucesso. Para conferi-las, use o comando @myKeys.")
		}
	}
}

function getOpenAiKeys(msg){
	let author = getAuthor(msg)
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	let settings = load(contentFilePath)
	let authorKeys = {}
	
	if(settings && settings.contacts){
		let authorSettings = settings.contacts.find(contact => contact.id === author);
		if(authorSettings && authorSettings.openAiKeys){
			authorKeys = authorSettings.openAiKeys;
		}
	}
	
	return (authorKeys.key && authorKeys.orgId) ? authorKeys : null;
}

function getGptConfig(msg){
	const author = getAuthor(msg)
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const userSettings = load(contentFilePath);
	if(!userSettings || !userSettings.contacts){
		console.log("Não foi possível realizar a operação no momento.")
		return;
	}
	if(userSettings && userSettings.contacts){
		// procura as configs do autor
		var authorSettings = userSettings.contacts.find(contact => contact.id === author);
		//nenhuma rede cadastrada
		return authorSettings && authorSettings.useBotAsGpt
	}
}

function toggleGptFunction(msg){
	const author = getAuthor(msg)
	createUserSettings(author)
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const userSettings = load(contentFilePath);
	if(!userSettings || !userSettings.contacts){
		console.log("Não foi possível realizar a operação no momento.")
		return;
	}
	if(userSettings && userSettings.contacts){
		// procura as redes do autor
		var authorSettings = userSettings.contacts.find(contact => contact.id === author);
		//nenhuma rede cadastrada
		if(!authorSettings){
			simulateTyping(msg,"Não foi possível fazer o cadastro no momento.")
			
		}else{
			let value = msg.body.toLowerCase() === '@gpton' ? true : false;
			userSettings.contacts.find(contact => contact.id === author).useBotAsGpt = value;
			save(userSettings, contentFilePath)
			let response = msg.body.toLowerCase() === '@gpton' ? 'o chat com o bot será utilizado como prompt para o gpt.' : 'para utilizar o GPT, utilize o comando _@gpt | <input>_';
			simulateTyping(msg, "Alteração realizada: "+response)
		}
	}
}


function printOpenAiKeys(msg){
	// procura as chaves do author
	let authorKeys = getOpenAiKeys(msg)
	// console.log(authorKeys)
	if(!authorKeys || authorKeys && (!authorKeys.key || !authorKeys.orgId)){
		simulateTyping(msg,"Você ainda não possui chave openAi cadastrada. Para cadastrar uma chave, utilize o comando '@keyCreate | _OPENAI_KEY_ _ORGANIZATION_ID_'. \n\n*SEMPRE UTILIZE ESSE COMANDO NO CHAT PRIVADO!*")
		return;
	}else{
		simulateTyping(msg,"Sua chaves cadastradas são: \nKey: ```"+ authorKeys.key+"```\nOrgId: ```"+authorKeys.orgId+"```")
	}

}

function findInMessage(msg, words){
	return words.find(word => msg.includes(word));
}

async function taCago(msg, inputChat, justCheck){
	//Definindo o author da mensagem
	const author = getAuthor(msg)
	let reply = '';

	const chat = inputChat || await msg.getChat()
	let multiple

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			if(justCheck){
				simulateTyping(msg,"Ninguém cagou hoje. Bora, time!")
				return;
			}else{
				var thisGroupSettings = {
					"id": chat.id.user,
					"taCago":[{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}],
					"settings":{}
				}
	
				groupSettings.groups = groupSettings.groups || []
				groupSettings.groups.push(thisGroupSettings)
	
				save(groupSettings, contentFilePath)
			}

		}else{
			if(!justCheck){
				//confere se o grupo já tem config de tá pago
				if(group.taCago && group.taCago.length){
					//confere se o usuário já tem registro no taPagoAlimentacao
					if(group.taCago.find(pago =>pago.part === author)){
						//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
						//pra isso, precisa formatar a data no formato certo (mm/dd/aa)
	
						const length = group.taCago.find(pago =>pago.part === author).registros.length
						const latestTaPago = group.taCago.find(pago =>pago.part === author).registros[length -1]
						const formatado = formataDataUTC(latestTaPago)
	
	
						if(dateIsToday(new Date(formatado))){
							reply = "Mais um, meu consagrado? Parabéns 💩👃👃💩\n\n"
							multiple = true

						}
						group.taCago.find(pago =>pago.part === author).registros.push(new Date().toLocaleDateString())
	
						
					}else{
						//se não tiver, inicia os registros
						group.taCago.push({
							"part": author,
							"registros":[new Date().toLocaleDateString()]
						})
					}
					groupSettings.groups.find(group => group.id === chat.id.user).taCago = group.taCago
				}else{
					//se não tiver, inicializa a config com o registro inicial do autor
					let taCago = [{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}]
	
					groupSettings.groups.find(group => group.id === chat.id.user).taCago = taCago
				}
	
				save(groupSettings, contentFilePath)
			}
		}

		const pagosToday = getTodaysTaPagos(groupSettings.groups.find(group => group.id === chat.id.user).taCago, true)
		// console.log(pagosToday)
		
		let resposta = "";
		if(!justCheck){
			resposta = reply+"Partiu adubar o planeta!! 💩💩💩\n"
		}

		let mentions = []
	
		if(pagosToday && pagosToday.length > 0){
			resposta += "Merdeiros de hoje:\n"
			pagosToday.forEach(reg =>{
				let owner = chat.participants && chat.participants.find(part => part.id.user === reg.part)
				if(owner){
					mentions.push(owner)
					resposta += `\n@${owner.id.user} (${reg.count} cagada${reg.count>1?'s':''})`
				}
				
			})
		}else{
			resposta += "Ninguém cagou hoje. Bora, time!"
		}

		

		await chat.sendMessage(resposta, { mentions });
		let imgPath = multiple ? 'metlalhadola.png' : 'taCago.jpeg'

		const aosDevedores = path.join(__dirname, '/imgs/'+imgPath)
		client.sendMessage(msg.from, MessageMedia.fromFilePath(aosDevedores), {sendMediaAsSticker: true})
	}
}

async function getRankingTaCago(msg, inputChat) {

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
	}

	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		let group = groupSettings.groups.find(group => group.id === chat.id.user);

		if(group && group.taCago && group.taCago.length){

			week = getFullWeek();
			const today = new Date().toLocaleDateString().split('/');
			let mes = [today[1], today[2]].join('/')
			let year = today[2]
			
			const ranking = group.taCago.map(taPago =>{
				return {
					"part": taPago.part,
					"count":{
						'week': taPago.registros.filter(reg => week.indexOf(reg) !==-1).length,
						'month': taPago.registros.filter(reg => reg.indexOf(mes) !==-1).length,
						'year': taPago.registros.filter(reg => reg.indexOf(year) !==-1).length,
						'allTime': taPago.registros.length
					}
				}
			})
			
			let sortedRanking = sortRanking(ranking)

			let todays = getTodaysTaPagos(groupSettings.groups.find(group => group.id === chat.id.user).taCago, true)

			let resposta = `_Hall da fama dos *merdeiros* do ${chat.name}:_\n\n`
			let mentions = []

			if(todays && todays.length > 0){
				resposta += 'Ranking diário\n'
				todays.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá cago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.week && sortedRanking.week.length >0){
				resposta += 'Ranking semanal\n'
				sortedRanking.week.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá cago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.month && sortedRanking.month.length >0){
				resposta += 'Ranking mensal\n'
				sortedRanking.month.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá cago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.year && sortedRanking.year.length >0){
				resposta += 'Ranking anual\n'
				sortedRanking.year.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá cago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.allTime && sortedRanking.allTime.length >0){
				resposta += 'Ranking geral\n'
				sortedRanking.allTime.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá cago${part.count>1?'s':''}*`
					}
				})
			}

			await chat.sendMessage(resposta, { mentions });
		}else{
			simulateTyping(msg,"Ranking não iniciado.")
		}
	}
}

async function getPartTaCago(msg, inputChat){
	//Definindo o author da mensagem
	const author = getAuthor(msg)
	let respostasSemTaCago = ['Você não tem tá cago registrado. Lhe falta fibras', 'Você não tem nenhum tá cago. Bora botar essa raba pra trabalhar!']

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			simulateTyping(msg,"Não existem tá cagos cadastrados.")
			return

		}else{
			//confere se o grupo já tem config de tá pago
			if(group.taCago && group.taCago.length){
				//confere se o usuário já tem registro no taPago
				if(group.taCago.find(pago =>pago.part === author)){
					//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
					//pra isso, precisa formatar a data no formato certo (mm/dd/aa)

					if(group.taCago.find(pago =>pago.part === author).registros.length > 0){
						let resposta = "Seu histórico de 'Tá Cago': \n"
						group.taCago.find(pago =>pago.part === author).registros.forEach(reg =>{
							resposta += "\n" +reg
						})

						simulateTyping(msg,resposta)
						return
					}else{
						simulateTyping(msg,respostasSemTaCago[getRandomInt(2)])
						return
					}

					
				}else{
					simulateTyping(msg,respostasSemTaCago[getRandomInt(2)])
					return
				}
			}else{
				simulateTyping(msg,respostasSemTaCago[getRandomInt(2)])
				return
			}
		}
	}
}

async function taPagoAlimentacao(msg, inputChat, justCheck){
	//Definindo o author da mensagem
	const author = getAuthor(msg)

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			if(justCheck){
				simulateTyping(msg,"Ninguém comeu bem hoje. Bora, time!")
				return;
			}else{
				var thisGroupSettings = {
					"id": chat.id.user,
					"taPagoAlimentacao":[{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}],
					"settings":{}
				}
	
				groupSettings.groups = groupSettings.groups || []
				groupSettings.groups.push(thisGroupSettings)
	
				save(groupSettings, contentFilePath)
			}

		}else{
			if(!justCheck){
				//confere se o grupo já tem config de tá pago
				if(group.taPagoAlimentacao && group.taPagoAlimentacao.length){
					//confere se o usuário já tem registro no taPagoAlimentacao
					if(group.taPagoAlimentacao.find(pago =>pago.part === author)){
						//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
						//pra isso, precisa formatar a data no formato certo (mm/dd/aa)
	
						const length = group.taPagoAlimentacao.find(pago =>pago.part === author).registros.length
						const latestTaPago = group.taPagoAlimentacao.find(pago =>pago.part === author).registros[length -1]
						const formatado = formataDataUTC(latestTaPago)
	
	
						if(dateIsToday(new Date(formatado))){
							simulateTyping(msg,"Calma lá, champz.. só 1 registro por dia")
							return
						}else{
							group.taPagoAlimentacao.find(pago =>pago.part === author).registros.push(new Date().toLocaleDateString())
						}
	
						
					}else{
						//se não tiver, inicia os registros
						group.taPagoAlimentacao.push({
							"part": author,
							"registros":[new Date().toLocaleDateString()]
						})
					}
					groupSettings.groups.find(group => group.id === chat.id.user).taPagoAlimentacao = group.taPagoAlimentacao
				}else{
					//se não tiver, inicializa a config com o registro inicial do autor
					let taPagoAlimentacao = [{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}]
	
					groupSettings.groups.find(group => group.id === chat.id.user).taPagoAlimentacao = taPagoAlimentacao
				}
	
				save(groupSettings, contentFilePath)
			}
		}

		const pagosToday = getTodaysTaPagos(groupSettings.groups.find(group => group.id === chat.id.user).taPagoAlimentacao)

		
		let resposta = "";
		if(!justCheck){
			resposta = "Partiu tanquinho de 6 gomos!! 🥗🥗🥗\n"
		}

		let mentions = []
	
		if(pagosToday && pagosToday.length > 0){
			resposta += "Fits de hoje:\n"
			pagosToday.forEach(reg =>{
				let owner = chat.participants && chat.participants.find(part => part.id.user === reg)
				if(owner){
					mentions.push(owner)
					resposta += `\n@${owner.id.user}`
				}
			})
		}else{
			resposta += "Ninguém comeu bem hoje. Bora, time!"
		}

		

		await chat.sendMessage(resposta, { mentions });

		const aosDevedores = path.join(__dirname, '/imgs/taPagoAlimentacao.png')
		client.sendMessage(msg.from, MessageMedia.fromFilePath(aosDevedores), {sendMediaAsSticker: true})
	}
}

async function getRankingTaPagoAlimentacao(msg, inputChat) {

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
	}

	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		let group = groupSettings.groups.find(group => group.id === chat.id.user);

		if(group && group.taPagoAlimentacao && group.taPagoAlimentacao.length){

			week = getFullWeek();
			const today = new Date().toLocaleDateString().split('/');
			let mes = [today[1], today[2]].join('/')
			let year = today[2]
			
			const ranking = group.taPagoAlimentacao.map(taPago =>{
				return {
					"part": taPago.part,
					"count":{
						'week': taPago.registros.filter(reg => week.indexOf(reg) !==-1).length,
						'month': taPago.registros.filter(reg => reg.indexOf(mes) !==-1).length,
						'year': taPago.registros.filter(reg => reg.indexOf(year) !==-1).length,
						'allTime': taPago.registros.length
					}
				}
			})
			
			let sortedRanking = sortRanking(ranking)

			let resposta = `_Hall da fama dos *orgulho da nutri* do ${chat.name}:_\n\n`
			let mentions = []
			if(sortedRanking.week && sortedRanking.week.length >0){
				resposta += 'Ranking semanal\n'
				sortedRanking.week.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.month && sortedRanking.month.length >0){
				resposta += 'Ranking mensal\n'
				sortedRanking.month.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.year && sortedRanking.year.length >0){
				resposta += 'Ranking anual\n'
				sortedRanking.year.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.allTime && sortedRanking.allTime.length >0){
				resposta += 'Ranking geral\n'
				sortedRanking.allTime.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
			}

			await chat.sendMessage(resposta, { mentions });
		}else{
			simulateTyping(msg,"Ranking não iniciado.")
		}
	}
}

async function getPartTaPagoAlimentacao(msg, inputChat){
	//Definindo o author da mensagem
	const author = getAuthor(msg)
	let respostasSemTaPago = ['Você não tem tá pago alimentação registrado. Sem tá pago, sem  mimos', 'Você não tem nenhum tá pago alimentação, bora comer bem!']

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			simulateTyping(msg,"Não existem tá pagos alimentação cadastrados.")
			return

		}else{
			//confere se o grupo já tem config de tá pago
			if(group.taPagoAlimentacao && group.taPagoAlimentacao.length){
				//confere se o usuário já tem registro no taPago
				if(group.taPagoAlimentacao.find(pago =>pago.part === author)){
					//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
					//pra isso, precisa formatar a data no formato certo (mm/dd/aa)

					if(group.taPagoAlimentacao.find(pago =>pago.part === author).registros.length > 0){
						let resposta = "Seu histórico de 'Tá Pago alimentação': \n"
						group.taPagoAlimentacao.find(pago =>pago.part === author).registros.forEach(reg =>{
							resposta += "\n" +reg
						})

						simulateTyping(msg,resposta)
						return
					}else{
						simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
						return
					}

					
				}else{
					simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
					return
				}
			}else{
				simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
				return
			}
		}
	}
}

async function taPagoNerd(msg, inputChat, justCheck){
	//Definindo o author da mensagem
	const author = getAuthor(msg)

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			if(justCheck){
				simulateTyping(msg,"Ninguém estudou hoje. Bora, time!")
				return;
			}else{
				var thisGroupSettings = {
					"id": chat.id.user,
					"taPagoNerd":[{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}],
					"settings":{}
				}
	
				groupSettings.groups = groupSettings.groups || []
				groupSettings.groups.push(thisGroupSettings)
	
				save(groupSettings, contentFilePath)
			}

		}else{
			if(!justCheck){
				//confere se o grupo já tem config de tá pago
				if(group.taPagoNerd && group.taPagoNerd.length){
					//confere se o usuário já tem registro no taPagoNerd
					if(group.taPagoNerd.find(pago =>pago.part === author)){
						//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
						//pra isso, precisa formatar a data no formato certo (mm/dd/aa)
	
						const length = group.taPagoNerd.find(pago =>pago.part === author).registros.length
						const latestTaPago = group.taPagoNerd.find(pago =>pago.part === author).registros[length -1]
						const formatado = formataDataUTC(latestTaPago)
	
	
						if(dateIsToday(new Date(formatado))){
							simulateTyping(msg,"Calma lá, champz.. só 1 registro por dia")
							return
						}else{
							group.taPagoNerd.find(pago =>pago.part === author).registros.push(new Date().toLocaleDateString())
						}
	
						
					}else{
						//se não tiver, inicia os registros
						group.taPagoNerd.push({
							"part": author,
							"registros":[new Date().toLocaleDateString()]
						})
					}
					groupSettings.groups.find(group => group.id === chat.id.user).taPagoNerd = group.taPagoNerd
				}else{
					//se não tiver, inicializa a config com o registro inicial do autor
					let taPagoNerd = [{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}]
	
					groupSettings.groups.find(group => group.id === chat.id.user).taPagoNerd = taPagoNerd
				}
	
				save(groupSettings, contentFilePath)
			}
		}

		const pagosToday = getTodaysTaPagos(groupSettings.groups.find(group => group.id === chat.id.user).taPagoNerd)

		
		let resposta = "";
		if(!justCheck){
			resposta = "Partiu ganhar em dólar!! 🤑🤑\n"
		}

		let mentions = []
	
		if(pagosToday && pagosToday.length > 0){
			resposta += "Nerds de hoje:\n"
			pagosToday.forEach(reg =>{
				let owner = chat.participants && chat.participants.find(part => part.id.user === reg)
				if(owner){
					mentions.push(owner)
					resposta += `\n@${owner.id.user}`
				}
			})
		}else{
			resposta += "Ninguém pagou hoje. Bora, time!"
		}

		

		await chat.sendMessage(resposta, { mentions });

		const aosDevedores = path.join(__dirname, '/imgs/aosDevedores.png')
		client.sendMessage(msg.from, MessageMedia.fromFilePath(aosDevedores), {sendMediaAsSticker: true})
	}
}

async function getPartTaPagoNerd(msg, inputChat){
	//Definindo o author da mensagem
	const author = getAuthor(msg)
	let respostasSemTaPago = ['Você não tem tá pago nerd registrado. Sem tá pago, sem  mimos', 'Você não tem nenhum tá pago, bora estudar!']

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			simulateTyping(msg,"Não existem tá pagos nerds cadastrados.")
			return

		}else{
			//confere se o grupo já tem config de tá pago
			if(group.taPagoNerd && group.taPagoNerd.length){
				//confere se o usuário já tem registro no taPago
				if(group.taPagoNerd.find(pago =>pago.part === author)){
					//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
					//pra isso, precisa formatar a data no formato certo (mm/dd/aa)

					if(group.taPagoNerd.find(pago =>pago.part === author).registros.length > 0){
						let resposta = "Seu histórico de 'Tá Pago nerd': \n"
						group.taPagoNerd.find(pago =>pago.part === author).registros.forEach(reg =>{
							resposta += "\n" +reg
						})

						simulateTyping(msg,resposta)
						return
					}else{
						simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
						return
					}

					
				}else{
					simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
					return
				}
			}else{
				simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
				return
			}
		}
	}
}

async function getRankingTaPagoNerd(msg, inputChat) {

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
	}

	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		let group = groupSettings.groups.find(group => group.id === chat.id.user);

		if(group && group.taPagoNerd && group.taPagoNerd.length){

			week = getFullWeek();
			const today = new Date().toLocaleDateString().split('/');
			let mes = [today[1], today[2]].join('/')
			let year = today[2]
			
			const ranking = group.taPagoNerd.map(taPago =>{
				return {
					"part": taPago.part,
					"count":{
						'week': taPago.registros.filter(reg => week.indexOf(reg) !==-1).length,
						'month': taPago.registros.filter(reg => reg.indexOf(mes) !==-1).length,
						'year': taPago.registros.filter(reg => reg.indexOf(year) !==-1).length,
						'allTime': taPago.registros.length
					}
				}
			})
			
			let sortedRanking = sortRanking(ranking)

			let resposta = `_Hall da fama dos *tá pago nerd* do ${chat.name}:_\n\n`
			let mentions = []
			if(sortedRanking.week && sortedRanking.week.length >0){
				resposta += 'Ranking semanal\n'
				sortedRanking.week.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.month && sortedRanking.month.length >0){
				resposta += 'Ranking mensal\n'
				sortedRanking.month.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.year && sortedRanking.year.length >0){
				resposta += 'Ranking anual\n'
				sortedRanking.year.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.allTime && sortedRanking.allTime.length >0){
				resposta += 'Ranking geral\n'
				sortedRanking.allTime.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
			}

			await chat.sendMessage(resposta, { mentions });
		}else{
			simulateTyping(msg,"Ranking não iniciado.")
		}
	}
}

async function taPago(msg, inputChat, justCheck){
	//Definindo o author da mensagem
	const author = getAuthor(msg)

	const chat = inputChat || await msg.getChat()

	const block = await blockTaPagoSemFoto(msg, inputChat);

	//permitir msg mencionada com foto, mas validar que seja do mesmo autor
	if(block && !justCheck){
		if(!msg.hasMedia){
			if(!msg.hasQuotedMsg){
				simulateTyping(msg,"Apenas _tá pago's_ com foto serão aceitos.")
				return;
			}else{
				try{
					const quotedMessage = await msg.getQuotedMessage()
					if(!(quotedMessage && quotedMessage.hasMedia)){
						simulateTyping(msg,"Apenas _tá pago's_ com foto serão aceitos.")
						return;
					}else{
						const quotedAuthor = getAuthor(quotedMessage)
						if(author !== quotedAuthor){
							simulateTyping(msg,"Essa foto não foi vc que enviou, espertão.")
							return;
						}
					}
				}catch(e){
					simulateTyping(msg,"Não foi possível obter os dados da mensagem mencionada.")
					return;
				}
			}
		}
	}

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			if(justCheck){
				simulateTyping(msg,"Ninguém pagou hoje. Bora, time!")
				return;
			}else{
				var thisGroupSettings = {
					"id": chat.id.user,
					"taPago":[{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}],
					"settings": {}
				}
	
				groupSettings.groups = groupSettings.groups || []
				groupSettings.groups.push(thisGroupSettings)
	
				save(groupSettings, contentFilePath)
			}

		}else{
			if(!justCheck){
				//confere se o grupo já tem config de tá pago
				if(group.taPago && group.taPago.length){
					//confere se o usuário já tem registro no taPago
					if(group.taPago.find(pago =>pago.part === author)){
						//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
						//pra isso, precisa formatar a data no formato certo (mm/dd/aa)
	
						const length = group.taPago.find(pago =>pago.part === author).registros.length
						const latestTaPago = group.taPago.find(pago =>pago.part === author).registros[length -1]
						const formatado = formataDataUTC(latestTaPago)
	
	
						if(dateIsToday(new Date(formatado))){
							simulateTyping(msg,"Calma lá, champz.. só 1 registro por dia")
							return
						}else{
							group.taPago.find(pago =>pago.part === author).registros.push(new Date().toLocaleDateString())
						}
	
						
					}else{
						//se não tiver, inicia os registros
						group.taPago.push({
							"part": author,
							"registros":[new Date().toLocaleDateString()]
						})
					}
					groupSettings.groups.find(group => group.id === chat.id.user).taPago = group.taPago
				}else{
					//se não tiver, inicializa a config com o registro inicial do autor
					let taPago = [{
						"part": author,
						"registros":[new Date().toLocaleDateString()]
					}]
	
					groupSettings.groups.find(group => group.id === chat.id.user).taPago = taPago
				}
	
				save(groupSettings, contentFilePath)
			}
		}

		const pagosToday = getTodaysTaPagos(groupSettings.groups.find(group => group.id === chat.id.user).taPago)

		
		let resposta = "";
		if(!justCheck){
			resposta = "No pain, no gain!\n"
		}

		let mentions = []
	
		if(pagosToday && pagosToday.length > 0){
			resposta += "Guerreiros de hoje:\n"
			pagosToday.forEach(reg =>{
				let owner = chat.participants && chat.participants.find(part => part.id.user === reg)
				if(owner){
					mentions.push(owner)
					resposta += `\n@${owner.id.user}`
				}
				
			})
		}else{
			resposta += "Ninguém pagou hoje. Bora, time!"
		}

		

		await chat.sendMessage(resposta, { mentions });

		const aosDevedores = path.join(__dirname, '/imgs/aosDevedores.png')
		client.sendMessage(msg.from, MessageMedia.fromFilePath(aosDevedores), {sendMediaAsSticker: true})
	}
}

async function revokeTaPago(msg, inputChat){
	//Definindo o author da mensagem
	const author = getAuthor(msg)
	const toRevoke = await getTaPagoToRevoke(msg, inputChat);
	if(!toRevoke){
		return;
	}

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operação no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			simulateTyping(msg,"Nenhum tá pago encontrado para o grupo.")
			return;

		}else{
			//confere se o grupo já tem config de tá pago
			if(group.taPago && group.taPago.length){
				//confere se o usuário já tem registro no taPago
				if(group.taPago.find(pago =>pago.part === toRevoke.author)){
					//vê se o usuário já tem registros

					const registros = group.taPago.find(pago =>pago.part === toRevoke.author).registros
					let removed = registros.indexOf(toRevoke.date) === -1 ? null : registros.splice(registros.indexOf(toRevoke.date), 1);
					let cancelados = groupSettings.groups.find(group => group.id === chat.id.user).taPago.find(pago =>pago.part === toRevoke.author).cancelado || [];

					if(removed && !cancelados.find(reg => reg.indexOf(removed) >=0)){
						cancelados.push(removed + ' - Motivo: '+toRevoke.reason)
					}

					groupSettings.groups.find(group => group.id === chat.id.user).taPago.find(pago =>pago.part === toRevoke.author).cancelado = cancelados;
					let motivo = toRevoke.reason ? ' Motivo: '+toRevoke.reason+'.' : '';
					let resposta = `Tá pago ${toRevoke.date} de @${toRevoke.author} removido ou não encontrado.${motivo}`;
					let owner = chat.participants && chat.participants.find(part => part.id.user === toRevoke.author);
					let mentions = [owner];
					await chat.sendMessage(resposta, { mentions });
					
				}else{
					simulateTyping(msg,"Nenhum tá pago encontrado para o participante.")
					return;
				}
				groupSettings.groups.find(group => group.id === chat.id.user).taPago = group.taPago
			}else{
				simulateTyping(msg,"Nenhum tá pago encontrado para esse grupo.")
				return;
			}

			save(groupSettings, contentFilePath)
		}

	}
}

async function getTaPagoToRevoke(msg, inputChat){
	let toRevoke = {};
	if(msg.hasQuotedMsg){
		const quotedMessage = await msg.getQuotedMessage()
		if(!quotedMessage){
			msg.reply("Não foi possível obter os dados da mensagem mencionada. Para remover um tá pago sem mensagem mencionada, copie a próxima mensagem e edite os parâmetros:")
			simulateTyping(msg,"@cancel @pessoa_do_tapago dd/mm/aaaa | motivo do cancelamento",3)
			return;
		}
		if(!(quotedMessage.body.toLowerCase() === "ta pago" || quotedMessage.body.toLowerCase() === "tá pago")){
			simulateTyping(msg,"Selecione uma mensagem com 'tá pago' para remover o registro.")
			return;
		}

		

		toRevoke.author = getAuthor(quotedMessage)
		toRevoke.date = new Date(quotedMessage.timestamp*1000).toLocaleDateString()
		toRevoke.reason = getParamWithSpaces(msg, '@cancel |')

		if(!quotedMessage.timestamp){
			let author = toRevoke.author ? '@'+toRevoke.author : '@pessoa_do_tapago'
			let date = 'dd/mm/aaaa'
			let reason = toRevoke.reason ? toRevoke.reason : 'motivo do cancelamento'

			let owner = inputChat.participants && inputChat.participants.find(part => part.id.user === toRevoke.author);
			let mentions = [owner];

			msg.reply("Não foi possível obter os dados da mensagem mencionada. Para remover um tá pago sem mensagem mencionada, copie a próxima mensagem e edite os parâmetros:")
			// simulateTyping(msg,"@cancel "+author+" "+date+" | "+reason+"",3)
			await inputChat.sendMessage("@cancel "+author+" "+date+" | "+reason+"", { mentions });
			return;
		}
		
		if(!(toRevoke.author && toRevoke.date)){
			let author = toRevoke.author ? '@'+toRevoke.author : '@pessoa_do_tapago'
			let date = toRevoke.date ? toRevoke.date : 'dd/mm/aaaa'
			let reason = toRevoke.reason ? toRevoke.reason : 'motivo do cancelamento'

			let owner = inputChat.participants && inputChat.participants.find(part => part.id.user === toRevoke.author);
			let mentions = [owner];

			msg.reply("Não foi possível obter os dados da mensagem mencionada. Para remover um tá pago sem mensagem mencionada, copie a próxima mensagem e edite os parâmetros:")
			// simulateTyping(msg,"@cancel "+author+" "+date+" | "+reason+"",3)
			await inputChat.sendMessage("@cancel "+author+" "+date+" | "+reason+"", { mentions });
			return;
		}
		
	}else{
		toRevoke = getRevokingParams(msg)
		if(!toRevoke){
			msg.reply("Não foi possível obter os parâmetros do tá pago para remover. Para remover um tá pago sem mensagem mencionada, copie a próxima mensagem e edite os parâmetros:")
			simulateTyping(msg,"@cancel @pessoa_do_tapago dd/mm/aaaa | motivo do cancelamento",3)
			return;
		}
	}
	return toRevoke;
}

function getRevokingParams(msg){
	let body = msg.body || msg;
	let reason = body.indexOf('|') >= 0 ? body.substring(body.indexOf('|')+1) : ''
	let author = body.split(' ')[1].indexOf('@') === 0 ? body.split(' ')[1].replace('@', '') : ''
	let date = body.split(' ')[2].indexOf('/') === 2 ? body.split(' ')[2] : ''

	if(!date || !author){
		return null
	}

	return {
		'date': date,
		"reason": reason,
		"author": author
  	}
}

async function getPartTaPago(msg, inputChat){
	//Definindo o author da mensagem
	const author = getAuthor(msg)
	let respostasSemTaPago = ['Você não tem tá pago registrado. Sem tá pago, sem lanche', 'Você não tem nenhum tá pago, preguiçoso do caralho']

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
		return
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			simulateTyping(msg,"Não existem tá pagos cadastrados.")
			return

		}else{
			//confere se o grupo já tem config de tá pago
			if(group.taPago && group.taPago.length){
				//confere se o usuário já tem registro no taPago
				if(group.taPago.find(pago =>pago.part === author)){
					//vê se o usuário já tem um registro de hoje (só pode ser o último, então dá pra comparar pelo ultimo índice)
					//pra isso, precisa formatar a data no formato certo (mm/dd/aa)

					if(group.taPago.find(pago =>pago.part === author).registros.length > 0){
						let resposta = "Seu histórico de 'Tá Pago': \n"
						group.taPago.find(pago =>pago.part === author).registros.forEach(reg =>{
							resposta += "\n" +reg
						})
						
						if(group.taPago.find(pago =>pago.part === author).cancelado && group.taPago.find(pago =>pago.part === author).cancelado.length > 0){
							resposta += "\n\nSeus 'Tá Pago' cancelados: \n"
							group.taPago.find(pago =>pago.part === author).cancelado.forEach(reg =>{
								resposta += "\n" +reg
							})
						}

						simulateTyping(msg,resposta)
						return
					}else if(group.taPago.find(pago =>pago.part === author).cancelado && group.taPago.find(pago =>pago.part === author).cancelado.length > 0){
						let resposta = "Você só tem 'Tá Pago' cancelado: \n"
						group.taPago.find(pago =>pago.part === author).cancelado.forEach(reg =>{
							resposta += "\n" +reg
						})
						simulateTyping(msg,resposta)
						return
					}else{
						simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
						return
					}

					
				}else{
					simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
					return
				}
			}else{
				simulateTyping(msg,respostasSemTaPago[getRandomInt(2)])
				return
			}
		}
	}
}

async function getRankingTaPago(msg, inputChat) {

	const chat = inputChat || await msg.getChat()

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
	}

	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		let group = groupSettings.groups.find(group => group.id === chat.id.user);

		if(group && group.taPago && group.taPago.length){

			week = getFullWeek();
			const today = new Date().toLocaleDateString().split('/');
			let mes = [today[1], today[2]].join('/')
			let year = today[2]
			
			const ranking = group.taPago.map(taPago =>{
				return {
					"part": taPago.part,
					"count":{
						'week': taPago.registros.filter(reg => week.indexOf(reg) !==-1).length,
						'month': taPago.registros.filter(reg => reg.indexOf(mes) !==-1).length,
						'year': taPago.registros.filter(reg => reg.indexOf(year) !==-1).length,
						'cancelled': taPago.cancelado && taPago.cancelado.length,
						'allTime': taPago.registros.length
					}
				}
			})
			
			let sortedRanking = sortRanking(ranking)

			let resposta = `_Hall da fama dos *tá pago* do ${chat.name}:_\n\n`
			let mentions = []
			
			if(sortedRanking.week && sortedRanking.week.length >0){
				resposta += 'Ranking semanal\n'
				sortedRanking.week.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
					
				})
				resposta += '\n\n'
			}

			if(sortedRanking.month && sortedRanking.month.length >0){
				resposta += 'Ranking mensal\n'
				sortedRanking.month.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.year && sortedRanking.year.length >0){
				resposta += 'Ranking anual\n'
				sortedRanking.year.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.allTime && sortedRanking.allTime.length >0){
				resposta += 'Ranking geral\n'
				sortedRanking.allTime.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count} *tá pago${part.count>1?'s':''}*`
					}
				})
				resposta += '\n\n'
			}

			if(sortedRanking.cancelled && sortedRanking.cancelled.length >0){
				resposta += 'Registros cancelados\n'
				sortedRanking.cancelled.forEach(part =>{
					let owner = chat.participants && chat.participants.find(chatPart => chatPart.id.user === part.part)
					if(owner){
						mentions.push(owner)
						resposta += `\n@${owner.id.user}: ${part.count || '0'} *tá pago${!part.count || part.count>1 ?'s':''}* cancelados`
					}
				})
			}

			await chat.sendMessage(resposta, { mentions });
		}else{
			simulateTyping(msg,"Ranking não iniciado.")
		}
	}
}

function sortRanking(ranking){
    return {
        'week': sort(ranking, 'week').map(rank => {
            return {'part': rank.part, 'count': rank.count['week']}
        }),
        'month': sort(ranking, 'month').map(rank => {
            return {'part': rank.part, 'count': rank.count['month']}
        }),
        'year': sort(ranking, 'year').map(rank => {
            return {'part': rank.part, 'count': rank.count['year']}
        }),
        'allTime': sort(ranking, 'allTime').map(rank => {
            return {'part': rank.part, 'count': rank.count['allTime']}
        }),
		'cancelled': sort(ranking, 'cancelled').map(rank => {
            return {'part': rank.part, 'count': rank.count['cancelled']}
        })
    }
}

function sort(arr, key){
    return arr.sort((a, b) =>{
        return b.count[key] - a.count[key]
    })
}

function getFullWeek(){
    const umDiaMs = 24 * 60 * 60 * 1000;
    let day = new Date().getDay()
    
    let dom = new Date(new Date().getTime() - (day*umDiaMs))
    let week = [dom.toLocaleDateString()]
    for(let i = 1; i<7; i++){
        week.push(new Date(new Date(dom).getTime() + (i*umDiaMs)).toLocaleDateString())
    }
    
    return week
}


function dateIsToday(date){
	let today = new Date().toLocaleDateString();
    let inputDate = date.toLocaleDateString();

    return inputDate === today
}

function formataDataUTC(stringInp){
	let string = stringInp || '';
	let data = string.split('/')
	return [data[1], data[0], data[2]].join('/')
}

function getTodaysTaPagos(taPago, multiple){
	if(Array.isArray(taPago)){
		if(multiple){
			let pagosToday = taPago.filter(pago => pago.registros.filter(reg => dateIsToday(new Date(formataDataUTC(reg)))).length > 0)

			return pagosToday.map(part =>  {
				return{
					part: part.part,
					count: part.registros.filter(reg => dateIsToday(new Date(formataDataUTC(reg)))).length
				}
				
			})
		}
		return taPago.filter(pago => pago.registros.find(reg => dateIsToday(new Date(formataDataUTC(reg))))).map(reg => reg.part)
	}
	else{
		return null;
	} 
  }

function getParam(body){
	//garante que a função funcione mesmo se o parametro passado for a msg inteira (e n só o body)
	var text = body.body || body
	
	return text.split(' ')[2]
}

function getRandomInt(max, sum) {
	var i = 0;
	if(sum){
		i = 1
	}
	return i + Math.floor(Math.random() * max);
}

function perguntaComAlguem(body) { 
	body = body.toLowerCase()
	return ((body.indexOf("alguém") === 0 || body.indexOf("alguem") === 0 || body.indexOf("algm") === 0) && body.lastIndexOf('?') === body.length -1)
}

function hasBozo(body){
	body = body.toLowerCase()
	var variacoes = ['bolsonaro', 'm1to', 'bozo', 'biroliro', 'bonoro', 'bozonaro', 'salnorabo', 'bonossauro', 'bolsonabo', 'bolsonazi', 'oranoslob'];
	return variacoes.find(variacao => body.indexOf(variacao) !== -1)
}

function hasFxCaiu(body){
	body = body.toLowerCase()
	return (body.indexOf('fx') !== -1 && body.indexOf('caiu') !== -1 && body.indexOf('?') !== -1)
}
function mathRound(value){
	return (Math.round(value* 100) / 100).toFixed(2)
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function cryptoCheck(msg){
	//busca o preço do dolar
	var DOLAR;
	const rateRequest= {
		method: 'GET',
		uri: 'http://economia.awesomeapi.com.br/json/last/USD-BRL',
		
		json: true,
		gzip: true
	};

	rp(rateRequest).then(response => {
		//dolar to brl
		DOLAR = (Math.round(((parseFloat(response.USDBRL.high) + parseFloat(response.USDBRL.low))/2) * 100) / 100).toFixed(2)
		
	}).catch((err) => {
		console.log('API call error:', err.message);
	});

	
	//busca o preço das criptos
	const requestOptions = {
		method: 'GET',
		uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
		
		headers: {
			'X-CMC_PRO_API_KEY': 'd522701c-43bc-465d-9d2f-f85f6129f3d9'
		},
		json: true,
		gzip: true
	};
		
	rp(requestOptions).then(response => {
		//monta a msg convertendo os preços pra BRL e USD
		let BTC = mathRound(response.data.find(d => d.id == 1).quote.USD.price);
		let ETH = mathRound(response.data.find(d => d.id == 1027).quote.USD.price);
		let BNB = mathRound(response.data.find(d => d.id == 1839).quote.USD.price);
		let DOGE = mathRound(response.data.find(d => d.id == 74).quote.USD.price);
		let SHIBA = mathRound(response.data.find(d => d.id == 5994).quote.USD.price);
		let ADA = mathRound(response.data.find(d => d.id == 2010).quote.USD.price);
		
		simulateTyping(msg,"Preços das criptomoedas atualmente: \n\n"+
		"USD: "+ DOLAR + " reais (*oBrIgAdO pAuLo GuEdEs*) \n\n"+
		"BTC - Bitcoin: USD "+ numberWithCommas(BTC) +" // R$ "+numberWithCommas(mathRound(BTC*DOLAR)) +"\n \n"+
		"ETH - Ethereum: USD "+ numberWithCommas(ETH) +" // R$ "+numberWithCommas(mathRound(ETH*DOLAR)) +"\n \n"+
		"BNB - Binance Coin: USD "+ numberWithCommas(BNB) +" // R$ "+numberWithCommas(mathRound(BNB*DOLAR)) +"\n \n"+
		"DOGE - Doge Coin: USD "+ numberWithCommas(DOGE) +" // R$ "+numberWithCommas(mathRound(DOGE*DOLAR)) +"\n \n"+
		"SHIB - SHIBA INU: USD "+ numberWithCommas(SHIBA) +" // R$ "+numberWithCommas(mathRound(SHIBA*DOLAR)) +"\n \n"+ 
		"ADA - Cardano "+ numberWithCommas(ADA) +" // R$ "+numberWithCommas(mathRound(ADA*DOLAR)))
	}).catch((err) => {
		console.log('API call error:', err.message);
	});
}

//retorna o cep formatado
function formatarCEP(body){
	body = body.split(" ");
	if(body[2]){
	  return body[2].replace(/(\.|\/|\-)/g,"");
	}else{
	  return null;
	}
}

function cepCheck(msg){
	//formata o cep
	var cep = formatarCEP(msg.body);

	//busca os dados na api
	if(cep){
		const CEPRequest= {
			method: 'GET',
			uri: 'https://viacep.com.br/ws/'+ cep+ '/json/'
		};

		rp(CEPRequest).then(response => {
			let resp = JSON.parse(response);
			simulateTyping(msg,"Resultado da busca: \n\n"+ 
			("CEP: *"+ resp.cep + "* \nLogradouro: *"+ resp.logradouro || '(sem logradouro)')+ "* \nBairro:  *"+ (resp.bairro || '(sem bairro)') + "* \nCidade: *" + resp.localidade + "* \nUF: *" + resp.uf+"*")
		}).catch((err) => {	
			simulateTyping(msg,'🛑 CEP '+ cep + ' inválido ou não encontrado.');
		});
	}else{
		simulateTyping(msg,'Digite um CEP')
	}
}

//api de encurtar url
async function shortenURL(inputUrl, msg){
	const urlShortener= {
		method: 'POST',
		url: 'https://url-shortener-service.p.rapidapi.com/shorten',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			'x-rapidapi-host': 'url-shortener-service.p.rapidapi.com',
			'x-rapidapi-key': '259cd05defmsh1972296eaa9ecd9p1a1a22jsn0f3c52bb09e9',
			useQueryString: true
		},
		form: {
			url: inputUrl
		}
	};
	 
	// console.log(urlShortener)
	rp(urlShortener).then(response => {
		let resp = JSON.parse(response);
		if(msg){
			simulateTyping(msg,"Url encurtada: \n\n"+ resp.result_url)
		}else{
			return resp.result_url
		}
		
		
	}).catch((err) => {	
		console.log(err)
		if(msg){
			simulateTyping(msg,'Não foi possível encurtar a URL selecionada.');
		}else{
			return null;
		}
		
	});

}

//busca informações de uma wallet na ethermine
function getMinerStats(param, msg){
	const ethermineReq= {
		method: 'GET',
		uri: 'https://api.ethermine.org/miner/:'+ param + '/dashboard'
	};

	rp(ethermineReq).then(response => {
		let resp = JSON.parse(response);
		var report = "Status: ";
		if(resp.status == "OK"){
			report += resp.status
			if(resp.data){
				if(resp.data.workers){
					report += "\n\n*Quantidade de Workers:* "+ resp.data.workers.length+"\n"
					

					if(resp.data.currentStatistics){

						//Valor do ETH: 
						const requestOptions = {
							method: 'GET',
							uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
							// qs: {
							// 	'start': '1',
							// 	'limit': '5000',
							// 	'convert': 'USD'
							// },
							headers: {
								'X-CMC_PRO_API_KEY': 'd522701c-43bc-465d-9d2f-f85f6129f3d9'
							},
							json: true,
							gzip: true
						};
						var ETHToUSD 
						rp(requestOptions).then(response => {
							ETHToUSD = mathRound(response.data.find(d => d.id == 1027).quote.USD.price);
							//valor do dolar
							var DOLAR;
							const rateRequest= {
								method: 'GET',
								uri: 'http://economia.awesomeapi.com.br/json/last/USD-BRL',
								
								json: true,
								gzip: true
							};

							rp(rateRequest).then(response => {
								DOLAR = (Math.round(((parseFloat(response.USDBRL.high) + parseFloat(response.USDBRL.low))/2) * 100) / 100).toFixed(2)
								var unpaidETH = (resp.data.currentStatistics.unpaid/1000/1000/1000/1000/1000/1000);
								// console.log(unpaidETH)
								report += "\n*Visto por último:* "+new Date(resp.data.currentStatistics.lastSeen*1000).toLocaleString() 
								report += "\n*Reported Hashrate:* "+ (mathRound(resp.data.currentStatistics.reportedHashrate/1000000))
								report += "\n*Current Hashrate:* "+ (mathRound(resp.data.currentStatistics.currentHashrate/1000000))
								report += "\n*Valid Shares (última hora):* "+ resp.data.currentStatistics.validShares
								report += "\n*Invalid Shares (última hora):* "+ resp.data.currentStatistics.invalidShares
								report += "\n*Stale Shares (última hora):* "+ resp.data.currentStatistics.staleShares
								report += "\n*Unpaid Balance:* "
								report += "\n\n"+unpaidETH +" ETH"
								if(ETHToUSD){
									report += "\n"+mathRound(unpaidETH*ETHToUSD)+ " USD"
									if(DOLAR){
										report += "\n"+mathRound(unpaidETH*ETHToUSD*DOLAR)+ " BRL"
									}
								}
								// console.log(report)
								simulateTyping(msg,report)

							}).catch((err) => {
								console.log('API call error:', err.message);
							});
						}).catch((err) => {
							console.log('API call error:', err.message);
						});

						

						
					}

				}
				// return report
			}
		}else{
			simulateTyping(msg,"Miner não encontrado.")
		}

		
	}).catch((err) => {
		simulateTyping(msg,"Não foi possível buscar os dados no momento.")
	});

}

/*DEPRECATED
//rastreia encomenda nos correios
function rastrearEncomenda(msg){
	//requisitando o pacote
	const { rastrearEncomendas } = require('correios-brasil');
			
	//montando o código
	let codRastreio = [getParam(msg.body)]
	
	//chamando o método e montando a resposta
	rastrearEncomendas(codRastreio).then((response) => {
		// console.log(response)
		var mensagem = "*Atualizações*: "
		if(response[0] && response[0].length){
			for (var i = response[0].length - 1; i >= 0; i--) {
				mensagem += "\n\n*Status*: "+ response[0][i].status
				mensagem += "\n*Data*: "+ response[0][i].data
				mensagem += "\n*Hora*: "+ response[0][i].hora
				if(response[0][i].local){
					mensagem += "\n*Local*: "+ response[0][i].local
				}

				if(response[0][i].origem){
					mensagem += "\n*Origem*: "+ response[0][i].origem
				}

				if(response[0][i].destino){
					mensagem += "\n*Destino*: "+ response[0][i].destino
				}
				
			}

			simulateTyping(msg,mensagem)
		}

		else{
			simulateTyping(msg,"Código de rastreio não encontrado.")
		}
	});
}
*/

//rastreia encomenda nos correios
function rastrearEncomendas(msg, codigos){
	//requisitando o pacote
	const { rastrearEncomendas } = require('correios-brasil');
	

	//montando o código
	let codRastreio = codigos || getParamWithSpaces(msg, '@rastreio | ').split(' ')

	//chamando o método e montando a resposta
	rastrearEncomendas(codRastreio).then((response) => {
		if(response&& response.length){
			for (var j = 0; j < response.length;  j++) {
				var mensagem = "*Atualizações do rastreio "+codRastreio[j].toUpperCase()+"*: "
				if(response[j] && response[j].length){ 
					for (var i = response[j].length - 1; i >= 0; i--) {
						mensagem += "\n\n*Status*: "+ response[j][i].status
						mensagem += "\n*Data*: "+ response[j][i].data
						mensagem += "\n*Hora*: "+ response[j][i].hora
						if(response[j][i].local){
							mensagem += "\n*Local*: "+ response[j][i].local
						}

						if(response[j][i].origem){
							mensagem += "\n*Origem*: "+ response[j][i].origem
						}

						if(response[j][i].destino){
							mensagem += "\n*Destino*: "+ response[j][i].destino
						}
						
					}
				}else{
					mensagem += "\n*Código de rastreio não encontrado.*"
				}

				simulateTyping(msg,mensagem)
			}
		}else{
			simulateTyping(msg,"Não foi possível fazer a busca no momento.")
		}

		if(!codigos){
			simulateTyping(msg,"Lembrando que é possível cadastrar os códigos de rastreio através do comando _@codigoAdd_. Assim, é possível rastrear todos os códigos cadastrados utilizando apenas o comando _@rastreio_. Para mais informações, utilize o _@menuUtils_")
		}
	});
}



//api de piada aleatória
function getRandomJoke(msg){
	const joke= {
		method: 'GET',
		uri: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit'
	};

	rp(joke).then(response => {
		let resp = JSON.parse(response);

		if(resp.joke){
			simulateTyping(msg,resp.joke)
		}
		

		if(resp.type === "twopart"){
			simulateTyping(msg,"Q: "+ resp.setup)

			setTimeout(function () {
				simulateTyping(msg,"A: " + resp.delivery)
			}, 3000);
			
		}
		
	}).catch((err) => {	
		simulateTyping(msg,'Não foi possível encontrar nenhuma piada. Talvez a piada seja você :)');
	});
}

function getRandomDevJoke(msg){
	const joke= {
		method: 'GET',
		uri: 'https://v2.jokeapi.dev/joke/Programming'
	};

	rp(joke).then(response => {
		let resp = JSON.parse(response);

		if(resp.joke){
			simulateTyping(msg,resp.joke)
		}
		

		if(resp.type === "twopart"){
			simulateTyping(msg,"Q: "+ resp.setup)

			setTimeout(function () {
				simulateTyping(msg,"A: " + resp.delivery)
			}, 3000);
			
		}
		
	}).catch((err) => {	
		simulateTyping(msg,'Não foi possível encontrar nenhuma piada. Talvez a piada seja você :)');
	});
}


//api de fatos aleatórios sobre gatos
function getRandomCatFact(msg){
	const catFact= {
		method: 'GET',
		uri: 'https://catfact.ninja/fact'
	};

	rp(catFact).then(response => {
		let resp = JSON.parse(response);

		if(resp.fact)
		simulateTyping(msg,resp.fact)
		
	}).catch((err) => {	
		// msg.reply('Não foi possível encontrar nenhuma piada. Talvez a piada seja você.');
	});
}


//api de conselho aleatorio
function getRandomAdvice(msg){
	const advice= {
		method: 'GET',
		uri: 'https://api.adviceslip.com/advice'
	};

	rp(advice).then(response => {
		let resp = JSON.parse(response);
		if(resp.slip && resp.slip.advice)
			simulateTyping(msg,resp.slip.advice)
		
	}).catch((err) => {	
		
	});
}

//api de quote aleatória do kanye
function getRandomKanyeQuote(msg){
	const kanye= {
		method: 'GET',
		uri: 'https://api.kanye.rest/'
	};

	rp(kanye).then(response => {
		let resp = JSON.parse(response);
		if(resp.quote)
			simulateTyping(msg,'_"'+resp.quote+'."_ West, Kanye')
		
	}).catch((err) => {	
		
	});
}

//api de piada aleatória do chuck norris
function getRandomChuckNorrisJoke(msg){
	const chuck= {
		method: 'GET',
		uri: 'https://api.chucknorris.io/jokes/random'
	};

	rp(chuck).then(response => {
		let resp = JSON.parse(response);
		if(resp.value)
			simulateTyping(msg,resp.value)
		
	}).catch((err) => {	
		
	});
}

function save(content, contentFilePath){
	const contentString = JSON.stringify(content)
	return fs.writeFileSync(contentFilePath, contentString)
}

function load(contentFilePath){
	const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8')
	const contentJson = JSON.parse(fileBuffer)
	return contentJson
}

function getAuthor(msg){
	var author = (msg.author || msg.from)
	author = author.slice(0, author.indexOf("@"))
	return author
}

function pixCreate(msg){
	//Definindo o author da mensagem
	var msgAuthor = getAuthor(msg)

	var pix = getParam(msg.body)
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pixies.json')
	const pixies = load(contentFilePath);
	if(!pixies || !pixies.contacts){
		simulateTyping(msg,"Não foi possível cadastrar o Pix no momento.")
	}
	if(pixies && pixies.contacts){
		// procura o pix do author
		var author = pixies.contacts.find(contact => contact.id === msgAuthor);
		//pix ainda não cadastrado
		if(!author){
			pixies.contacts = pixies.contacts || []
			pixies.contacts.push({
				"id": msgAuthor,
				"pix": pix
			})
			save(pixies, contentFilePath)
			simulateTyping(msg,"Pix cadastrado com sucesso.")
			
		}else if(author && !author.pix){
			// console.log(pixies.contacts.find(contact => contact.id === msgAuthor))
			pixies.contacts.find(contact => contact.id === msgAuthor).pix = pix;
			save(pixies, contentFilePath)
			simulateTyping(msg,'Pix cadastrado com sucesso.')
		}else{
			simulateTyping(msg,"Pix já cadastrado ("+ author.pix+"). Para alterá-lo, use o comando '@pixUpdate | <novoPix>'")
		}
	}
}

function pixUpdate(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	var pix = getParam(msg.body)
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pixies.json')
	var pixies = load(contentFilePath);

	if(!pixies || !pixies.contacts){
		simulateTyping(msg,"Não foi possível atualizar o Pix no momento.")
	}

	if(pixies && pixies.contacts){
		// procura o pix do author
		var authorPix = pixies.contacts.find(contact => contact.id === author);
		//pix ainda não cadastrado
		if(!authorPix){
			simulateTyping(msg,"Você ainda não possui chave pix cadastrada. Para cadastrar uma chave, utilize o comando '@pixCreate | _chave pix_'.")
		}else{
			pixies.contacts.find(contact => contact.id === author).pix = pix;
			save(pixies, contentFilePath)
			simulateTyping(msg,"Pix atualizado com sucesso.")
		}
	}
}

function pixDelete(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pixies.json')
	var pixies = load(contentFilePath);

	if(!pixies || !pixies.contacts){
		simulateTyping(msg,"Pix não cadastrado.")
	}

	if(pixies && pixies.contacts){
		// procura o pix do author
		var authorPix = pixies.contacts.find(contact => contact.id === author).pix;
		//pix ainda não cadastrado
		if(!authorPix){
			simulateTyping(msg,"Você não possui chave pix cadastrada..")
		}else{
			pixies.contacts.find(contact => contact.id === author).pix = null;
			// console.log(pixies)
			save(pixies, contentFilePath)
			simulateTyping(msg,"Pix removido com sucesso.")
		}
	}
}

async function pixAll(msg){
	const chat = await msg.getChat()

	const contentFilePath = path.join(__dirname, '/pixies.json')
	var pixies = load(contentFilePath);

	if(pixies && pixies.contacts && pixies.contacts.length){
		var participantPixies = pixies.contacts.filter(contact => chat.participants.find(CP => CP.id.user === contact.id))
		if(participantPixies && participantPixies.length > 0){
			let text = "";
			let mentions = [];
			participantPixies.forEach(partPix =>{
				if(partPix.pix){
					let owner = chat.participants && chat.participants.find(part => part.id.user === partPix.id)
					mentions.push(owner)
					text += `Pix @${owner.id.user}` + ": "+partPix.pix+"\n"
				}
				
			})

			
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				chat.sendMessage(text, { mentions });
			}, i*1000);
		}
	}else{
		await chat.sendMessage('Nenhum pix cadastrado.');
	}
}

async function printAuthorPix(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pixies.json')
	var pixies = load(contentFilePath);

	if(!pixies || !pixies.contacts){
		simulateTyping(msg,"Nenhum código PIX cadastrado.")
	}else{
		// procura o pix do author
		var authorPix = pixies.contacts.find(contact => contact.id === author);
		//pix ainda não cadastrado
		if(!(authorPix && authorPix.pix)){
			simulateTyping(msg,"Você ainda não possui chave pix cadastrada. Para cadastrar uma chave, utilize o comando '@pixCreate | _chave pix_'.")
		}else{
			simulateTyping(msg,"Sua chave PIX é "+ authorPix.pix)
		}
	}
}


async function printPix(msg){
	if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
		simulateTyping(msg,'Mencione alguém para saber o pix');
	}else{
		//obtendo participantes do grupo
		const chat = await msg.getChat()

		//carregando o arquivo com os pix's
		const contentFilePath = path.join(__dirname, '/pixies.json')
		var pixies = load(contentFilePath);

		if(!pixies || !pixies.contacts){
			simulateTyping(msg,"Não foi possível consultar os Pix's no momento.")
		}else{
			let text = "";
			let mentions = [];
			msg.mentionedIds.forEach(id =>{
				var realId = id.slice(0, id.indexOf("@"))
				var contactPix = pixies.contacts.find(pix => pix.id === realId)
				var mentionedContact = chat.participants && chat.participants.find(part => part.id.user === realId)
				if(contactPix && contactPix.pix){
					text += `Pix @${realId}` + ": "+contactPix.pix+"\n"
				}else{
					text+= `Pix @${realId}` + ": não cadastrado\n"
				}

				mentions.push(mentionedContact)
			})

			
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				chat.sendMessage(text, { mentions });
			}, i*1000);
		}
	}
}


async function validateGroup(msg){
	const chat = await msg.getChat();
	
	const contentFilePath = path.join(__dirname, '/authorized_groups.json')
	const groups = load(contentFilePath);

	//a primeira coisa do return é o !chat.isGroup. isso autoriza qq usuário individual (por enquanto dá pra deixar assim)
	return (!chat.isGroup || (groups && groups.groups && groups.groups.find(g => g.id === chat.id.user)))
}

function movieSearch(msg, client){
	//extrai o nome do filme
	var name = msg.body.substring(msg.body.lastIndexOf("@filme | ") + 9, msg.body.length);
	
	//busca os dados na api
	if(name){
		const movieRequest = {
			method: 'GET',
			uri: 'https://api.themoviedb.org/3/search/movie?api_key='+ MOVIEDB_KEY+ '&language=pt-BR&query='+name
		};
		
		rp(movieRequest).then(response => {
			let resp = JSON.parse(response);
			var result = resp && resp.results && resp.results[0]
			if(result){

				const genreRequest = {
					method: 'GET',
					uri: 'https://api.themoviedb.org/3/genre/movie/list?api_key='+ MOVIEDB_KEY+ '&language=pt-BR'
				}

				rp(genreRequest).then(response =>{
					var genresIds = result.genre_ids;
					var genres = ""
					const parseResult = JSON.parse(response)
					genresIds.forEach(id =>{
						genres += parseResult.genres.find(gen => gen.id == id).name + ", "
						
					})
					genres = genres.substring(0, genres.length -2)
					var text = "";
					text += "*Título*: "+ result.title
					text += "\n*Nota*: "+ result.vote_average
					text += "\n*Título original*: "+ result.original_title
					text += "\n*Lançamento*: "+ formatarData(new Date(result.release_date + ", 00:000:000"))
					text += "\n*Gênero*: "+ genres
					text += "\n\n*Sinopse*: "+ result.overview
					var url = "https://www.themoviedb.org/t/p/original"+ result.poster_path
					download(url, client, msg, text)
				})
			}else{
				simulateTyping(msg,'Filme não encontrado');
			}
		}).catch((err) => {	
			simulateTyping(msg,'Não foi possível fazer a busca no momento');
		});
	}else{
		simulateTyping(msg,'Digite o nome de um filme')
	}
}

function tvShowSearch(msg, client){
	//extrai o nome da série
	var name = msg.body.substring(msg.body.lastIndexOf("@serie | ") + 9, msg.body.length).replaceAll(" ", "%20");
	
	//busca os dados na api
	if(name){
		const tvShowRequest = {
			method: 'GET',
			uri: 'https://api.themoviedb.org/3/search/tv?api_key='+ MOVIEDB_KEY+ '&language=pt-BR&query='+name
		};

		
		rp(tvShowRequest).then(response => {
			let resp = JSON.parse(response);
			var result = resp && resp.results && resp.results[0]
			if(result){

				const genreRequest = {
					method: 'GET',
					uri: 'https://api.themoviedb.org/3/genre/tv/list?api_key='+ MOVIEDB_KEY+ '&language=pt-BR'
				}

				rp(genreRequest).then(response =>{
					var genresIds = result.genre_ids;
					var genres = ""
					const parseResult = JSON.parse(response)
					genresIds.forEach(id =>{
						genres += parseResult.genres.find(gen => gen.id == id).name + ", "
						
					})
					genres = genres.substring(0, genres.length -2)
					var text = "";
					text += "*Título*: "+ result.name
					text += "\n*Nota*: "+ result.vote_average
					text += "\n*Título original*: "+ result.original_name
					text += "\n*Lançamento*: "+ formatarData(new Date(result.first_air_date + ", 00:000:000"))
					text += "\n*Gênero*: "+ genres
					text += "\n\n*Sinopse*: "+ result.overview
					var url = "https://www.themoviedb.org/t/p/original"+ result.poster_path
					download(url, client, msg, text)
				})
			}else{
				simulateTyping(msg,'Série não encontrada');
			}
		}).catch((err) => {	
			simulateTyping(msg,'Não foi possível fazer a busca no momento');
		});
	}else{
		simulateTyping(msg,'Digite o nome de uma série')
	}
}

//url, client, msg, legenda da foto, bool pra mandar como sticker e parâmetro que determina pra quem a gente vai enviar
function download(url, client, msg, text, sendMediaAsSticker, to){
	var destinatario = to || msg.from
	request.get(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var media = new MessageMedia(response.headers["content-type"], Buffer.from(body).toString('base64'), 'moviePoster.jpg')
			client.sendMessage(destinatario, media, {caption: text, quotedMessageId: msg.id._serialized, sendMediaAsSticker: sendMediaAsSticker})
		}else{
			simulateTyping(msg,text);
		}
	});
}


function formatarData(date){
	var dia  = date.getDate().toString()
	var diaF = (dia.length == 1) ? '0'+dia : dia
	var mes  = (date.getMonth()+1).toString() //+1 pois no getMonth Janeiro começa com zero.
	var mesF = (mes.length == 1) ? '0'+mes : mes
	var anoF = date.getFullYear();
	  return diaF+"/"+mesF+"/"+anoF;
}

function poGoCreate(msg){
	//Definindo o author da mensagem
	var msgAuthor = getAuthor(msg)

	var code = getParamWithSpaces(msg, '@pokecreate | ')
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pogo.json')
	const codes = load(contentFilePath);
	if(!codes || !codes.contacts){
		simulateTyping(msg,"Não foi possível cadastrar o código PokemonGo no momento.")
	}
	if(codes && codes.contacts){
		// procura o pix do author
		var author = codes.contacts.find(contact => contact.id === msgAuthor);
		//pix ainda não cadastrado
		if(!author){
			codes.contacts = codes.contacts || []
			codes.contacts.push({
				"id": msgAuthor,
				"code": code
			})
			save(codes, contentFilePath)
			simulateTyping(msg,"Código cadastrado com sucesso.")
			
		}else if(author && !author.code){
			// console.log(pixies.contacts.find(contact => contact.id === msgAuthor))
			codes.contacts.find(contact => contact.id === msgAuthor).code = code;
			save(codes, contentFilePath)
			simulateTyping(msg,'Código cadastrado com sucesso.')
		}else{
			simulateTyping(msg,"Código já cadastrado ("+ author.code+"). Para alterá-lo, use o comando '@pokeUpdate | <novoCódigo>'")
		}
	}
}

function poGoUpdate(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	var code = getParamWithSpaces(msg, '@pokeUpdate | ')
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pogo.json')
	var codes = load(contentFilePath);

	if(!codes || !codes.contacts){
		simulateTyping(msg,"Não foi possível atualizar o código PokemonGo no momento.")
	}

	if(codes && codes.contacts){
		// procura o pix do author
		var authorCode = codes.contacts.find(contact => contact.id === author);
		//pix ainda não cadastrado
		if(!authorCode){
			simulateTyping(msg,"Você ainda não possui código Pokemon Go cadastrado. Para cadastrar um código, utilize o comando '@pokeCreate | _código de treinador_'.")
		}else{
			codes.contacts.find(contact => contact.id === author).code = code;
			save(codes, contentFilePath)
			simulateTyping(msg,"Código atualizado com sucesso.")
		}
	}
}

function pogoDelete(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pogo.json')
	var codes = load(contentFilePath);

	if(!codes || !codes.contacts){
		simulateTyping(msg,"Código não cadastrado.")
	}

	if(codes && codes.contacts){
		// procura o pix do author
		var authorCode = codes.contacts.find(contact => contact.id === author).code;
		//pix ainda não cadastrado
		if(!authorCode){
			simulateTyping(msg,"Você não possui código Pokemon Go cadastrado.")
		}else{
			codes.contacts.find(contact => contact.id === author).code = null;
			save(codes, contentFilePath)
			simulateTyping(msg,"Código removido com sucesso.")
		}
	}
}

async function pogoAll(msg){
	const chat = await msg.getChat()

	const contentFilePath = path.join(__dirname, '/pogo.json')
	var codes = load(contentFilePath);

	if(codes && codes.contacts && codes.contacts.length > 0){
		var participantCodes = codes.contacts.filter(contact => chat.participants.find(CP => CP.id.user === contact.id))
		if(participantCodes && participantCodes.length > 0){
			let text = "";
			let mentions = [];
			participantCodes.forEach(partCode =>{
				if(partCode.code){
					let owner = chat.participants && chat.participants.find(part => part.id.user === partCode.id)
					mentions.push(owner)
					text += `Código @${owner.id.user}` + ": "+partCode.code+"\n"
				}
				
			})
			if(text){
				await chat.sendMessage(text, { mentions });
			}else{
				await chat.sendMessage('Nenhum código cadastrado.');
			}
			
		}else{
			simulateTyping(msg,'Nenhum participante do grupo possui código Pokemon Go cadastrado')
		}
	}else{
		simulateTyping(msg,'Nenhum código cadastrado.');
	}
}

async function printPogo(msg){
	if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
		simulateTyping(msg,'Mencione alguém para saber o código');
	}else{
		//obtendo participantes do grupo
		const chat = await msg.getChat()

		//carregando o arquivo com os pix's
		const contentFilePath = path.join(__dirname, '/pogo.json')
		var codes = load(contentFilePath);

		if(!codes || !codes.contacts){
			simulateTyping(msg,"Não foi possível consultar os Códigos no momento.")
		}else{
			let text = "";
			let mentions = [];
			msg.mentionedIds.forEach(id =>{
				var realId = id.slice(0, id.indexOf("@"))
				var contactCode = codes.contacts.find(code => code.id === realId)
				var mentionedContact = chat.participants && chat.participants.find(part => part.id.user === realId)
				if(contactCode && contactCode.code){
					text += `Código @${realId}` + ": "+contactCode.code+"\n"
				}else{
					text+= `Código @${realId}` + ": não cadastrado\n"
				}

				mentions.push(mentionedContact)
			})
			await chat.sendMessage(text, { mentions });
		}
	}
}

async function printAuthorPogo(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/pogo.json')
	var codes = load(contentFilePath);

	if(!codes || !codes.contacts){
		simulateTyping(msg,"Código não cadastrado.")
	}else{
		// procura o código do author
		var authorCode = codes.contacts.find(contact => contact.id === author);
		//código ainda não cadastrado
		if(!(authorCode && authorCode.code)){
			simulateTyping(msg,"Você ainda não possui código Pokemon Go cadastrado. Para cadastrar um código, utilize o comando '@pokeCreate | _código de treinador_'.")
		}else{
			simulateTyping(msg,"Seu código Pokemon Go é: "+ authorCode.code)
		}
	}
}

function getParamWithSpaces(msg, handle){
	return msg.body.substring(handle.length, msg.body.length)
}

function randomPerson(msg, client){
	simulateTyping(msg,'Um momento...')
	try{
		download('https://thispersondoesnotexist.com/image', client, msg, '')
	}catch(err){

	}
	
}

function randomMeme(msg, client){
	try{
		const memeRequest = {
			method: 'GET',
			uri: 'https://meme-api.herokuapp.com/gimme'
		};
		rp(memeRequest).then(response =>{
			var result = JSON.parse(response)
			if(result && result.url){
				try{
					download(result.url, client, msg, result.title)
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o meme no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o meme no momento')
	}
	
}


function randomDog(msg, client){
	try{
		const dogRequest = {
			method: 'GET',
			uri: 'https://dog.ceo/api/breeds/image/random'
		};
		rp(dogRequest).then(response =>{
			var result = JSON.parse(response)
			if(result && result.message){
				try{
					download(result.message, client, msg, 'CATCHURRO')
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o cachorro no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o cachorro no momento')
	}
}


function randomCat(msg, client){
	try{
		const catRequest = {
			method: 'GET',
			uri: 'https://thatcopy.pw/catapi/rest/'
		};
		rp(catRequest).then(response =>{
			var result = JSON.parse(response)
			if(result && result.webpurl){
				try{
					download(result.webpurl, client, msg, 'GATINHU')
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o gato no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o gato no momento')
	}
}

async function encaminharOfertas(msg) {
	const chatId = '120363022069482034@g.us' //id do grupo que eu criei
	let chat = await client.getChatById(chatId)
	await msg.forward(chat)
}

async function encaminharOfertasDeNote20(msg) {
	const chatId = '120363020077091769@g.us' //id do grupo que eu criei
	let chat = await client.getChatById(chatId)
	await msg.forward(chat)
}

function geradorDeNome(msg, file, nome){
	const contentFilePath = path.join(__dirname, '/'+file+'.json')
	const GERADOR = load(contentFilePath).nomes;
	simulateTyping(msg, 'Seu nome de ' + nome +' é '+ GERADOR.primeiro[getRandomInt(GERADOR.primeiro.length)] + " "+ GERADOR.segundo[getRandomInt(GERADOR.segundo.length)])
}

async function TTs(msg){
	var params = getTTSParams(msg.body)
	var fontSize
	var textColor
	var backgroundColor
	if(params.modifiers){
		textColor = params.modifiers[0]
		backgroundColor = params.modifiers[1]
		fontSize = params.modifiers[2]
	}

	if(msg.hasQuotedMsg){
		try{
			const quotedMessage = await msg.getQuotedMessage()
			if(quotedMessage && quotedMessage.body){
				params.texto = quotedMessage.body
			}
		}catch(err){
			simulateTyping(msg,'Ops.. algo deu errado')
		}
	}

	//se não passar size, define o def pra 72
	fontSize = fontSize || "72"
	textColor = textColor || 'black'
	backgroundColor = backgroundColor || 'white'
	// if(backgroundColor === "transparent"){
	// 	backgroundColor = 'rgba(0,0,0,0)'
	// }
	
	var html = "<html>"+ 
    "<head>"+
      "<style>"+
        "body {" +
         " width: 512px;" +
          "height: 512px;" +
        "}" +
      "</style>" +
    "</head>" +
    "<body><div style='display: flex; justify-content: center; align-items: center;  text-align: center; width: 512px;  height: 512px; background-color: "+ backgroundColor+"'>	<span style='vertical-align: middle; line-heigth: normal; color: "+ textColor+"; font-size: "+fontSize+"px;'><b>"+params.texto+"</b>"+
	"</span></div></body>" +
 "</html>"
 simulateTyping(msg,'Um momento...', 1)
	try{
		nodeHtmlToImage({output: './src/config/imgs/tts.png', html: html, transparent: true}).then(()=> {
			const contentFilePath = path.join(__dirname, '/imgs/tts.png')
			client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: true})
		})
	}catch(err){
		simulateTyping(msg,'Ops.. algo deu errado')
	}
	 
}

function getTTSParams(body){
	var comando = body.slice(0,4)
	var texto = body.slice(4)
  
	//se tiver |, usar pra pegar os modifiers
	if(body.indexOf('|')>0){
	  texto = body.slice(4, body.indexOf('|'))
	  var modifiers = body.slice(body.indexOf('|')+2).split(' ')
	}
	
	return {
	  "comando": comando, 
	  "texto": texto,
	  "modifiers": modifiers
	}
}


//manda 1 msg a cada x segundos, durante y iterações minutos (16h)
function checkStatus(msg, segundos, it){

	for (var i=0;i<=it;i++) {
		
		(function(ind) {
			setTimeout(function(){
				if(ind < it){
					randomFact(msg)
					// simulateTyping(msg,'ok')
				}else{
					simulateTyping(msg,'cabô')
				}
			}, 1000 + (segundos * 1000 * ind));
		})(i);
	}
}

function randomDuck(msg, client){
	try{
		const duckReq = {
			method: 'GET',
			uri: 'https://random-d.uk/api/v2/random'
		};
		rp(duckReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.url){
				try{
					download(result.url, client, msg, 'PATO')
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o pato no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o pato no momento')
	}
}

function randomFox(msg, client){
	try{
		const foxReq = {
			method: 'GET',
			uri: 'https://randomfox.ca/floof/'
		};
		rp(foxReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.image){
				try{
					download(result.image, client, msg, 'RAPOSA')
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar a raposa no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar a raposa no momento')
	}
}

function socialsCreate(msg, rede){
	var nomeDaRede = getNomeDaRede(rede)
	
	//Definindo o author da mensagem
	var msgAuthor = getAuthor(msg)

	var handle = getParam(msg)
	handle = handle.replace("@", '')
	//carregando o arquivo com as redes

	const contentFilePath = path.join(__dirname, '/socials.json')
	const socials = load(contentFilePath);
	if(!socials || !socials.contacts){
		simulateTyping(msg,"Não foi possível cadastrar o "+nomeDaRede+" no momento.")
	}
	if(socials && socials.contacts){
		// procura as redes do autor
		var author = socials.contacts.find(contact => contact.id === msgAuthor);
		//nenhuma rede cadastrada
		if(!author){
			var newReg = {
				"id": msgAuthor,
				"ig": null,
				"tt": null,
				"fb": null,
				"tw": null,
				"ln": null,
				"pp": null
			};
			newReg[rede] = handle

			socials.contacts = socials.contacts || []
			socials.contacts.push(newReg)

			save(socials, contentFilePath)

			simulateTyping(msg,nomeDaRede+" cadastrado com sucesso.")
			
		}else if(author && !author[rede]){
			socials.contacts.find(contact => contact.id === msgAuthor)[rede] = handle;
			save(socials, contentFilePath)
			simulateTyping(msg,nomeDaRede+" cadastrado com sucesso.")
		}else{
			simulateTyping(msg,nomeDaRede+" já cadastrado ("+ author[rede]+"). Para alterá-lo, use o comando '@"+rede+"Update | _novoUsuário_'")
		}
	}
}

function socialsUpdate(msg, rede){
	var nomeDaRede = getNomeDaRede(rede)
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	var handle = getParam(msg)
	handle = handle.replace("@", '')
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/socials.json')
	var socials = load(contentFilePath);

	if(!socials || !socials.contacts){
		simulateTyping(msg,"Não foi possível atualizar o usuário do "+ nomeDaRede + " no momento.")
	}

	if(socials && socials.contacts){
		// procura o usuário do author
		var authorSocials = socials.contacts.find(contact => contact.id === author);
		if(!authorSocials){
			simulateTyping(msg,"Você ainda não possui "+nomeDaRede+" cadastrado. Para cadastrar, utilize o comando '@"+rede+"Create | _usuario_'.")
		}else{
			//rede ainda não cadastrada
			if(!authorSocials[rede]){
				simulateTyping(msg,"Você ainda não possui "+nomeDaRede+" cadastrado. Para cadastrar, utilize o comando '@"+rede+"Create | _usuario_'.")
			}else{
				socials.contacts.find(contact => contact.id === author)[rede] = handle;
				save(socials, contentFilePath)
				simulateTyping(msg,nomeDaRede+" atualizado com sucesso.")
			}
		}
	}
}

function socialsDelete(msg, rede){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
	var nomeDaRede = getNomeDaRede(rede)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/socials.json')
	var socials = load(contentFilePath);

	if(!socials || !socials.contacts){
		simulateTyping(msg,nomeDaRede+" não cadastrado.")
	}

	if(socials && socials.contacts){
		// procura o user do author
		var authorSocials = socials.contacts.find(contact => contact.id === author);
		//pix ainda não cadastrado
		if(!authorSocials){
			simulateTyping(msg,"Você não possui "+nomeDaRede+" cadastrado.")
		}else{
			if(!authorSocials[rede]){
				simulateTyping(msg,"Você não possui "+nomeDaRede+" cadastrado.")
			}else{
				socials.contacts.find(contact => contact.id === author)[rede] = null;
				save(socials, contentFilePath)
				simulateTyping(msg,nomeDaRede+" removido com sucesso.")
			}
		}
	}
}

async function socialsAll(msg){
	const chat = await msg.getChat()

	const contentFilePath = path.join(__dirname, '/socials.json')
	var socials = load(contentFilePath);

	if(socials && socials.contacts && socials.contacts.length > 0){
		var participantSocials = socials.contacts.filter(contact => chat.participants.find(CP => CP.id.user === contact.id))
		if(participantSocials && participantSocials.length > 0){
			let text = "";
			let mentions = [];
			participantSocials.forEach(partCode =>{
				//valida se existe alguma rede cadastrada
				if(partCode && (partCode.ig || partCode.tt || partCode.fb || partCode.tw || partCode.ln)){
					let owner = chat.participants && chat.participants.find(part => part.id.user === partCode.id)
					text += `Redes sociais de @${owner.id.user}`+ ":"
					mentions.push(owner)
					if(partCode.ig){
						text += "\nInstagram: instagram.com/"+partCode.ig
					}

					if(partCode.tt){
						text += "\nTwitter: twitter.com/"+partCode.tt
					}

					if(partCode.fb){
						text += "\nFacebook: facebook.com/"+partCode.fb
					}

					if(partCode.tw){
						text += "\nTwitch: twitch.com/"+partCode.tw
					}

					if(partCode.ln){
						text += "\nLinkedIn: linkedin.com/in/"+partCode.ln
					}

					if(partCode.pp){
						text += "\nPicPay: @"+partCode.pp
					}

					text+= "\n\n"
				}else{
					let owner = chat.participants && chat.participants.find(part => part.id.user === partCode.id)
					text += `Redes sociais de @${owner.id.user}`+ ":\nNenhuma cadastrada\n\n"
					mentions.push(owner)
				}
			})
			if(text){
				chat.sendStateTyping()
				var i = getRandomInt(3, true)
				setTimeout(function () {
					chat.clearState()
					chat.sendMessage(text.substring(0, text.length - 2), { mentions });
				}, i*1000);
			}else{
				chat.sendStateTyping()
				var i = getRandomInt(3, true)
				setTimeout(function () {
					chat.clearState()
					chat.sendMessage('Nenhuma rede social cadastrada.');
				}, i*1000);
			}
			
		}else{
			simulateTyping(msg,'Nenhum participante do grupo possui rede social cadastrada')
		}
	}else{
		chat.sendStateTyping()
		var i = getRandomInt(3, true)
		setTimeout(function () {
			chat.clearState()
			chat.sendMessage('Nenhuma rede social cadastrada.');
		}, i*1000);
	}
}

async function printSocials(msg){
	if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
		simulateTyping(msg,'Mencione alguém para saber as redes sociais');
	}else{
		//obtendo participantes do grupo
		const chat = await msg.getChat()

		//carregando o arquivo com os pix's
		const contentFilePath = path.join(__dirname, '/socials.json')
		var socials = load(contentFilePath);

		if(!socials || !socials.contacts){
			simulateTyping(msg,"Não foi possível consultar os usuários no momento.")
		}else{
			let text = "";
			let mentions = [];
			msg.mentionedIds.forEach(id =>{
				var realId = id.slice(0, id.indexOf("@"))
				var contactSocials = socials.contacts.find(code => code.id === realId)
				var mentionedContact = chat.participants && chat.participants.find(part => part.id.user === realId)
				if(contactSocials && (contactSocials.ig || contactSocials.tw || contactSocials.tt || contactSocials.fb || contactSocials.ln)){
					text += `Redes sociais de @${realId}` +":"

					if(contactSocials.ig){
						text +="\nInstagram: instagram.com/"+contactSocials.ig
					}

					if(contactSocials.tt){
						text +="\nTwitter: twitter.com/"+contactSocials.tt
					}

					if(contactSocials.fb){
						text +="\nFacebook: facebook.com/"+contactSocials.fb
					}

					if(contactSocials.tw){
						text +="\nTwitch: twitch.com/"+contactSocials.tw
					}

					if(contactSocials.ln){
						text+= "\nLinkedin: linkedin.com/in/"+contactSocials.ln
					}

					if(contactSocials.pp){
						text+= "\nPicPay: @"+contactSocials.pp
					}

				}else{
					text += `Redes sociais de @${realId}` +":\nNenhuma cadastrada"
				}
				text += "\n\n"
				mentions.push(mentionedContact)
			})
			 
			chat.sendStateTyping()
			var i = getRandomInt(3, true)
			setTimeout(function () {
				chat.clearState()
				chat.sendMessage(text.substring(0, text.length - 2), { mentions });
			}, i*1000);
		}
	}
}

async function printAuthorSocials(msg){
	//Definindo o author da mensagem
	var author = getAuthor(msg)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/socials.json')
	var socials = load(contentFilePath);

	if(!socials || !socials.contacts){
		simulateTyping(msg,"Nenhuma rede social cadastrada.")
	}else{
		// procura as redes do author
		var authorSocials = socials.contacts.find(contact => contact.id === author);

		//código ainda não cadastrado
		if(authorSocials && (authorSocials.tt || authorSocials.ig || authorSocials.fb || authorSocials.tw || authorSocials.ln)){
			var text = "";
			text += "Suas redes sociais são:"

			if(authorSocials.ig){
				text+= "\nInstagram: instagram.com/"+authorSocials.ig
			}

			if(authorSocials.tt){
				text+= "\nTwitter: twitter.com/"+authorSocials.tt
			}

			if(authorSocials.fb){
				text+= "\nFacebook: facebook.com/"+authorSocials.fb
			}

			if(authorSocials.tw){
				text+= "\nTwitch: twitch.com/"+authorSocials.tw
			}

			if(authorSocials.ln){
				text+= "\nLinkedin: linkedin.com/in/"+authorSocials.ln
			}
			
			if(authorSocials.pp){
				text+= "\nPicPay: @"+authorSocials.pp
			}

			simulateTyping(msg,text)
		}else{
			simulateTyping(msg,"Você ainda não possui redes sociais cadastradas. Para cadastrar uma rede, utilize o comando '@menuSocials'")
		}
	}
}

async function printAuthorSocial(msg, rede){
	//Definindo o author da mensagem
	var author = getAuthor(msg)

	var nomeDaRede = getNomeDaRede(rede)
				
	//carregando o arquivo com os pix's
	const contentFilePath = path.join(__dirname, '/socials.json')
	var socials = load(contentFilePath);

	if(!socials || !socials.contacts){
		simulateTyping(msg,"Nenhuma rede social cadastrada.")
	}else{
		// procura a rede do author
		var authorSocials = socials.contacts.find(contact => contact.id === author);

		
		if(authorSocials && authorSocials[rede]){
			var text = ""

			if(rede === "ig"){
				text+= "Instagram: instagram.com/"+authorSocials[rede]
			}

			if(rede === "tt"){
				text+= "Twitter: twitter.com/"+authorSocials[rede]
			}

			if(rede === "fb"){
				text+= "Facebook: facebook.com/"+authorSocials[rede]
			}

			if(rede === "tw"){
				text+= "Twitch: twitch.com/"+authorSocials[rede]
			}

			if(rede === "ln"){
				text+= "Linkedin: linkedin.com/in/"+authorSocials[rede]
			}
			
			if(rede === "pp"){
				text+= "PicPay: @"+authorSocials[rede]
			}

			simulateTyping(msg,text)

		//código ainda não cadastrado
		}else{
			simulateTyping(msg,nomeDaRede+" não cadastrado. Para cadastrar, utilize o comando '@"+rede+"Create.'")
		}
	}
}

function getNomeDaRede(rede){
	switch(rede) {
		case 'ig':
		  	return 'Instagram'
		case 'fb':
		 	return 'Facebook'
		case 'tt':
		  	return 'Twitter'
		case 'tw':
			return 'Twitch'
		case 'ln':
			return 'LinkedIn'
		case 'pp':
			return 'PicPay'	
		default:
			return
	}
}

function randomFact(msg, client){
	try{
		const factReq = {
			method: 'GET',
			uri: 'https://uselessfacts.jsph.pl/random.json?language=en'
		};
		rp(factReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.text){
				try{
					simulateTyping(msg,result.text)
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o fato no momento')
				}
			}else{
				simulateTyping(msg,'Não foi possível buscar o fato no momento')
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o fato no momento')
	}
}

function dogFact(msg, client){
	try{
		const factReq = {
			method: 'GET',
			uri: 'https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?number=1'
		};

		rp(factReq).then(response =>{
			var result = JSON.parse(response)
			if(result[0] && result[0].fact){
				try{
					simulateTyping(msg,result[0].fact)
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o fato no momento')
				}
			}else{
				simulateTyping(msg,'Não foi possível buscar o fato no momento')
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o fato no momento')
	}
}

function randomAxolotl(msg, client){
	try{
		const axReq = {
			method: 'GET',
			uri: 'https://axoltlapi.herokuapp.com/'
		};
		rp(axReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.url && result.facts){
				try{
					download(result.url, client, msg, result.facts)
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o Axolotl no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar a Axolotl no momento')
	}
}

function randomApod(msg, client){
	msg.reply('Um momento...')
	try{
		const apodReq = {
			method: 'GET',
			uri: 'https://api.nasa.gov/planetary/apod?api_key=hEmydgebFdrMXvc1oTqUPkABzUOgbcSb31z8SDFX&count=1'
		};
		rp(apodReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result[0]){
				try{
					var data = result[0].date
					var dataSplit = data.split('-')
					var dataFormatada = dataSplit[2]+"/"+dataSplit[1]+"/"+dataSplit[0]
					download(result[0].url, client, msg, ("*"+result[0].title+" - "+dataFormatada + "*\n" + "*Link:* "+ result[0].hdurl +"\n" +result[0].explanation))
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar a foto no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar a foto no momento')
	}
}

function apod(msg, client){
	msg.reply('Um momento...')
	try{
		const apodReq = {
			method: 'GET',
			uri: 'https://api.nasa.gov/planetary/apod?api_key=hEmydgebFdrMXvc1oTqUPkABzUOgbcSb31z8SDFX'
		};
		rp(apodReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.url){
				try{
					var data = result.date
					var dataSplit = data.split('-')
					var dataFormatada = dataSplit[2]+"/"+dataSplit[1]+"/"+dataSplit[0]
					let text = ("*"+result.title + " - "+dataFormatada + "*\n"+ "*Link:* "+ result.hdurl +"\n" +result.explanation )
					
					download(result.url, client, msg, text)
				
					
				}catch(err){
					console.log(err)
					simulateTyping(msg,'Não foi possível buscar a foto no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar a foto no momento')
	}
}

function dateApod(msg, client){
	msg.reply('Um momento...')
	var data = getParam(msg.body)
	data = formatarDataUS(data)
	try{
		const apodReq = {
			method: 'GET',
			uri: 'https://api.nasa.gov/planetary/apod?api_key=hEmydgebFdrMXvc1oTqUPkABzUOgbcSb31z8SDFX&date='+data
		};
		rp(apodReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.url){
				try{
					var data = result.date
					var dataSplit = data.split('-')
					var dataFormatada = dataSplit[2]+"/"+dataSplit[1]+"/"+dataSplit[0]
					download(result.url, client, msg, ("*"+result.title + " - "+dataFormatada + "*\n"+ "*Link:* "+ result.hdurl +"\n" +result.explanation ))
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar a foto no momento')
				}
			}
			
		}).catch(err =>{
			if(err.statusCode === 400){
				simulateTyping(msg,'Data inválida. A data deve ser entre 16/06/1995 e hoje')
			}else{
				simulateTyping(msg,'Não foi possível buscar a foto no momento')
			}
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar a foto no momento')
	}
}

function formatarDataUS(data){
	data = data.split('/')
	return data[2]+"-"+data[1]+"-"+data[0]
}


function randomCard(msg, client){
	try{
		const cardReq = {
			method: 'GET',
			uri: 'https://deckofcardsapi.com/api/deck/new/draw/?count=1'
		};
		rp(cardReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result.success){
				try{
					download(result.cards[0].image, client, msg, result.facts, true)
				}catch(err){
					simulateTyping(msg,'Não foi possível obter a carta no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível obter a carta no momento')
	}
}

async function truco(msg, client){
	if(!(msg && msg.mentionedIds && msg.mentionedIds.length == 3)){
		simulateTyping(msg,'Marque 3 pessoas para jogar (além de vc)');
	}else{
		const chat = await msg.getChat() 
		chat.sendStateTyping()
		var i = getRandomInt(3, true)
		setTimeout(function () {
			chat.clearState()
			client.sendMessage(msg.from, "Um momento, distribuindo as cartas aos participantes...", {quotedMessageId: msg.id._serialized})
		}, i*1000);
		
		//definindo os participantes: quem mandou a msg + os mencionados na msg
		var participantes = msg.mentionedIds.concat([msg.author])
		
		//monta as cartas do baralho de truco
		var cartasTruco = "AS,AD,AC,AH,2S,2D,2C,2H,3S,3D,3C,3H,4S,4D,4C,4H,5S,5D,5C,5H,6S,6D,6C,6H,7S,7D,7C,7H,JS,JD,JC,JH,QS,QD,QC,QH,KS,KD,KC,KH"
		try{
			const deckReq = {
				method: 'GET',
				uri: 'https://deckofcardsapi.com/api/deck/new/shuffle/?cards='+cartasTruco
			};

			//cria um novo baralho
			rp(deckReq).then(response =>{
				var result = JSON.parse(response)
				try{
					if(result && result.deck_id){
						const cardsReq = {
							method: 'GET',
							uri: 'https://deckofcardsapi.com/api/deck/'+result.deck_id+'/draw/?count=12'
						};

						//tira 12 cartas desse baralho
						rp(cardsReq).then(responseCards =>{
							var handsResult = JSON.parse(responseCards)

							if(handsResult && handsResult.cards && handsResult.cards.length === 12){
								try{

								
									//monta as mãos dos jogadores
									var primeiraMao = [handsResult.cards[0], handsResult.cards[4], handsResult.cards[8]]
									var segundaMao = [handsResult.cards[1], handsResult.cards[5], handsResult.cards[9]]
									var terceiraMao = [handsResult.cards[2], handsResult.cards[6], handsResult.cards[10]]
									var quartaMao = [handsResult.cards[3], handsResult.cards[7], handsResult.cards[11]]

									//envia a mensagem pro jogador 1 + as cartas
									client.sendMessage(participantes[0], "ID da mão: "+handsResult.deck_id)
									primeiraMao.forEach(carta =>{
										download(carta.image, client, msg, null, true, participantes[0])
									})

									//envia a mensagem pro jogador 2 + as cartas
									client.sendMessage(participantes[1], "ID da mão: "+handsResult.deck_id)
									segundaMao.forEach(carta =>{
										download(carta.image, client, msg, null, true, participantes[1])
									})

									//envia a mensagem pro jogador 3 + as cartas
									client.sendMessage(participantes[2], "ID da mão: "+handsResult.deck_id)
									terceiraMao.forEach(carta =>{
										download(carta.image, client, msg, null, true, participantes[2])
									})

									//envia a mensagem pro jogador 4 + as cartas
									client.sendMessage(participantes[3], "ID da mão: "+handsResult.deck_id)
									quartaMao.forEach(carta =>{
										download(carta.image, client, msg, null, true, participantes[3])
									})

								}catch(err){
									simulateTyping(msg,"Ops.. algo deu errado")
								}
							}
						})
					}
				}catch(err){
					simulateTyping(msg,"Ops.. algo deu errado")
				}
			})
		}catch(err){
			simulateTyping(msg,'Ops.. algo deu errado')
		}
	}
}

function imageSearch(msg, client, sendMediaAsSticker, handle){
	var texto
	var qtd
	
	if(msg.body.indexOf("|") !== -1){
		texto = msg.body.substring(handle.length, msg.body.indexOf("|"))
		qtd = msg.body.substring(msg.body.indexOf("|") + 2, msg.body.length).split(' ')[0]
		qtd = parseInt(qtd)
		if(isNaN(qtd)){
			qtd = null
		}else{
			if(qtd > 5 || qtd < 1){
				qtd = 1
			}
		}
	}else{
		texto = getParamWithSpaces(msg, handle)
	}
	// console.log(texto)
	try{
		const imageReq = {
			method: 'GET',
			uri: 'https://imsea.herokuapp.com/api/1?q='+removeSpecialChar(texto).replace(' ', "%20")
		};

		simulateTyping(msg,'Um momento...', 1)
		rp(imageReq).then(response =>{
			// console.log(response)
			var result = JSON.parse(response)
			if(result && result.results && result.results.length > 0){
				var filteredResults = removeDuplicates(result.results)
				if(qtd){
					client.sendMessage(msg.from, "Resultado da busca por '"+texto+"'", {quotedMessageId: msg.id._serialized})
					for(let i = 0; i<qtd; i++){
						try{
							download(filteredResults[i], client, msg, "Imagem "+(i+1), sendMediaAsSticker)
						}catch(err){
							simulateTyping(msg,'Não foi possível obter a imagem no momento')
						}
					}
				}else{
					try{
						// console.log(filteredResults[0], client, msg, "Resultado da busca por '"+result.image_name+"'")
						download(filteredResults[0], client, msg, "Resultado da busca por '"+texto+"'", sendMediaAsSticker)
					}catch(err){
						simulateTyping(msg,'Não foi possível obter a imagem no momento')
					}
				}
				
			}else{
				simulateTyping(msg,'Nenhuma imagem encontrada')
			}
			
		}).catch(err=>{
			simulateTyping(msg,'Não foi possível obter a imagem no momento')
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível obter a imagem no momento')
	}
}

function removeDuplicates(arr){
    var uniqueArray = arr.filter(function(item, pos) {
        return arr.indexOf(item) == pos;
    });
    
    return uniqueArray;
}

function vampetaRussa(msg, client){
	var sorteado = getRandomInt(6)
	if(sorteado === 5){
		for (let i = 1; i<=6; i++){
			const contentFilePath = path.join(__dirname, '/imgs/vpt'+i+'.jpg')
			client.sendMessage(msg.from, MessageMedia.fromFilePath(contentFilePath), {quotedMessageId: msg.id._serialized, sendMediaAsSticker: false})
		}
	}else{
		var opcoes = ['dog', 'cat', 'duck', 'fox']
		var randomPick = opcoes.sort(function() { return .5 - Math.random() }).slice(0, 1) // Shuffles array and picks first item
		switch(randomPick[0]) {
			case 'dog':
			  randomDog(msg, client)
			  break;
			case 'cat':
			  randomCat(msg, client)
			  break;
			case 'fox':
			  randomFox(msg, client)
			  break;
			case 'duck':
			  randomDuck(msg, client)
			  break;
			default:
			  // code block
		}

	}
}

async function amigoOculto(msg, client, all){
	var lista
	var author = getAuthor(msg)
	const chat = await msg.getChat()
	const sender = await msg.getContact()
	// console.log(msg)
	if(all){
		const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)
		if(adminParticipants && adminParticipants.find(p => p === sender.id.user)){
			lista = chat.participants.filter(part => part.id.user !== BOT)
			if(lista.length < 2){
				simulateTyping(msg,'Número de participantes insuficiente');
			}
		}else{
			simulateTyping(msg,'Apenas admins podem usar esse comando');
		}
	}else{
		if(!(msg && msg.mentionedIds && msg.mentionedIds.length > 0)){
			simulateTyping(msg,'Mencione pelo menos uma pessoa para participar do sorteio');
		}else{
			// console.log(chat.participants)
			lista = chat.participants.filter(part => msg.mentionedIds.find(id => part.id._serialized === id))
			lista.push(chat.participants.find(part => part.id.user === author))
		}
	}

	if(lista){
		var shuffledList = lista.sort(function() { return .5 - Math.random() })
		// console.log(chat.participants)
		var pares = []
		for(let i=0; i<shuffledList.length; i++){
			var j = i+1
			if(j === lista.length){
				j = 0
			}
			var par = {
				"pessoa": shuffledList[i],
				"sorteado": shuffledList[j]
			}
			pares.push(par)
		}
		if(pares && pares.length > 1){
			pares.forEach(par =>{
				var texto = `Seu amigo oculto é: @${par.sorteado.id.user}`
				var mentions = [par.sorteado] 
				client.sendMessage(par.pessoa.id._serialized, texto, {mentions})
			})
		}
	}

}

function getContactFromVCard(VCards){
	var contatos = []
	VCards.forEach(V=>{
	  var msg = V.slice(V.indexOf('waid=')+'waid='.length)
	  msg = msg.slice(0, msg.indexOf(':'))
	  contatos.push(msg+'@c.us')
	})
  
	return contatos
}

async function simulateTyping(msg, text, param){
	var mult = param || 3
	const chat = await msg.getChat() 

	await chat.sendStateTyping()
	var i = getRandomInt(mult, true)
	setTimeout(function () {
		chat.clearState()
		msg.reply(text)
	}, i*1000);
}

function removeSpecialChar (string){
	return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");;
}

function randomShibe(msg, client){
	try{
		const shibeReq = {
			method: 'GET',
			uri: 'https://shibe.online/api/shibes?count=1'
		};
		rp(shibeReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result[0]){
				const replies = ["Wow, much dog", "Very floof", 'Such Wow', 'Much woof']
				try{
					download(result[0], client, msg, replies[getRandomInt(4)])
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o shiba no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o shiba no momento')
	}
}

function randomBirb(msg, client){
	try{
		const shibeReq = {
			method: 'GET',
			uri: 'https://shibe.online/api/birds?count=1'
		};
		rp(shibeReq).then(response =>{
			var result = JSON.parse(response)
			if(result && result[0]){
				try{
					download(result[0], client, msg, 'Birb')
				}catch(err){
					simulateTyping(msg,'Não foi possível buscar o pássaro no momento')
				}
			}
			
		})
	}catch(err){
		simulateTyping(msg,'Não foi possível buscar o pássaro no momento')
	}
}

function numberTrivia(msg, client){
	var number = getParam(msg)
	if(isNaN(number)){
		simulateTyping(msg,'Número inválido')
	}else{
		try{
			const numberReq = {
				method: 'GET',
				uri: 'http://numbersapi.com/'+number
			};
			rp(numberReq).then(response =>{
				if(response){
					try{
						simulateTyping(msg,response)
					}catch(err){
						simulateTyping(msg,'Não foi possível buscar o fato no momento')
					}
				}
			})
		}catch(err){
			simulateTyping(msg,'Não foi possível buscar o fato no momento')
		}
	}
}

async function isFromAdminAndBotIsAdmin(msg, inputChat){
	const sender = await msg.getContact()
	const chat = inputChat || await msg.getChat()
	if(chat.isGroup){
		const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)

		if(adminParticipants && adminParticipants.find(p => p === sender.id.user) && adminParticipants.find(p => p === BOT)){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}

async function isFromAdmin(msg, inputChat){
	const sender = await msg.getContact()
	const chat = inputChat || await msg.getChat()
	if(chat.isGroup){
		const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)
		if(adminParticipants && adminParticipants.find(p => p === sender.id.user)){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}

async function isFromSUDO(msg, inputChat){
	const sender = await msg.getContact()
	const chat = inputChat || await msg.getChat()
	if(chat.isGroup){
		const superAdminParticipants = chat.participants.filter(p => p.isSuperAdmin).map(p => p.id && p.id.user)

		if(superAdminParticipants && superAdminParticipants.find(p => p === sender.id.user)){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}

async function botIsAdmin(msg, inputChat){
	const sender = await msg.getContact()
	const chat = inputChat || await msg.getChat()
	if(chat.isGroup){
		const adminParticipants = chat.participants.filter(p => p.isAdmin).map(p => p.id && p.id.user)

		if(adminParticipants && adminParticipants.find(p => p === BOT)){
			return true
		}else{
			return false
		}
	}else{
		return false
	}
}

async function roletaRussa(msg){
	var sorteado = getRandomInt(6)
	var isFromSuperAdmin = await isFromSUDO(msg)
	if(!isFromSuperAdmin){
		if(sorteado === 5){
			const chat = await msg.getChat()
			msg.reply("You're fired!")
			const author = await msg.getContact()
			await chat.removeParticipants([author.id._serialized])
		}else{
			const replies = ["Nada acontece, feijoada", "Não foi dessa vez", 'Quase....', 'Cagou demais', 'Da próxima vai']
			simulateTyping(msg, replies[getRandomInt(5)])
		}
	}else{
		simulateTyping(msg, 'Eu até gostaria de te kickar, mas você é o criador do grupo, o que me impede de fazer isso :(')
	}
}

async function russianRoulette(msg){
	var sorteado = getRandomInt(6)
	var isFromSuperAdmin = await isFromSUDO(msg)
	if(!isFromSuperAdmin){
		if(sorteado === 5){
			const chat = await msg.getChat()
			msg.reply("You're fired!")
			const author = await msg.getContact()
			await chat.removeParticipants([author.id._serialized])
		}else{
			const replies = ["Nothing happens", "You got lucky", 'So close....', "I'll try harder next time", 'Not this time']
			simulateTyping(msg, replies[getRandomInt(5)])
		}
	}else{
		simulateTyping(msg, "I couldnt kick you if I wanted since you created the group =/")
	}
}

async function allowAllAdd(msg, inputChat){
	//Definindo o author da mensagem
	const chat = inputChat || await msg.getChat()

	var param = msg.body.split(' ')[1]
	if(param.toLowerCase() === 'on'){
		param = true
	}else if(param.toLowerCase() === 'off'){
		param = false
	}

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			var thisGroupSettings = {
				"id": chat.id.user,
				"settings":{"allowAllAdd": param}
			}

			groupSettings.groups = groupSettings.groups || []
			groupSettings.groups.push(thisGroupSettings)

			save(groupSettings, contentFilePath)

			var frase
			if(param){
				frase = "Qualquer pessoa pode adicionar contatos através do comando @add."
			}else{
				frase = "Apenas administradores podem utilizar o comando @add."
			}
			simulateTyping(msg,"Operaçao realizada. "+ frase)
			
		}else{
			groupSettings.groups.find(group => group.id === chat.id.user).settings.allowAllAdd = param
			
			save(groupSettings, contentFilePath)

			var frase
			if(param){
				frase = "Qualquer pessoa pode adicionar contatos através do comando @add."
			}else{
				frase = "Apenas administradores podem utilizar o comando @add."
			}
			simulateTyping(msg,"Operaçao realizada. "+ frase)
		}
	}
}

async function setBlockTaPagoSemFoto(msg, inputChat){
	//Definindo o author da mensagem
	const chat = inputChat || await msg.getChat()

	var param = msg.body.split(' ')[1]
	if(param.toLowerCase() === 'on'){
		param = true
	}else if(param.toLowerCase() === 'off'){
		param = false
	}

	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		simulateTyping(msg,"Não foi possível realizar a operaçao no momento.")
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		// console.log(group)
		//grupo ainda não cadastrado
		if(!group){
			var thisGroupSettings = {
				"id": chat.id.user,
				"settings":{"blockTaPagoSemFoto": param}
			}

			groupSettings.groups = groupSettings.groups || []
			groupSettings.groups.push(thisGroupSettings)

			save(groupSettings, contentFilePath)

			var frase
			if(param){
				frase = "Apenas tá pago's com fotos serão registrados."
			}else{
				frase = "Tá pago's sem fotos serão aceitos."
			}
			simulateTyping(msg,"Operaçao realizada. "+ frase)
			
		}else{
			groupSettings.groups.find(group => group.id === chat.id.user).settings.blockTaPagoSemFoto = param
			
			save(groupSettings, contentFilePath)

			var frase
			if(param){
				frase = "Apenas tá pago's com fotos serão registrados."
			}else{
				frase = "Tá pago's sem fotos serão aceitos."
			}
			simulateTyping(msg,"Operaçao realizada. "+ frase)
		}
	}
}

async function blockTaPagoSemFoto(msg, inputChat){
	//Definindo o author da mensagem
	const chat = inputChat || await msg.getChat()


	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		return false
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);

		return group && group.settings && group.settings.blockTaPagoSemFoto;
	}
}

async function canAllAdd(msg, inputChat){
	//Definindo o author da mensagem
	const chat = inputChat || await msg.getChat()


	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/group_settings.json')
	const groupSettings = load(contentFilePath);
	if(!groupSettings || !groupSettings.groups){
		return false
	}
	if(groupSettings && groupSettings.groups){
		// procura as configuraçoes do grupo em questao
		var group = groupSettings.groups.find(group => group.id === chat.id.user);
		//grupo ainda não cadastrado
		if(!group){
			return false
		}else{
			return group.settings.allowAllAdd
		}
	}
}

function createUserSettings(author){
	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const userSettings = load(contentFilePath);
	if(!userSettings || !userSettings.contacts){
		console.log("Não foi possível realizar a operação no momento.")
	}
	if(userSettings && userSettings.contacts){
		// procura as redes do autor
		var authorSettings = userSettings.contacts.find(contact => contact.id === author);
		//nenhuma rede cadastrada
		if(!authorSettings){
			var newReg = {
				"id": author
			};

			userSettings.contacts = userSettings.contacts || []
			userSettings.contacts.push(newReg)

			save(userSettings, contentFilePath)
		}
	}
}

function addUserSettings(msg, setting, param, allowDuplicates){
	var newReg = param || getParam(msg).toLowerCase()
	var author = getAuthor(msg)

	createUserSettings(author)
	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const userSettings = load(contentFilePath);
	if(!userSettings || !userSettings.contacts){
		console.log("Não foi possível realizar a operação no momento.")
	}
	if(userSettings && userSettings.contacts){
		// procura as redes do autor
		var authorSettings = userSettings.contacts.find(contact => contact.id === author);
		//nenhuma rede cadastrada
		if(!authorSettings){
			simulateTyping(msg,"Não foi possível fazer o cadastro no momento.")
			
		}else{
			var newSetting = authorSettings[setting] || []
			if(!allowDuplicates && newSetting.find(set => set.toLowerCase() === newReg)){
				simulateTyping(msg, "Item já adicionado.")
			}else{
				newSetting.push(newReg)
				userSettings.contacts.find(contact => contact.id === author)[setting] = newSetting;
				save(userSettings, contentFilePath)
				simulateTyping(msg, "Registro adicionado com sucesso.")
			}
			
		}
	}
}

function removeUserSettings(msg, setting){
	var newReg = getParam(msg).toLowerCase()
	var author = getAuthor(msg)

	createUserSettings(author)
	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const userSettings = load(contentFilePath);
	if(!userSettings || !userSettings.contacts){
		console.log("Não foi possível realizar a operação no momento.")
	}
	if(userSettings && userSettings.contacts){
		// procura as redes do autor
		var authorSettings = JSON.parse(JSON.stringify(userSettings.contacts.find(contact => contact.id === author)));
		//nenhuma rede cadastrada
		if(!(authorSettings && authorSettings[setting] && authorSettings[setting].length > 0)){
			simulateTyping(msg, "Nenhum item cadastrado.")
			
		}else{
			authorSettings[setting] = authorSettings[setting].filter(set => set.toLowerCase() !== newReg)
			userSettings.contacts.find(contact => contact.id === author)[setting] = authorSettings[setting]
			save(userSettings, contentFilePath)
			simulateTyping(msg, "Item removido ou não encontrado.")
		}
	}
}

function getSettings(msg, setting){
	var author = getAuthor(msg)

	createUserSettings(author)
	//carregando o arquivo com as configs
	const contentFilePath = path.join(__dirname, '/user_settings.json')
	const userSettings = load(contentFilePath);
	
	return userSettings && userSettings.contacts && userSettings.contacts.find(contact => contact.id === author)[setting]
}

function sendMessage(chat){
	chat.sendMessage('teste')
}

function authorIsOwner(msg){
	return getAuthor(msg) === PEP
}

function isURL(str) {
	const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  	return pattern.test(str);
}

 
const getDavinciResponse = async (clientText, keys) => {
    const options = {
        model: "text-davinci-003", // Modelo GPT a ser usado
        prompt: clientText, // Texto enviado pelo usuário
        temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
        max_tokens: 4000 // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
    }

	let configuration = new Configuration({
		organization: keys.orgId,
		apiKey: keys.key,
	});

	let openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createCompletion(options)
        let botResponse = ""
        response.data.choices.forEach(({ text }) => {
            botResponse += text
        })
        return `Chat GPT 🤖\n\n ${botResponse.trim()}`
    } catch (e) {
        return `Ops.. algo deu errado. ❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
}

const getDalleResponse = async (clientText, keys) => {
    const options = {
        prompt: clientText, // Descrição da imagem
        n: 1, // Número de imagens a serem geradas
        size: '256x256', // Tamanho da imagem
    }

	let configuration = new Configuration({
		organization: keys.orgId,
		apiKey: keys.key,
	});

	let openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createImage(options);
        return response.data.data[0].url
    } catch (e) {
        return `Ops.. algo deu errado. ❌ OpenAI Response Error: ${e.response.data.error.message}`
    }
}


//TODO

// function updateUserSettings(msg, setting){

// 	var newReg = getParam(msg)
// 	var author = getAuthor(msg)

// 	createUserSettings(author)
// 	//carregando o arquivo com as configs
// 	const contentFilePath = path.join(__dirname, '/user_settings.json')
// 	const userSettings = load(contentFilePath);
// 	if(!userSettings || !userSettings.contacts){
// 		console.log("Não foi possível realizar a operação no momento.")
// 	}
// 	if(userSettings && userSettings.contacts){
// 		// procura as redes do autor
// 		var authorSettings = JSON.parse(JSON.stringify(userSettings.contacts.find(contact => contact.id === author)));
// 		//nenhuma rede cadastrada
// 		if(!(authorSettings && authorSettings[setting])){
// 			simulateTyping(msg, "Não foi possível realizar a operação no momento.")
// 		}else{
// 			authorSettings[setting] = authorSettings[setting].filter(set => set !== newReg)
// 			userSettings.contacts.find(contact => contact.id === author)[setting] = authorSettings[setting]
// 			save(userSettings, contentFilePath)
// 			simulateTyping(msg, "Item removido ou não encontrado.")
// 		}
// 	}
// }

// function setUserSettings(msg, setting){

// 	var newReg = getParam(msg)
// 	var author = getAuthor(msg)

// 	createUserSettings(author)
// 	//carregando o arquivo com as configs
// 	const contentFilePath = path.join(__dirname, '/user_settings.json')
// 	const userSettings = load(contentFilePath);
// 	if(!userSettings || !userSettings.contacts){
// 		console.log("Não foi possível realizar a operação no momento.")
// 	}
// 	if(userSettings && userSettings.contacts){
// 		// procura as redes do autor
// 		var authorSettings = JSON.parse(JSON.stringify(userSettings.contacts.find(contact => contact.id === author)));
// 		//nenhuma rede cadastrada
// 		if(!(authorSettings && authorSettings[setting])){
// 			simulateTyping(msg, "Não foi possível realizar a operação no momento.")
// 		}else{
// 			authorSettings[setting] = authorSettings[setting].filter(set => set !== newReg)
// 			userSettings.contacts.find(contact => contact.id === author)[setting] = authorSettings[setting]
// 			save(userSettings, contentFilePath)
// 			simulateTyping(msg, "Item removido ou não encontrado.")
// 		}
// 	}
// }