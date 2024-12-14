'use strict';

const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = '7411186801:AAHeWcKh0b59HQrnr6LjYvDLge68PjJl3Xs';
const CHANNEL_USERNAME = 'damirbeks';

const bot = new Telegraf(BOT_TOKEN);

bot.start(async (ctx) => {
    try {
        await ctx.reply(
            `Assalomu alaykum, ${ctx.from.first_name}!\nBotdan foydalanish uchun @${CHANNEL_USERNAME} kanaliga obuna bo'ling.`,
            Markup.inlineKeyboard([
                Markup.button.url('Obuna bo\lish', `https://t.me/${CHANNEL_USERNAME}`),
                Markup.button.callback('Obunani tasdiqlash', 'verify_subscription')
            ])
        );
    } catch (error) {
        console.error('Startda xatolik:', error);
    }
});

bot.action('verify_subscription', async (ctx) => {
    try {
        const chatMember = await ctx.telegram.getChatMember(`@${CHANNEL_USERNAME}`, ctx.from.id);

        if (['creator', 'administrator', 'member'].includes(chatMember.status)) {
            await ctx.reply(
                `🎉 Rahmat, siz @${CHANNEL_USERNAME} kanaliga obuna bo'lgansiz!\n\n` +
                `📌 Botni kanalga admin qilib qo'shish uchun quyidagi bosqichlarni bajaring:\n\n` +
                `1️⃣ *Kanalga kirish*\n` +
                `   • Kanalni oching yoki kanal sozlamalariga o'ting\n\n` +
                `2️⃣ *Administratorlarni sozlash*\n` +
                `   • Kanal sozlamalaridan "Administratorlar" bo'limini tanlang\n\n` +
                `3️⃣ *Botni qo'shish*\n` +
                `   • Administratorlarni qo'shish tugmasini bosing\n` +
                `   • Qidiruv maydoniga bot nomini kiriting:\n` +
                `     \`@${ctx.botInfo.username}\`\n\n` +
                `4️⃣ *Admin huquqlarini berish*\n` +
                `   • Botni tanlang va unga quyidagi ruxsatlarni bering:\n` +
                `     ✅ Postlarni tahrirlash\n` +
                `     ✅ Postlarni yuborish\n` +
                `   • So'ngra "Saqlash" tugmasini bosing\n\n` +
                `5️⃣ *Tasdiqlash*\n` +
                `   • Bot endi sizning kanalingizda faol bo'lib,\n` +
                `     o'z vazifalarini bajara oladi\n\n` +
                `🔗 *Qulaylik uchun tugmani bosing:*\n` +
                `   [Admin qilish uchun bosing](http://t.me/${ctx.botInfo.username}?startgroup=new)`,
                {
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                }
            );

            await ctx.reply(
                `Endi quyidagi menyudan foydalanishingiz mumkin:`,
                Markup.keyboard([
                    ['📋 Bot haqida', '📞 Bog\'lanish'],
                    ['❓ Yordam']
                ])
                .resize()
            );
        } else {
            await ctx.reply(
                `Iltimos, avval @${CHANNEL_USERNAME} kanaliga obuna bo'ling.`,
                Markup.inlineKeyboard([
                    Markup.button.url('Obuna bo\'lish', `https://t.me/${CHANNEL_USERNAME}`),
                    Markup.button.callback('Obunani qayta tasdiqlash', 'verify_subscription')
                ])
            );
        }
    } catch (error) {
        console.error('Obunani tekshirishda xatolik:', error);
        await ctx.reply('Obunani tekshirishda xatolik yuz berdi.');
    }
});

bot.hears('📋 Bot haqida', async (ctx) => {
    await ctx.reply('Bu bot kanalga avtomatik tag qo\'shish uchun mo\'ljallangan.');
});

bot.hears('📞 Bog\'lanish', async (ctx) => {
    await ctx.reply('Biz bilan bog\'lanish uchun @damirbekx ga murojaat qiling.');
});

bot.hears('❓ Yordam', async (ctx) => {
    await ctx.reply(
        'Yordam kerakmi? Kanalga obuna bo\'lish va botni qanday ishlatishni yuqoridagi ko\'rsatmalar orqali bilib olishingiz mumkin.'
    );
});

bot.on('channel_post', async (ctx) => {
    try {
        const channelId = ctx.channelPost.chat.id;
        const messageId = ctx.channelPost.message_id;
        const originalText = ctx.channelPost.text || '';

        const chat = await ctx.telegram.getChat(channelId);
        const channelUsername = chat.username ? `@${chat.username}` : chat.title;

        await ctx.telegram.editMessageText(
            channelId,
            messageId,
            undefined,
            `${originalText}\n\n${channelUsername}`
        );

        console.log(`Post tahrirlandi, kanal: ${channelUsername}`);
    } catch (error) {
        console.error('Kanal postini tahrirlashda xatolik:', error);
    }
});

bot.launch()
    .then(() => console.log('Bot ishga tushdi!'))
    .catch((err) => console.error('Botni ishga tushirishda xatolik:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

