// Coded by GEN0C1DE.
// Twitter: GEN0C1DE; Github: GEN0C1DE

// Getting Dependencies
global.Dependencies = {
	Chalk: require("chalk"),
	Noblox: require("noblox.js")
}

var Noblox = Dependencies.Noblox
var Chalk = Dependencies.Chalk

// Getting Settings
global.Settings = {
	Cookie: "", // Your Roblox Cookie is Needed. EXAMPLE: _|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_IOGODIUADBFDKHGFWEJKHFEFHUOI3R3R3TRU1BYID3YNR13Y1RMIHRIUDBG1RDG
	GroupID: undefined, // The Group ID needed to mass exile. EXAMPLE: 219480
	UserID: undefined, // Your UserID so you don't get kicked from the Group.
	ROLEARRAY: [], // LEAVE BLANK.
	USERARRAY: [] // LEAVE BLANK.
}

console.clear()
console.log(Chalk.red(`
									▒██   ██▒ ██▓ ██▀███  ▓█████ 
									▒▒ █ █ ▒░▓██▒▓██ ▒ ██▒▓█   ▀ 
									░░  █   ░▒██▒▓██ ░▄█ ▒▒███   
									 ░ █ █ ▒ ░██░▒██▀▀█▄  ▒▓█  ▄ 
									▒██▒ ▒██▒░██░░██▓ ▒██▒░▒████▒
									▒▒ ░ ░▓ ░░▓  ░ ▒▓ ░▒▓░░░ ▒░ ░
									░░   ░▒ ░ ▒ ░  ░▒ ░ ▒░ ░ ░  ░
									 ░    ░   ▒ ░  ░░   ░    ░   
									 ░    ░   ░     ░        ░  ░
`))

if (Settings.Cookie == undefined) return console.log(Chalk.red('XIRE: Please set your Roblox Cookie in the JS File.'))
if (Settings.GroupID == undefined || Settings.GroupID == 0) return console.log(Chalk.red('XIRE: Please set a Group ID in the JS File.'));

var Xire = class {
	async SetCookie(Cookie) {
		await Noblox.setCookie(Cookie)
		console.log(Chalk.green(`XIRE: SUCCESSFULLY SET COOKIE.`))
	}
	async GetRoles(GroupID) {
		var GottenRoles = await Noblox.getRoles(GroupID)
		GottenRoles.forEach((Role) => {
			Settings.ROLEARRAY.push(Role.ID)
			console.log(Chalk.green(`XIRE: SUCCESSFULLY PUSHED ROLEID: ${Role.ID}`))
		})
	}
	async GetPlayers(GroupID) {
		this.CanContinue = false
		
		if (Settings.ROLEARRAY.length == 0) return console.log(Chalk.red(`XIRE: THERE WERE NO ROLES TO FETCH PLAYERS FROM.`))
		Settings.ROLEARRAY.forEach(async (RoleID) => {
			var PlayersFromRoles = await Noblox.getPlayers(GroupID, RoleID)
		
			PlayersFromRoles.forEach((Player) => {
				if (Player.userId !== Settings.UserID) {
					Settings.USERARRAY.push(Player.userId)
					console.log(Chalk.yellow(`XIRE: SUCCESSFULLY PUSHED USERID: ${Player.userId}`))
				}
			})
		})
		this.CanContinue = true
	}
	async ExilePlayers(GroupID) {
		if (Settings.USERARRAY.length == 0) return console.log(Chalk.red(`XIRE: THERE WERE NO USERS TO EXILE FROM THE LIST.`))
		Settings.USERARRAY.forEach(async (PlayerID) => {
			if (PlayerID == Settings.UserID) continue;
			Noblox.exile(GroupID, PlayerID).then(Success => {
				console.log(Chalk.magenta(`XIRE: SUCCESSFULLY EXILE USERID: ${PlayerID}`))
			}).catch(Error => {
				console.log(Chalk.red(`XIRE: COULDNT SUCCESSFULLY EXILE USERID: ${PlayerID} BECAUSE OF ${Error}`))
			})
		})
	}
}

var Client = new Xire()
Client.SetCookie(Settings.Cookie).then(async (a) => {
	Client.GetRoles(Settings.GroupID).then(async (b) => {
		Client.GetPlayers(Settings.GroupID)
		
		let Timer;
		function CanContinue() {
			if (Client.CanContinue) {
				Client.ExilePlayers(Settings.GroupID)
				clearInterval(Timer)
			} else {
				console.log(Chalk.cyan("XIRE: WAITING ON RESPONSE FROM THE SERVER... RETRYING (5 SECONDS)"))
			}
		}
		
		Timer = setInterval(CanContinue, 5000)
	})
})

