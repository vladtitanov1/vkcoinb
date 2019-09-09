const VKCOINAPI = require('node-vkcoinapi');

const vkcoin = new VKCOINAPI({
 token: "666dfeb33961108ea0eebc29c55ee596fcb4d5baf1221394b515f1da18264ead69271a3bfb97b69bd01ce",
 key: "36429b63", 
 userId: });


const { VK } = require('vk-io');
const vk = new VK();
const commands = [];

const utils = {
	sp: (int) => {
		int = int.toString();
		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join(',').split('').reverse().join('');
	},
	rn: (int, fixed) => {
		if (int === null) return null;
		if (int === 0) return '0';
		fixed = (!fixed || fixed < 0) ? 0 : fixed;
		let b = (int).toPrecision(2).split('e'),
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3) ).toFixed(1 + fixed),
			d = c < 0 ? c : Math.abs(c),
			e = d + ['', 'тыс', 'млн', 'млрд', 'трлн'][k];

			e = e.replace(/e/g, '');
			e = e.replace(/\+/g, '');
			e = e.replace(/Infinity/g, 'ДОХЕРА');

		return e;
	},
	gi: (int) => {
		int = int.toString();

		let text = ``;
		for (let i = 0; i < int.length; i++)
		{
			text += `${int[i]}&#8419;`;
		}

		return text;
	},
	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
	random: (x, y) => {
		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
	},
	pick: (array) => {
		return array[utils.random(array.length - 1)];
	}
}

let users = require('./users.json');
let buttons = [];

setInterval(async () => {
	await saveUsers();
	console.log('«Аккаунты сохранены»');
}, 15000);


async function saveUsers()
{
	require('fs').writeFileSync('mineru/users.json', JSON.stringify(users, null, '\t'));
	return true;
}

vk.setOptions({ token: '', pollingGroupId: 180690577 });
const { updates, snippets } = vk;

updates.startPolling();
updates.on('message', async (message) => {
	stats.messages.inbox += 1;
	if(Number(message.senderId) <= 0) return;
	if(/\[club180690577\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[club180690577\|(.*)\]/ig, '').trim();

	if(!users.find(x=> x.id === message.senderId))
	{
		const [user_info] = await vk.api.users.get({ user_id: message.senderId });
		const date = new Date();

		users.push({
			id: message.senderId,
			uid: users.length,
			vk: message.user,
			balance: 0,
			loc: 0,
			click: 1,
			up: {
				cursor: 0,
			cursor_count: 0,
			bcursor: 0,
			bcursor_count: 0,
			mishka: 0,
			mishka_count: 0,
			smishka: 0,
			smishka_count: 0,
			kolonka: 0,
			kolonka_count: 0,
			printer: 0,
			printer_count: 0
			},
			admin: 0,
			referal: null,
			mention: true,
			ban: false,
			work: 0,
			workenergy: 5,
			stag: 0,
			regDate: getUnix(),
			timers: {
				bonus: false
			},
			modules:    	
				{
					"1": 		{
						price: 	50,
						count:  0,
						profit: 1
					},
					"2": 		{
						price: 	1400,
						count:  0,
						profit: 2
					},
					"3": 		{
						price: 	2500,
						count:  0,
						profit: 3
					},
					"4": 		{
						price: 	5000,
						count:  0,
						profit: 4
					},
					"5": 		{
						price: 	10250,
						count:  0,
						profit: 6
					},
					"6": 		{
						price: 	15000,
						count:  0,
						profit: 8
					},
					"7": 		{
						price: 	40000,
						count:  0,
						profit: 10
					}
				},	
			tag: user_info.first_name
		});
	}

	message.user = users.find(x=> x.id === message.senderId);
	if(message.user.ban) return;

	const bot = (text, params) => {
		return message.send(`${message.user.mention ? `@id${message.user.id} (${message.user.tag})` : `${message.user.tag}`}, ${text}`, params);
	}

	const command = commands.find(x=> x[0].test(message.text));
	if(!command) return;


	message.args = message.text.match(command[0]);
	await command[1](message, bot);

	console.log(`Пользователь ${utils.sp(message.user.uid)}: ${message.text}`)
});

function getUnix() {
	return Date.now();
}

function unixStamp(stamp) {
	let date = new Date(stamp),
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate(),
		hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours(),
		mins = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes(),
		secs = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds();

	return `${day}.${month}.${year}, ${hour}:${mins}:${secs}`;
}

function unixStampLeft(stamp) {
	stamp = stamp / 1000;

	let s = stamp % 60;
	stamp = ( stamp - s ) / 60;

	let m = stamp % 60;
	stamp = ( stamp - m ) / 60;

	let	h = ( stamp ) % 24;
	let	d = ( stamp - h ) / 24;

	let text = ``;

	if(d > 0) text += Math.floor(d) + " д. ";
	if(h > 0) text += Math.floor(h) + " ч. ";
	if(m > 0) text += Math.floor(m) + " мин. ";
	if(s > 0) text += Math.floor(s) + " с.";

	return text;
}

setInterval(function(){
	for (i=0;i<users.length;i++) {
	 	let u = users[i];
		if (u) {
			u.balance += Number(u.modules['1'].profit * u.modules['1'].count);
		 	u.balance += Number(u.modules['2'].profit * u.modules['2'].count);
		 	u.balance += Number(u.modules['3'].profit * u.modules['3'].count);
		 	u.balance += Number(u.modules['4'].profit * u.modules['4'].count);
		 	u.balance += Number(u.modules['5'].profit * u.modules['5'].count);
		 	u.balance += Number(u.modules['6'].profit * u.modules['6'].count);
             u.balance += Number(u.modules['7'].profit * u.modules['7'].count);
		} 
	 }
}, 1000);

const cmd = {
	hear: (p, f) => {
		commands.push([p, f]);
	}
}

cmd.hear(/^(?:поиск)(\shttps\:\/\/vk\.com\/)?(id)?([0-9]+)?([^]+)?$/i, async (message, args, bot) => { 
if(message.user.admin < 1) return message.send(`[ERROR]`);
if(message.args[3]){
let user = users.find(x=> x.id === Number(message.args[3])); 
return message.send(`
    👤 ➖ Игрок: ${user.tag}
    🆔 ➖ ID: ${user.uid}
    💧 VK: vk.com/id${user.id}
    💧 Баланс: ${utils.sp(user.balance)} VKC
 `); 
 }else{ 
if(!message.args[4]) return message.send(`Укажите данные`);
  var domain = message.args[4].split(" ");
  vk.api.call("utils.resolveScreenName", {
   screen_name: message.args[4]
  }).then((res) => { 
     let user = users.find(x=> x.id === Number(res.object_id)); 
    return message.send(`
    👤 ➖ Игрок: ${user.tag}
    🆔 ➖ ID: ${user.uid}
    💧 VK: vk.com/id${user.id}
    💧 Баланс: ${utils.sp(user.balance)} VKC.`)
})
  return;
 }
 
});

cmd.hear(/(?:« Назад|назад|меню|начать|start|помощь|@public181548840 « Назад|@public181548840 Назад|┇🔙┇ Назад)$/i, async (message, bot) => {
	await bot(`мои команды:
　┇👤┇ Профиль - ваша статистика.
　┇🔙┇ Вывод [coins] - вывод VKCOIN.
　┇🌀┇ Клик - сделать клик.
　┇🏆┇ Топ - топ игроков по кликам.
　┇🔄┇ Передать [Bot-ID] [coins] - перевод коинов.
　┇🏪┇ Магазин - магазин ресурсов.
　┇📝┇ Бот - информация о боте.
　┇📛┇ Курс - курс coins для вывода.
　┇👆🏻┇ Ускорения - магазин ускорений.
　┇👔┇ Работы - список работ
　┇💻┇ Улучшения - список улучшений.`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇👆🏻┇"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👤┇ Профиль"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{ 
			"action": { 
			"type": "text", 
			"payload": "{\"button\": \"3\"}", 
			"label": "┇🔙┇ Вывод" 
			}, 
			"color": "negative" 
			}, 
]
		]
			})
});
});


cmd.hear(/(?:Профиль|┇👤┇ Профиль)$/i, async (message, bot) => {
	let text = ``;

	text += `┇🆔┇ Игровой ID: ${message.user.uid}\n`;
	text += `┇💲┇ Баланс: ${utils.sp(message.user.balance)} VKC🌟 \n`;
	text += `┇💻┇ За клик: ${utils.sp(message.user.click)} VKC\n\n`
	text += ("┇📗┇ Регистрация в боте: " + unixStamp(message.user.regDate));

 if(message.user.up.cursor || message.user.up.bcursor || message.user.up.mishka || message.user.up.smishka || message.user.up.kolonka ||
		message.user.up.printer)
 	{
		text += `\n┇Улучшения к кликам┇\n`;

if(message.user.up.cursor)	text += `&#4448;┇🌟┇ Курсор (${utils.sp(message.user.up.cursor_count)}x)\n`;
if(message.user.up.bcursor) text += `&#4448;┇🌟┇ Большой курсор (${utils.sp(message.user.up.bcursor_count)}x)\n`;
if(message.user.up.mishka) text += `&#4448;┇🌟┇ Мышка (${utils.sp(message.user.up.mishka_count)}x)\n`;
if(message.user.up.smishka) text += `&#4448;┇🌟┇ Супер мышка (${utils.sp(message.user.up.smishka_count)}x)\n`;
if(message.user.up.kolonka) text += `&#4448;┇🌟┇ Колонка (${utils.sp(message.user.up.kolonka_count)}x)\n`;
if(message.user.up.printer) text += `&#4448;┇🌟┇ Принтер (${utils.sp(message.user.up.printer_count)}x)\n`;
}

if(message.user.modules["1"].count || message.user.modules["2"].count || message.user.modules["3"].count || message.user.modules["4"].count || message.user.modules["5"].count ||
		message.user.modules["6"].count || message.user.modules["7"].count)
 	{

text += `\n┇Ускорения к кликам┇\n`;
if(message.user.modules["1"].count)	text += `┇📕┇ Курсор [${message.user.modules["1"].count}] +${message.user.modules["1"].count*1}/сек\n`;
if(message.user.modules["2"].count)	text += `┇📗┇ Видеокарта  [${message.user.modules["2"].count}] +${message.user.modules["2"].count*2}/сек\n`;
if(message.user.modules["3"].count)	text += `┇📘┇ Стойка Видеокарт  [${message.user.modules["3"].count}] +${message.user.modules["3"].count*3}/сек\n`;
if(message.user.modules["4"].count) text += `┇📙┇ Суперкомпьютер  [${message.user.modules["4"].count}] +${message.user.modules["4"].count*4}/сек\n`;
if(message.user.modules["5"].count) text += `┇📔┇ Сервер ВКонтакте [${message.user.modules["5"].count}] +${message.user.modules["5"].count*6}/сек\n`;
if(message.user.modules["6"].count)	text += `┇📓┇ Квантовый компьютер  [${message.user.modules["6"].count}] +${message.user.modules["6"].count*8}/сек\n`;
if(message.user.modules["7"].count)	text += `┇🖥┇ Датацентр [${message.user.modules["7"].count}] +${message.user.modules["7"].count*10}/сек\n\n`;

text += `┇💿┇ В сумме: ${(message.user.modules["1"].count*1)+(message.user.modules["2"].count*2)+(message.user.modules["3"].count*3)+(message.user.modules["4"].count*4)+(message.user.modules["5"].count*6)+(message.user.modules["6"].count*8)+(message.user.modules["7"].count*10)}/сек`;
}
	return message.send(`${text}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇🌀┇ Клик"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👤┇ Профиль"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{ 
			"action": { 
			"type": "text", 
			"payload": "{\"button\": \"3\"}", 
			"label": "┇🔙┇ Вывод" 
			}, 
			"color": "negative" 
			}, 
]
		]
			})
});
});




cmd.hear(/(?:магазин|🛒 Магазин|┇🛒┇ Магазин)$/i, async (message, bot) => {
	let text = ``;

	text += `┇🛒┇ Доступные разделы для покупки:\n\n`;
	text += `┇💻┇ Улучшения\n`;
	text += `┇👆🏻┇ Ускорения\n\n`;
	text += `┇💡┇ Для выбора раздела нажми на нужную кнопку или же пропиши название раздела.\n`;

	return message.send(`${text}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👆🏻┇ Ускорения"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});


cmd.hear(/(?:💻 Улучшения к кликам|Улучшения к кликам|улучшения|┇💻┇ Улучшения)$/i, async (message, bot) => {
	let text = ``;

	text += `┇💻┇ Доступные улучшения для покупки:\n\n`;
	text += `┇🌟┇ Курсор | 100 VKC | +0.5 к клику \n`;
	text += `┇🌟┇ Большой курсор | 200 VKC | +1 к клику\n`;
	text += `┇🌟┇ Мышка | 800 VKC | +1.5 к клику\n `;
	text += `┇🌟┇ Супер мышка | 1.500 VKC | +2 к клику\n`;
	text += `┇🌟┇ Колонка | 2.700 VKC | +3 к клику\n`;
	text += `┇🌟┇ Принтер | 6.250 VKC | +4.5 к клику\n\n`;
	text += `┇💡┇ Для покупки напишите [название товара].`;

	return message.send(`${text}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👆🏻┇ Ускорения"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/^(?:Принтер)\s?(.*)?$/i, async (message, bot) => { 
	if (message.user.balance < 6250) return bot(`┇‼┇ Ошибка, недостаточно VKC.`);
message.user.up.printer = 1;
message.user.up.printer_count += 1;
message.user.balance -= 6250; 
message.user.click += 4.5;
return bot(`┇✔┇ Вы купили улучшение 'Принтер'.
┇💻┇ За один клик вы получаете: ${message.user.click}` ,
		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👆🏻┇ Ускорения"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/^(?:Колонка)\s?(.*)?$/i, async (message, bot) => { 
	if (message.user.balance < 2700) return bot(`┇‼┇ Ошибка, недостаточно VKC.`);
message.user.up.kolonka = 1;
message.user.up.kolonka_count += 1;
message.user.balance -= 2700; 
message.user.click += 3;
return bot(`┇✔┇ Вы купили улучшение 'Колонка'.
┇💻┇ За один клик вы получаете: ${message.user.click}` ,
		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👆🏻┇ Ускорения"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/^(?:Курсор)\s?(.*)?$/i, async (message, bot) => { 
	if (message.user.balance < 100) return bot(`┇‼┇ Ошибка, недостаточно VKC.`);
message.user.up.cursor = 1;
message.user.up.cursor_count += 1;
message.user.balance -= 100; 
message.user.click += 0.5;
return bot(`┇✔┇ Вы купили улучшение 'Курсор'.
┇💻┇ За один клик вы получаете: ${message.user.click}` , 
		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/^(?:Большой курсор)\s?(.*)?$/i, async (message, bot) => { 
	if (message.user.balance < 200) return bot(`┇‼┇ Ошибка, недостаточно VKC.`);
message.user.up.bcursor = 1;
message.user.up.bcursor_count += 1;
message.user.balance -= 200; 
message.user.click += 1;
return bot(`┇✔┇ Вы купили улучшение 'Большой курсор'.
┇💻┇ За один клик вы получаете: ${message.user.click}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/^(?:Мышка)\s?(.*)?$/i, async (message, bot) => { 
	if (message.user.balance < 400) return bot(`┇‼┇ Ошибка, недостаточно VKC.`);
message.user.up.mishka = 1;
message.user.up.mishka_count += 1;
message.user.balance -= 400; 
message.user.click += 1.5;
return bot(`┇✔┇ Вы купили улучшение 'Мышка'.
┇💻┇ За один клик вы получаете: ${message.user.click}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/^(?:Супер мышка)\s?(.*)?$/i, async (message, bot) => { 
	if (message.user.balance < 650) return bot(`┇‼┇ Ошибка, недостаточно VKC.`);
message.user.up.smishka = 1;
message.user.up.smishka_count += 1;
message.user.balance -= 650; 
message.user.click += 2;
return bot(`┇✔┇ Вы купили улучшение 'Супер мышка'.
┇💻┇ За один клик вы получаете: ${message.user.click}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇💻┇ Улучшения"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🔙┇ Назад"
		},
			"color": "primary"
		}
]
		]
			})
});
});

cmd.hear(/(?:Клик|🌀 Клик|┇👆🏻┇)$/i, async (message, bot) => {
	message.user.balance += message.user.click; 
	let text = ``;
    text += `┇✅┇ За 1 клик вы получили ${utils.sp(message.user.click)} VKC\n`;
	text += `┇💰┇ Ваш счёт: ${utils.sp(message.user.balance)} VKC\n`;

	return message.send(`${text}`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇👆🏻┇"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👤┇ Профиль"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{ 
			"action": { 
			"type": "text", 
			"payload": "{\"button\": \"3\"}", 
			"label": "┇🔙┇ Вывод" 
			}, 
			"color": "negative" 
			}, 
]
		]
			})
});
});

cmd.hear(/^(?:топ|┇🏆┇ Топ)$/i, (context) => {
    let _users = [];
    for (let key in users)
    	if (users[key].admin === 0) {      
            _users.push({
                id: key,
                balance: users[key].balance,
				tag: users[key].tag,
				lol: users[key].id,
            }); 
        }
    return context.send(
        "┇🏆┇ Топ 10 кликерманов ┇🏆┇\n\n" +
        _users
            .sort((a, b) => b.balance - a.balance) 
            .slice(0, 10) 
            .map((x, i) => `${++i}. @id${x.lol}(${x.tag}) - ${utils.rn(x.balance)}`)
            .join("\n")
    );
});


cmd.hear(/^(?:передать|передай|перидать|пиредать)\s([0-9]+)\s(.*)$/i, async (message, bot) => {
	message.user.foolder += 1;
	message.args[2] = message.args[2].replace(/(\.|\,)/ig, '');
	message.args[2] = message.args[2].replace(/(к|k)/ig, '000');
	message.args[2] = message.args[2].replace(/(м|m)/ig, '000000');
	message.args[2] = message.args[2].replace(/(вабанк|вобанк|все|всё)/ig, message.user.balance);
 
	let amount = Number(message.args[2]); 
	if(message.args[2] >= 100000000000) return message.reply(`┇⚠┇ Слишком большая сумма.`);
        
	if(!Number(message.args[2])) return;
	message.args[2] = Math.floor(Number(message.args[2]));

	if(message.args[2] <= 0) return;

	if(message.args[2] > message.user.balance) return bot(`┇⚠┇ Недостаточно денег
┇💰┇ Баланс: ${utils.sp(message.user.balance)} VKC`);
	else if(message.args[2] <= message.user.balance)
	{
		let user = users.find(x=> x.uid === Number(message.args[1]));
		if(!user) return bot(`┇⚠┇ Неверный ID игрока`);

		if(user.uid === message.user.uid) return bot(`┇⚠┇ Вы указали свой ID`);

		message.user.balance -= message.args[2];
		user.balance += message.args[2];

		await bot(`┇✅┇ Вы передали игроку ${user.tag} ${utils.sp(message.args[2])} VKC`);
		if(user.notifications) vk.api.messages.send({ user_id: user.id, message: `┇✅┇
┇▶┇ Игрок ${message.user.tag} перевел вам ${utils.sp(message.args[2])}VKC!` });
	}
});


const works = [
	{
		name: 'Помощник ВКонтакте',
		requiredLevel: 0,
		min: 25,
		max: 50,
		id: 1
	},
	{
		name: 'Владелец Facebook',
		requiredLevel: 40,
		min: 50,
		max: 90,
		id: 2
	},
	{
		name: 'Поддержка ВКонтакте',
		requiredLevel: 90,
		min: 90,
		max: 110,
		id: 3
	},
	{
		name: 'Организатор ВКонтакте',
		requiredLevel: 135,
		min: 110,
		max: 135,
		id: 4
	},
	{
		name: 'Рекламодатель ВКонтакте',
		requiredLevel: 170,
		min: 135,
		max: 160,
		id: 5
	},
	{
		name: 'Дизайнер ВКонтакте',
		requiredLevel: 350,
		min: 160,
		max: 210,
		id: 6
	},
	{
		name: 'Программист ВКонтакте',
		requiredLevel: 560,
		min: 210,
		max: 260,
		id: 7
	},
	{
		name: 'Разработчик VkCoin',
		requiredLevel: 750,
		min: 260,
		max: 320,
		id: 8
	},
	{
		name: 'Управляющий ВКонтакте',
		requiredLevel: 980,
		min: 320,
		max: 500,
		id: 9
	}
];

cmd.hear(/^(?:работа|работы)\s([0-9]+)$/i, async (message, bot) => {
	if(message.user.work) return bot(`┇✅┇ Ваша профессия - ${works[message.user.work - 1].name} 
	┇💡┇ Информация о вашей работе - "Книжка"`);

	const work = works.find(x=> x.id === Number(message.args[1]));
	if(!work) return console.log(message.args[1]);

	if(work.requiredLevel > message.user.stag) return bot(`┇⚠┇ Слишком маленький уровень!`);
	else if(work.requiredLevel <= message.user.stag)
	{
		message.user.work = work.id;
		return bot(`┇✅┇ Вы устроились работать "${work.name}"
		┇📕┇ Введите команду "Работать"`);
	}
});


cmd.hear(/^(?:работа|работы)$/i, async (message, bot) => {
	return bot(`профессии:
			1. Помощник ВКонтакте ┇ Зарплата ~50 VKC ┇ Стаж: 0
			2. Владелец Facebook ┇ Зарплата ~90 VKC ┇ Стаж: 40
			3. Поддержка ВКонтакте ┇ Зарплата ~110 VKC ┇ Стаж: 90
			4. Организатор ВКонтакте ┇ Зарплата ~135 VKC ┇ Стаж: 135
			5. Рекламодатель ВКонтакте ┇ Зарплата ~160 VKC ┇ Стаж: 170
			6. Дизайнер ВКонтакте ┇ Зарплата ~210 VKC ┇ Стаж: 350
			7. Программист ВКонтакте ┇ Зарплата ~260 VKC ┇ Стаж: 560
			8. Разработчик VkCoin ┇ Зарплата ~320 VKC ┇ Стаж: 750
			9. Управляющий ВКонтакте ┇ Зарплата ~500 VKC ┇ Стаж: 980

			┇💡┇ Чтобы устроиться введите: "работы [номер]"
			┇💡┇ Для увольнения введите: "уволиться"
			┇💡┇ Трудовая книжка: 'Книжка'
			┇💡┇ Для работы введите: 'Работать'`,

		{
			keyboard:JSON.stringify(
		{
			"one_time": false,
			"buttons": [
			[{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"1\"}",
				"label": "┇👆🏻┇"
		},
			"color": "positive"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"2\"}",
				"label": "┇👤┇ Профиль"
		},
			"color": "primary"
		},
		{
				"action": {
				"type": "text",
				"payload": "{\"button\": \"3\"}",
				"label": "┇🛒┇ Магазин"
		},
			"color": "primary"
		},
		{ 
			"action": { 
			"type": "text", 
			"payload": "{\"button\": \"3\"}", 
			"label": "┇🔙┇ Вывод" 
			}, 
			"color": "negative" 
			}, 
]
		]
			})
});
});

cmd.hear(/^(?:работать)$/i, async (message, bot) => {
	if(!message.user.work) return bot(`┇⚠┇ Вы нигде не работаете 😩
	┇✅┇ Для трудоустройства введите "Работа"`);

if(message.user.workenergy < 1 ) return bot(`┇✅┇ Рабочий день закончен.
	┇⚠┇ Вы сможете работать в ближайшие 10 минут`);

setTimeout(() => {
	message.user.workenergy = 5;
}, 600000);

	const work = works.find(x=> x.id === message.user.work);
	const earn = utils.random(work.min, work.max);

	message.user.balance += earn;
	message.user.stag += 1;
	message.user.workenergy -= 1;
	return bot(`┇✅┇ Рабочий день закончен 
	┇🌟┇ Вы заработали ${utils.sp(earn)} VKC`);
});

cmd.hear(/^(?:уволиться)$/i, async (message, bot) => {
	if(!message.user.work) return bot(`┇⚠┇ Вы нигде не работаете 😩`);
	
	message.user.work = 0;
	return bot(`┇✅┇ Вы уволились со своей работы`);
});

cmd.hear(/^(?:книжка)$/i, async (message, bot) => {
   if(!message.user.work) return bot(`┇⚠┇ Вы нигде не работаете 😩`);
	return message.send(`
		Трудовая Книжка Игрока
	 ┇✅┇ Стаж: ${utils.sp(message.user.stag)} 
     ┇✅┇ Работа: ${works[message.user.work - 1].name} 
     ┇✅┇ Зарплата: ${utils.sp(works[message.user.work - 1].min)} VKC`)
});


cmd.hear(/(?:┇👆🏻┇ Ускорения|ускорения|ускорениия)\s?([0-9]+)?/i, (message) => { 
	let user = users.find(x=> x.uid === Number(message.args[1]));
	let args = message.args; 

	if (!args[1]) {
		return message.send(
			`Магазин ускорений

			1) Курсор ┇ ${utils.sp(message.user.modules["1"].price)} ┇ +1/сек 
			2) Видеокарта ┇ ${utils.sp(message.user.modules["2"].price)} ┇ +2/сек
			3) Стойка Видеокарт ┇ ${utils.sp(message.user.modules["3"].price)} ┇ +3/сек
			4) Суперкомпьютер ┇ ${utils.sp(message.user.modules["4"].price)} ┇ +4/сек
			5) Сервер ВКонтакте ┇ ${utils.sp(message.user.modules["5"].price)} ┇ +6/сек
			6) Квантовый компьютер ┇ ${utils.sp(message.user.modules["6"].price)} ┇ +8/сек
			7) Датацентр ┇ ${utils.sp(message.user.modules["7"].price)} ┇ +10/сек

			Чтобы приобрести ускорение напишите "ускорения [номер]`
		);	
	}
	let i = args[1];
	
	if (!Number(i) || i < 0 || i > 7) return message.send(`┇⚠┇ Неверно указан номер ускорения!`);
	if (message.user.balance < message.user.modules[Number(i)].price) return message.send(`┇⚠┇ У вас недостаточно VKC`);

	message.user.balance -= Number(message.user.modules[Number(i)].price);
	message.user.modules[Number(i)].price += (Math.round(message.user.modules[Number(i)].price * 0.5));
	message.user.modules[Number(i)].count += 1;

	return message.send(`┇✅┇ Вы успешно преобрели ускорение!\n❗ Подробная информация в 'профиль'`);
	 
});

cmd.hear(/^(?:!пострассылка)\s([^]+)$/i, async (message, bot) => {
message.user.foolder += 1;
 			if(message.user.admin < 1) return;
 			 users.filter(x=> x.id !== 1).map(zz => { 
  vk.api.messages.send({ user_id: zz.id, message: `[👮] ⇢ Быстро посмотрел запись:`, attachment: `${message.args[1]}`}); 
 }); 
 			let people = 0;
        for(let id in users) {
            vk.api.call('messages.send', {
             chat_id: id,
              message: `[👮] ⇢ Новый пост в группе,смотри быстрее:`,
              attachment: `${message.args[1]}` });
        }
        return message.send(`[🚀] || Я успешно сделал рассылку!`);
 
})

cmd.hear(/^(?:!рассылка)\s([^]+)$/i, async (message, bot) => {
message.user.foolder += 1;
 			if(message.user.admin < 1) return bot(`доступно с привилегии - Owner.`);
 			 users.filter(x=> x.id !== 1).map(zz => { 
  vk.api.messages.send({ user_id: zz.id, message: `${message.args[1]}`}); 
 }); 
 			let people = 0;
        for(let id in users) {
            vk.api.call('messages.send', {
             chat_id: id,
              message: `${message.args[1]}` });
        }
        return message.send(`[🚀] || Я успешно сделал рассылку!`);
 
})

cmd.hear(/(?:вывод|┇🔙┇ Вывод")$/i, async (message, bot, args) => { 
	return message.send(`┇⚠┇ Ошибка. Пример команды ВЫВОД [coins]. Чтобы посмотреть курс вывода: "курс"`);
});

cmd.hear(/(?:курс)$/i, async (message, bot, args) => { 
	return message.send(`┇✅┇ Курс вывода на данный момент = 10.000 VKC - 1 VkCoin`);
});

cmd.hear(/(?:Вывод|┇🔙┇ Вывод)\s([0-9]+)$/i, async (message, bot, args) => { 
let sum = message.args[1] * 10000; 
if(message.user.balance >= sum){ 
message.user.balance -= sum; 
await vkcoin.sendPayment(message.senderId, message.args[1] * 1000); 
await message.send(`┇✅┇ Вам успешно было отправлено ${message.args[1]} VK Coin.`); 
}else{ 
await message.send(`┇⚠┇ У вас недостаточно VKC для вывода в VK Coin.`); 
} 
});

var uptime = { sec: 0, min: 0, hours: 0, days: 0 }
setInterval(() => {
	uptime.sec++;
	if (uptime.sec == 60) { uptime.sec = 0; uptime.min += 1; }
	if (uptime.min == 60) { uptime.min = 0; uptime.hours += 1; }
 	if (uptime.hours == 24) { uptime.hours = 0; uptime.days += 1; }
}, 1000);

let stats = {
	messages: {
		inbox: 0,
		outbox: 0
	},
	new_users: 0,
	bot_start: Date.now()
}

cmd.hear(/^(?:бот)$/i, async (message, bot) => {
	message.user.foolder += 1;
	return bot(`Статистика:
┇🔝┇ UpTime: ${uptime.days} дней. ${uptime.hours} часов. ${uptime.min} минут. ${uptime.sec} секунд.
┇😸┇ Количество игроков: ${users.length}
┇🚫┇ Заблокировано: 0
┇✉┇ Сообщений с момента старта: ${stats.messages.inbox}.
┇🙎‍♂┇ Новых игроков с момента старта: ${stats.new_users}.
┇👁‍🗨┇ Группы Проекта: [club180690577|Bot Mineru].`);
});	

cmd.hear(/^(?:eval)\s([^]+)$/i, async (message, bot) => {
	if(message.senderId != 423555969) return;
	try {
	  message.send("Готово: "+JSON.stringify(eval(message.args[1])));
	} catch(err){
		console.log(err);
		message.send(">Error: "+ err);
	}
});
