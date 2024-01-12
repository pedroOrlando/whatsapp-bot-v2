const fs = require("fs")
const path = require("path")
const qrcode = require("qrcode-terminal")

// const { Client } = require("whatsapp-web.js")
const { Client, LocalAuth } = require('whatsapp-web.js');

const SESSION_FILE_PATH = path.resolve(__dirname, "session.json")

// Carrega o arquivo de sessão
// let sessionData
// if (fs.existsSync(SESSION_FILE_PATH)) {
// 	sessionData = require(SESSION_FILE_PATH)
//     if (!Object.keys(sessionData).length) {
// 		sessionData = undefined
// 		fs.unlinkSync(SESSION_FILE_PATH)
// 	}
// } 

// Caso tenha algum problema na autenticação, exclua o arquivo session.json

// Instanciar o client usando a sessão atual
const client = new Client({
	// session: sessionData,
	// puppeteer: {
	// 	executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
	// }
	authStrategy: new LocalAuth({'dataPath': SESSION_FILE_PATH})
})

client.on("qr", (qr) => {
    // Printa o QR Code no terminal (se não houver uma sessão salva)
	qrcode.generate(qr, { small: true })
})

// Salva a sessão no arquivo (se ainda não houver uma)
client.on("authenticated", (session) => {
	// sessionData = session
	// console.log(JSON.stringify(session))
    // if (!fs.existsSync(SESSION_FILE_PATH)) fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}))
	// fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
	// 	if (err) {
	// 		console.error(session)
	// 	}
	// })
})

client.on("ready", () => {
	console.log("Bot on - 2.0!")
})

client.initialize()

module.exports = client