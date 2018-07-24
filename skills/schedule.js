const https = require('https');

module.exports = (controller) => {
  // Configure bot for sending event webhooks
  const bot = controller.spawn({
    incoming_webhook: {
      url: process.env.SCHEDULE_WEBHOOK,
    },
  });

  // Store the previous event summary
  let previousEventSummary = '';

  // Update notificatons every minute
  setInterval(() => {
    // Get current time
    const date = new Date();
    // Add one minute
    const datePlusOne = new Date(date.getTime() + 60000);

    // Create url to get current event
    const urlEvent = `https://content.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR_ID}/events?maxResults=1&timeMax=${datePlusOne.toISOString()}&timeMin=${date.toISOString()}&timeZone=${process.env.CALENDAR_TIMEZONE}&key=${process.env.CALENDAR_API}`;

    // Get current event
    https.get(urlEvent, (res) => {
      // Handle calendar data
      let output = '';

      res.on('data', (chunk) => { output += chunk; });
      res.on('end', () => {
        // Convert data to object
        const data = JSON.parse(output);

        // Get event
        const event = data.items[0];

        if (event) {
          // If there is an event
          // Get event summary
          const eventSummary = event.summary;

          if (eventSummary !== previousEventSummary) {
            // If event summary is different from previous event summary
            if (eventSummary) {
              // If different events
              // Post new event summary
              bot.sendWebhook({
                text: eventSummary,
              });
            }

            // Update previous event summary reguardless
            previousEventSummary = eventSummary;
          }
        }

        // Log checked events
        console.log('Checked current event');
      });
    }).on('error', (err) => {
      console.error('Errror', err);
    });
    // Update once a minute
  }, 60000);
};
