const client = require("./config/client")
const functions = require ("./config/functionsnew.js")
const fs = require('fs')
const path = require('path');
const rp = require('request-promise');

//temp
const BLACKLIST = ['553185790682', '553899415362', '558879775754', '553888276294']
const PEP = '553891354666'
// Repositório oficial: https://github.com/pedroslopez/whatsapp-web.js
// Exemplo de comandos da própria lib: https://github.com/pedroslopez/whatsapp-web.js/blob/main/example.js
// Documentação (meio fraquinha) da lib: https://docs.wwebjs.dev/

client.on("message", async  (msg) => {
	try{
		// return
		var author = getAuthor(msg)
		// if(autsor === PEP && msg.body === "@enable"){
		// 	enableGroup(msg)
		// 	msg.reply('Grupo autorizado')
		// }
		if(author === PEP && msg.body.toLowerCase() === '@testing'){
			toggleTest(msg)
			return;
		}

		if(author === PEP && msg.body === "@ping"){
			msg.reply('2.0 on')
		}

		if(author === PEP && isTesting()){
			return;
		}

		if(ignoreFrom(msg)) return;
		if(!BLACKLIST.find(user => user === author)){
			functions.reply(msg, client);	
		}else{
			// console.log("blacklisted")
		}
	}catch(err){
		console.log(err)
	}

	
})


//teste
client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});

process.on('uncaughtException', function (exception) {
	console.log('Ops.. algo deu errado')
	console.log(exception)
});

function toggleTest(msg){
	let filePath = path.join(__dirname, './config/testing.json')
	let testing = load(filePath)
	testing.testing = !testing.testing
	save(testing, filePath)
	msg.reply('testando '+testing.testing)
}

function isTesting(){
	let filePath = path.join(__dirname, './config/testing.json')
	let testing = load(filePath)
	return testing.testing
}


function getAuthor(msg){
	var author = (msg.author || msg.from)
	author = author.slice(0, author.indexOf("@"))
	return author
}

async function enableGroup(msg){
	let chat = await msg.getChat()
	const filePath = path.join(__dirname, './config/utils/enabledChats.json');
	let enabled = load(filePath)
	enabled.chats.push({"id": msg.from, "name": chat.name})
	save(enabled, filePath)
}

function acceptFrom(msg){
	const filePath = path.join(__dirname, './config/utils/enabledChats.json');
	let enabled = load(filePath)
	return enabled.chats.find(enabled => enabled.id === msg.from)
}

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

function ignoreFrom(msg){
	const filePath = path.join(__dirname, './config/utils/excludedChats.json');
	let excluded = load(filePath)
	return excluded.chats.find(excluded => excluded.id === msg.from)
}