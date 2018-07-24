module.exports = (controller) => {
  const bot = controller.spawn({
    incoming_webhook: {
      url: process.env.SCHEDULE_WEBHOOK,
    },
  });
  setInterval(() => {
    bot.sendWebhook({
      text: 'This is working',
    });
  }, 5000);
};
