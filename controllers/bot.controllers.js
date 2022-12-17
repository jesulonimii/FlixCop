const { Telegraf } = require('telegraf');
const axios = require("axios");
const {response} = require("express");

const bot = new Telegraf(process.env.BOT_TOKEN);

const { API_URL, FLIXCOP_API_KEY } = process.env

const config = {
    headers: {
        ["Content-Type"]: "application/json",
        ["x-api-key"]: FLIXCOP_API_KEY
    }
}


exports.bot_setup = async () => {

    const welcome_msg =`
    Welcome to FlixCop Bot!\nA simple bot that allows you find movies from pictures containing the actors/actresses.
    `

    bot.command('start', (ctx) => {
        ctx.reply(welcome_msg);
    });


    bot.on('text', async (ctx) => {
        ctx.reply('Please send a picture containing the actors/actresses you want to find movies for.')
    })


    bot.on('message', async (ctx) => {
        //console.log(ctx.update.message)

        if (ctx.update.message.photo) {
            ctx.reply('Processing Image... Please wait.')
            const imageDetails = await onImageReceive(ctx.update.message.photo[ctx.update.message.photo.length - 1], ctx)

            const data = {
                image: imageDetails.url
            }


            await axios.post(`${API_URL}/api/v1/find-via-url`, data, config).then(({data}) => {
                console.log(data)

                const result = `Title: ${data.name}\nYear: ${data.year}\nRating: ${data.rating}\nhttps://www.imdb.com/title/${data.id}/`

                ctx.reply(result)

                
                
            }).catch((e) => {
                const error = `{"error" : "${e.message}", "reason" : "${e.response.data}" }`
                console.log(error)
                ctx.reply(`We could not finish your request: ${e.response.data}`)
            })
        }

    })


    const onImageReceive = async (photo, ctx) => {
        const fileObject =  await ctx.telegram.getFileLink(photo.file_id);
        const fileUrl = JSON.stringify(fileObject).replace(/"/g, '');

        return {url: fileUrl, caption: ctx.update.message.caption};
    }



    bot.launch().then(r => console.log("FlixCop Telegram Bot is running"));

}

exports.setCommands = async (req, res) => {
    try {
        await bot.telegram.setMyCommands([
            {command: 'start', description: 'Start bot'},
        ]);
        res.end('ok');
    } catch (e) {
        console.log(e);
        res.end('error');
    }
}

exports.setName = async () => {

}