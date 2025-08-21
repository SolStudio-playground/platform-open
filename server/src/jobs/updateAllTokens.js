const cron = require('node-cron');
const { updateAllTokens } = require('../actions/fetchTokens');


// Schedule the job to run at midnight on the first day of every month
cron.schedule('0 0 1 * *', async () => {
    console.log('Starting the monthly token update job');
    await updateAllTokens();
    console.log('Monthly token update job completed');
}, {
    scheduled: true,
    timezone: "America/New_York"
});