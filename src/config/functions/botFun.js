//funções misc/fun
const dotenv = require('dotenv');
const SupportFunctions = require('./supportFunctions.js');
const supportFunctions = require('./supportFunctions.js');
dotenv.config()

module.exports = {
	reply: async function (msg, client){	
		const toLowerBody = msg.body.toLowerCase();

		//confere triggers
		validateTrigger(msg, client)

		if(toLowerBody === '@bom dia' || toLowerBody === '@bomdia'){
			SupportFunctions.sendBomDia(msg, client)
		}

		//valida se algum trigger de gerador de nome foi disparado pela msg
		let geradorSettings = SupportFunctions.validateNameGeneratorTrigger(toLowerBody)
		if(geradorSettings){
			gerarNome(msg, geradorSettings)
		}

		//manda o menu dos geradores
		if(toLowerBody === "@gerador" || toLowerBody === "@geradores"){
			await gerarNome(msg)
		}
    }
};


//função que confere se a mensagem contém alguma trigger configurada pro bot e responde caso haja
async function validateTrigger(msg, client){
	//busca a lista de triggers
	let triggers = SupportFunctions.getTriggers()

	//define o corpo da mensagem
	let toLowerBody = msg.body.toLowerCase()

	//filtra os triggers que estiverem contidos no corpo
	let respostas = triggers.filter(trigger => trigger.expressao.find(exp => toLowerBody.includes(exp))).map(trigger => trigger.resposta)

	//pra cada um, responde
	respostas.forEach(resp => {
		// SupportFunctions.answerTrigger?
		SupportFunctions.sendMessage(client, msg, resp, null, null, SupportFunctions.getMsgId(msg))
	});

}


//gera um nome de acordo com as configurações
async function gerarNome(msg, settings){
	SupportFunctions.count(`gerador${(settings && settings.NOME) || ''}`)
	//se tiver settings, manda o nome gerado
	if(settings){
		//monta a resposta com um nome aleatório de cada opção
		let response = `Seu nome de ${settings.NOME} é ${settings.OPTIONS.map(opt => opt[SupportFunctions.getRandomInt(opt.length)]).join(' ')}`
		SupportFunctions.simulateTyping(msg, response, null, null, null, true)

		//reage à msg
		supportFunctions.addMsgReaction(msg, settings.EMOJI)
	//se não tiver, manda o menu dos geradors	
	}else{
		let response = `Digite o comando correspondente para descobrir o seu nome: \n`
		let settings = SupportFunctions.getBotSettings().NAME_GENERATORS
		if(settings && settings.length > 0){
			response += settings.map(sett =>{
				return `\n${sett.EMOJI} ${sett.TRIGGERS[0]}: ${sett.DESC}`
			}).join('')

			SupportFunctions.simulateTyping(msg, response, null, null, null, true)
		}
	}

	//busca os dados da mensgem (autor, chat, etc)
	const data = await SupportFunctions.getMsgData(msg)
	SupportFunctions.checkUserBotUsage(data)
}