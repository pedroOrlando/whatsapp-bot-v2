//funções utilitárias
const dotenv = require('dotenv');
// const rp = require('request-promise');
const SupportFunctions = require('./supportFunctions.js');
const supportFunctions = require('./supportFunctions.js');
// const { rastrearEncomendas } = require('correios-brasil/dist/index.js');
const { rastrearEncomendas } = require('correios-brasil');
// const request = require('request').defaults({encoding: null})
// const fetch = require('node-fetch')
// const nodeHtmlToImage = require('node-html-to-image')
// const { MessageMedia } = require('whatsapp-web.js');
// const path = require('path');
// const fs = require('fs')
// const { clear } = require('console');
// const { sort } = require('shelljs');
// const { spawn } = require('child_process');
dotenv.config()

module.exports = {
	reply: async function (msg, client) {
		const toLowerBody = msg.body.toLowerCase();
		
		//manda um cachorro aleatório
		if(['@dog', "@doguinho", "@cachorro", "@catchurro"].includes(toLowerBody)){
			await randomDog(msg, client)
		}

		//manda um pato aleatório
		if(['@pato'].includes(toLowerBody)){
			await randomDuck(msg, client)
		}

		//manda um gato aleatório
		if(['@gato', "@gatinho", "@gatinhu", "@cat"].includes(toLowerBody)){
			await randomCat(msg, client)
		}

		//busca informações de um filme
		if(toLowerBody.indexOf('@filme ') == 0){
			await movieDBSearch(msg, client, "movieApi")
		}

		//busca informações de uma série
		if(toLowerBody.indexOf('@serie ') == 0 || toLowerBody.indexOf('@série ') == 0){
			await movieDBSearch(msg, client, "tvShowApi")
		}

		//busca imagens da nasa
		if(toLowerBody.indexOf('@apod') == 0){
			await apodSearch(msg, client, toLowerBody)
		}

		//rastreio de encomendas no correio
		if(toLowerBody.indexOf('@rastreio') === 0){
			rastreioCorreio(msg)
		}
	}
};

//rastreia encomenda nos correios
async function rastreioCorreio(msg){

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)

	//adiciona à contagem
	SupportFunctions.count('rastreioCorreios')
	
	//carrega os códigos do usuário
	let userCodes = SupportFunctions.getUserKey(data.sender, 'trackingCodes')
	if(!userCodes){
		userCodes = []
	}
	
	//flag que vai indicar se o comando foi disparado para rastrear todos os códigos do usuário, ou um código avulso na mensagem
	let controlUserCodes = true
	if(msg.body.toLowerCase() === '@rastreio'){
		controlUserCodes = false
	}

	//montando o código
	let codRastreio = controlUserCodes ? msg.body.split(' ').filter(code => code !== "").splice(1).map(codigos => codigos.toUpperCase()) : userCodes

	//se o usuário não tiver código cadastrado
	if(!controlUserCodes && !(codRastreio && codRastreio.length > 0)){
		SupportFunctions.simulateTyping(msg,"Você não possui código de rastreio cadastrado. Para cadastrar, utilize o comando _@menuRastreio_")
		return;
	}

	await SupportFunctions.simulateTyping(msg, 'Um momento...', 1)

	//chamando o método e montando a resposta
	rastrearEncomendas(codRastreio).then((response) => {
		if(response&& response.length){
			let messagesToSend = []
			if(!controlUserCodes){
				messagesToSend.push({text: "Seus códigos de rastreio cadastrados: "+codRastreio.join(', ')})
			}

			for (var j = 0; j < response.length;  j++) {
				let currentCode = codRastreio[j]
				var mensagem = "*Atualizações do rastreio "+currentCode+"*: "
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

					//adicionar se n tiver, excluir se tiver entregue
					let foundInUser = userCodes.includes(currentCode)
					let entregue = mensagem.indexOf('Objeto entregue ao destinatário') !== -1
					
					//se o código já tiver salvo nas configurações do usuário
					if(foundInUser){
						//se já tiver sido entregue, remover das configurações
						if(entregue){
							//remove o código já entregue
							userCodes = userCodes.filter(code => code !== currentCode)
							
							//atualiza a mensagem com o aviso
							mensagem = `*O código ${currentCode} foi entregue e foi removido da sua lista de códigos. Utilize _@menuRastreio_ para mais informações* \n\n ${mensagem}` 
						}else{
							if(controlUserCodes){
								//avisa que o código já tá cadastrado
								mensagem = `*O código ${currentCode} já está cadastrado na sua lista de códigos. Caso queira rastrear todos de uma vez, utilize o comando _@rastreio_ ou utilize _@menuRastreio_ para mais informações* \n\n ${mensagem}` 
							}
						}
					//caso o usuário esteja rastreando um código que não está na sua lista. esse cenário só vai acontecer se o controlUserCodes === true
					}else{
						//caso ainda não tenha sido entregue
						if(!entregue){
							userCodes.push(currentCode)
							mensagem = `*O código ${currentCode} foi adicionado à sua lista de códigos. Para rastrear todos de uma vez, utilize o comando _@rastreio_ ou utilize _@menuRastreio_ para mais informações* \n\n ${mensagem}` 
						}
					}


					//atualiza a lista de códigos do usuário
					//busca as configurações do usuário
					let userSettings = SupportFunctions.loadUserData(data.sender.id, data.sender.contact)
					
					//inicia a configuração de chaves, caso não haja
					userSettings.keySettings = userSettings.keySettings || {}

					//atualiza os valores
					userSettings.keySettings['trackingCodes'] = userCodes

					//salva as configurações
					SupportFunctions.saveUserSettings(userSettings, data.sender.id, data.sender.contact)

				}else{
					mensagem += "\n*Código de rastreio não encontrado.*"
				}

				//encadeia a mensagem para enviar sequencialmente
				messagesToSend.push({text: mensagem})
				
			}

			//envia todas as mensagens sequenciais
			SupportFunctions.sendSequentialMessages(msg, messagesToSend, true)

			//adicionando à contagem de uso pra mandar a msg do pix
			SupportFunctions.checkUserBotUsage(data)
			
		}else{
			SupportFunctions.simulateTyping(msg,"Não foi possível fazer a busca no momento.")
		}

	});
}


//busca uma imagem apod da nasa
async function apodSearch(msg, client, toLowerBody){
	let apiKey = process.env.NASA_API_KEY;

	if(!apiKey){
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		
		SupportFunctions.simulateTyping(msg, 'Chave de api não configurada.')
		return
	}

	await SupportFunctions.simulateTyping(msg, 'Um momento...', 1)

	//define o tipo de busca: apod, apod random ou apod data
	let type, sufix
	if(toLowerBody === "@apod"){
		type = 'todayApod'
		sufix = ''
	}else if(toLowerBody === "@apod random"){
		type = 'randomApod'
		sufix = '&count=1'
	}else{
		type = 'dateApod'
		let dateParam = toLowerBody.split(' ').filter(split => split !== '')[1]
		if(!SupportFunctions.validateDateString(dateParam)){
			SupportFunctions.addErrorReaction(msg)

			SupportFunctions.simulateTyping(msg, 'Formato de data deve seguir o padrão dd/mm/aaaa')
			return
		}

		sufix = '&date='+dateParam.split('/').reverse().join('-')
	}

	//adicionando à contagem
	SupportFunctions.count(type)
	
	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	try{
		//define os parâmetros da chamada da API
		const apodReq = {
			method: 'GET',
			uri: `https://api.nasa.gov/planetary/apod?api_key=${apiKey}${sufix}`
		};
		
		//faz a chamada e recebe o resultado
		let response = await SupportFunctions.callApi(apodReq)

		//a api de random apod retorna um array
		if(type === 'randomApod'){
			response = response[0]
		}

		//monta a resposta
		let textResponse = `*${response.title} - ${response.date.split('-').reverse().join('/')}*`
		textResponse += `\nLink: ${response.hdurl}`
		textResponse += `\n\nLegenda: ${response.explanation}`

		//baixa a imagem e envia
		await SupportFunctions.downloadFromURLAndSend(response.url, msg, client, textResponse, false, null, '🌠')
		
		//adicionando à contagem de uso pra mandar a msg do pix
		SupportFunctions.checkUserBotUsage(data)
	}catch(err){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg,'Não foi possível buscar a imagem no momento')
	}
}

//busca informações de um filme ou de uma série
async function movieDBSearch(msg, client, type){
	let apiKey = process.env.MOVIE_DB_KEY;

	if(!apiKey){
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		
		SupportFunctions.simulateTyping(msg, 'Chave de api não configurada.')
		return
	}

	await SupportFunctions.simulateTyping(msg, 'Um momento...', 1)

	//adicionando à contagem
	SupportFunctions.count(type)
	
	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	try{
		//o nome do filme/serie é tudo que tiver depois de '@filme ' ou '@serie '
		let searchName = msg.body.substring(7)

		//define os parâmetros da chamada da API 
		let contentName = type === 'movieApi' ? 'movie' : 'tv'
		const contentRequest = {
			method: 'GET',
			uri: `https://api.themoviedb.org/3/search/${contentName}?api_key=${apiKey}&language=pt-BR&query=${searchName}`
		};
		
		//faz a chamada e recebe o resultado
		let response = await SupportFunctions.callApi(contentRequest)

		//define os parâmetros da chamada da API de generos
		const genreRequest = {
			method: 'GET',
			uri: `https://api.themoviedb.org/3/genre/${contentName}/list?api_key=${apiKey}&language=pt-BR`
		};

		//busca a lista de generos para montar a resposta
		let genres = await SupportFunctions.callApi(genreRequest)

		//pega o primeiro resultado
		let movieInfo = response.results[0]

		//obtem os valores de acordo com o tipo de conteudo
		if(contentName === 'movie'){
			movieInfo.titulo = movieInfo.title
			movieInfo.notaMedia = movieInfo.vote_average.toFixed(1)
			movieInfo.tituloOriginal = movieInfo.original_title

			//formata a data (aaaa-mm-dd -> dd/mm/aaaa)
			movieInfo.dataLancamento = movieInfo.release_date.split('-').reverse().join('/')
			movieInfo.sinopse = movieInfo.overview
		}else{
			movieInfo.titulo = movieInfo.name
			movieInfo.notaMedia = movieInfo.vote_average.toFixed(1)
			movieInfo.tituloOriginal = movieInfo.original_name
			
			//formata a data (aaaa-mm-dd -> dd/mm/aaaa)
			movieInfo.dataLancamento = movieInfo.first_air_date.split('-').reverse().join('/')
			movieInfo.sinopse = movieInfo.overview
		}

		
		//transforma os ids dos generos em nomes
		movieInfo.genres = movieInfo.genre_ids.map(id => genres && genres.genres && genres.genres.find(genreList => genreList.id === id)).map(foundGenre => foundGenre.name)

		//monta a resposta para enviar 
		let msgResponse = ""
		msgResponse += "*Título*: "+ movieInfo.titulo
		msgResponse += "\n*Nota média*: "+ movieInfo.notaMedia
		msgResponse += "\n*Título original*: "+ movieInfo.tituloOriginal
		msgResponse += "\n*Lançamento*: "+ movieInfo.dataLancamento
		msgResponse += "\n*Gênero*: "+ movieInfo.genres.join(', ')
		msgResponse += "\n\n*Sinopse*: "+ movieInfo.sinopse
		let imgUrl = "https://www.themoviedb.org/t/p/original"+ movieInfo.poster_path

		//baixa a imagem e envia
		await SupportFunctions.downloadFromURLAndSend(imgUrl, msg, client, msgResponse, false, null, '🎥')
		
		//adicionando à contagem de uso pra mandar a msg do pix
		SupportFunctions.checkUserBotUsage(data)
	}catch(err){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg,'Não foi possível buscar os dados do conteúdo no momento')
	}
}

//busca um gato aleatório na API e envia o resultado
async function randomCat(msg, client){
	let apiKey = process.env.CAT_API_KEY;

	if(!apiKey){
		//reage à msg
		SupportFunctions.addErrorReaction(msg)
		
		SupportFunctions.simulateTyping(msg, 'Chave de api não configurada.')
		return
	}

	await SupportFunctions.simulateTyping(msg, 'Um momento...', 1)

	//adicionando à contagem
	SupportFunctions.count('catApi')
	
	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	try{
		//define os parâmetros da chamada da API
		const catReq = {
			method: 'GET',
			uri: `https://api.thecatapi.com/v1/images/search?api_key=${apiKey}`
		};
		
		//faz a chamada e recebe o resultado
		let response = await SupportFunctions.callApi(catReq)


		//monta as opções de resposta
		let captionOptions = ['gato!', 'miau!', '🐈']

		//baixa a imagem e envia
		await SupportFunctions.downloadFromURLAndSend(response[0].url, msg, client, captionOptions[SupportFunctions.getRandomInt(3)], false, null, '🐈')
		
		//adicionando à contagem de uso pra mandar a msg do pix
		SupportFunctions.checkUserBotUsage(data)
	}catch(err){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg,'Não foi possível buscar o gato no momento')
	}
}

//busca um pato aleatório na API e envia o resultado
async function randomDuck(msg, client){
	await SupportFunctions.simulateTyping(msg, 'Um momento...', 1)

	//adicionando à contagem
	SupportFunctions.count('duckApi')
	
	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	try{
		//define os parâmetros da chamada da API
		const duckReq = {
			method: 'GET',
			uri: 'https://random-d.uk/api/v2/random'
		};
		
		//faz a chamada e recebe o resultado
		let response = await SupportFunctions.callApi(duckReq)

		//monta as opções de resposta
		let captionOptions = ['pato!', 'quáck!', '🦆']

		//baixa a imagem e envia
		await SupportFunctions.downloadFromURLAndSend(response.url, msg, client, captionOptions[SupportFunctions.getRandomInt(3)], false, null, '🦆')
		
		//adicionando à contagem de uso pra mandar a msg do pix
		SupportFunctions.checkUserBotUsage(data)
	}catch(err){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg,'Não foi possível buscar o pato no momento')
	}
}

//busca um cachorro aleatório na API e envia o resultado
async function randomDog(msg, client){
	await SupportFunctions.simulateTyping(msg, 'Um momento...', 1)

	//adicionando à contagem
	SupportFunctions.count('dogApi')
	
	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	try{
		//define os parâmetros da chamada da API
		const dogRequest = {
			method: 'GET',
			uri: 'https://dog.ceo/api/breeds/image/random'
		};
		
		//faz a chamada e recebe o resultado
		let response = await SupportFunctions.callApi(dogRequest)

		//monta as opções de resposta
		let captionOptions = ['doguinho!', 'catchurro!', '🐶']

		//baixa a imagem e envia
		await SupportFunctions.downloadFromURLAndSend(response.message, msg, client, captionOptions[SupportFunctions.getRandomInt(3)], false, null, '🐶')
		
		//adicionando à contagem de uso pra mandar a msg do pix
		SupportFunctions.checkUserBotUsage(data)
	}catch(err){
		SupportFunctions.addErrorReaction(msg)
		SupportFunctions.simulateTyping(msg,'Não foi possível buscar o cachorro no momento')
	}
}

