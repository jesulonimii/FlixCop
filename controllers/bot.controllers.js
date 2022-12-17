const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);




exports.bot_setup = async () => {

    const welcome_msg =`
    Welcome to FlixCop Bot!
    A simple bot that allows you find movies from pictures containing the actors/actresses.
    `

    bot.command('start', (ctx) => {
        ctx.reply(welcome_msg);
    });




    bot.on('message', (ctx) => {
        //console.log(ctx.update.message)

        if (ctx.update.message.photo){
            onImageReceive(ctx.update.message.photo[ctx.update.message.photo.length - 1], ctx)
        }


    })


    const onImageReceive = async (photo, ctx) => {
        const fileObject =  await ctx.telegram.getFileLink(photo.file_id);
        const fileUrl = JSON.stringify(fileObject).replace(/"/g, '');

        return {fileUrl, caption: ctx.update.message.caption};
    }



    bot.launch().then(r => console.log("FlixCop Telegram Bot is running"));

}

exports.setCommands = async (req, res) => {
    try {
        await bot.telegram.setMyCommands([
            {command: 'start', description: 'Start bot'},
            {command: 'help', description: 'Help'},
            {command: 'settings', description: 'Settings'},
            {command: 'about', description: 'About'},
        ]);
        res.end('ok');
    } catch (e) {
        console.log(e);
        res.end('error');
    }
}

exports.setName = async () => {

}