import * as CONFIG from './config';
import { login } from './qbittorrent/auth';
import { getTorrents, addTorrent, getTrackers, reannounce } from './qbittorrent/api'
import { sleep } from './utilities';
//CONFIG

module.exports = async (args: string[]) => {

    const path = args[3];
    const infohash = args[0];
    let t1 = Date.now();
    try {
        await login();
    } catch (error) {
        console.log(`Failed to login. Exiting...`);
        process.exit(1);
    }
    let t2 = Date.now();
    console.log(`[AUTH] Login completed in ${((t2 - t1) / 1000).toFixed(2)} seconds.`)
    // console.log(path);
    // console.log("Getting torrents");
    // getTorrents();
    await addTorrent(path);
    // console.log(`Sleeping for 5 sec`);
    //Wait 5 sec for initial announce
    await sleep(5000);
    console.log("[ADD TORRENT] Getting trackers");
    //We heed to get, and reannounce while we not have a working one.
    let attempts = 0;
    const WAIT_TIME = 5000; //In milliseconds
    const ATTEMPT_LIMIT = 50;

    while (attempts < ATTEMPT_LIMIT) {

        console.log(`[REANNOUNCE] Querying tracker status...`);
        
        try {
            let trackers: any[] = await getTrackers(infohash);
            trackers.splice(0, 3);
            let working = trackers.some(tracker => tracker.status === 2);

            if (!working) {
                //We need to reannounce
                console.log('[REANNOUNCE] Need to reannounce. Sending request and sleeping...');
                await reannounce(infohash);
                await sleep(WAIT_TIME);
                attempts++;
            } else {
                console.log('[REANNOUNCE] Tracker is OK. Exiting...');
                // await reannounce(infohash);
                // await sleep(WAIT_TIME);
                // attempts++;
                //we gucci
                break;
            }

            // console.log(trackers);
        } catch (error) {
            console.log(error);
            break;
        }
    }
    // console.log("Ok we done");
}