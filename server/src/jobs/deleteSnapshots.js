const cron = require('node-cron');
const Snapshot = require('../models/Snapshot');
const Holder = require('../models/Holders');

cron.schedule('0 0 * * *', async () => {
    const snapshots = await Snapshot.find().select('_id');
    const snapshotIds = snapshots.map(snap => snap._id);

    // Delete holders whose snapshot does not exist
    const result = await Holder.deleteMany({
        snapshot: { $nin: snapshotIds }
    });
});
