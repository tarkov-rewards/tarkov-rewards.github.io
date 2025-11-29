import fs from "fs/promises";
import tasks from "../src/lib/quests-data.json";


async function main() {
	const quests: Record<string, any> = {};

	for (const task of tasks) {
        if (quests[task.name]) {
            console.warn(`Duplicate quest name detected: ${task.name}`);
        }

		quests[task.name] = {
			name: task.name,
			lvl: task.minPlayerLevel || 0,
			trader: task.trader.name || 'unknown'
		};
	}

    
  await fs.writeFile(
    "src/lib/quests.json",
    JSON.stringify(quests, null, 2),
    "utf-8"
  );


	const unlocks: Record<string, any> = {};

	for (const task of tasks) {
		const crafts = task.finishRewards?.craftUnlock.map((cu) => cu.rewardItems).flat() ?? [];

		for (const craftUnlock of crafts) {
			const name = `Craft: ${craftUnlock.item.name}`;
			unlocks[name] = {
				name,
				wiki: craftUnlock.item.wikiLink,
			};
		}

		for (const offerUnlock of task.finishRewards?.offerUnlock ?? []) {
			const name = `${offerUnlock.trader.name} ${offerUnlock.level}: ${offerUnlock.item.name}`;
			unlocks[name] = {
				name,
				wiki: offerUnlock.item.wikiLink,
			};
		}
	}

  await fs.writeFile(
    "src/lib/unlocks.json",
    JSON.stringify(unlocks, null, 2),
    "utf-8"
  );
}

(async () => {
  await main();
})();
