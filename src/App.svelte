<script lang="ts">
	import type { Quest, Unlock as UnlockT } from './lib/types';
	import Unlock from './lib/Unlock.svelte';
	import questsData from './lib/quests-data.json';

	const tasks = questsData;

	const questsMap: Record<string, Quest> = {};

	for (const task of questsData) {
		questsMap[task.name] = {
			name: task.name,
			lvl: task.minPlayerLevel || 0,
			wiki: task.wikiLink,
			prerequisites: [],
			trader: task.trader.name || 'unknown'
		};
	}

	// Construct prerequisites

	for (const task of tasks) {
		const quest = questsMap[task.name];

		if (task.taskRequirements?.length > 0) {
			for (const prereqTask of task.taskRequirements) {
				const prereqQuest = questsMap[prereqTask?.task?.name];

				if (prereqQuest) {
					quest.prerequisites.push(prereqQuest);
				}
			}
		}
	}

	const unlocks: Record<string, UnlockT> = {};

	for (const task of tasks) {
		const crafts = task.finishRewards?.craftUnlock.map((cu) => cu.rewardItems).flat() ?? [];

		for (const craftUnlock of crafts) {
			const name = `Craft: ${craftUnlock.item.name}`;
			unlocks[name] = {
				name: craftUnlock.item.name,
				trader: 'Craft',
				wiki: craftUnlock.item.wikiLink,
				icon: craftUnlock.item.inspectImageLink,
				quest: questsMap[task.name],
				categories: craftUnlock.item.categories.map((c) => c.name)
			};
		}

		for (const offerUnlock of task.finishRewards?.offerUnlock ?? []) {
			const name = `${offerUnlock.trader.name} ${offerUnlock.level}: ${offerUnlock.item.name}`;
			unlocks[name] = {
				name: offerUnlock.item.name,
				trader: `${offerUnlock.trader.name} ${offerUnlock.level}`,
				wiki: offerUnlock.item.wikiLink,
				icon: offerUnlock.item.inspectImageLink,
				quest: questsMap[task.name],
				categories: offerUnlock.item.categories.map((c) => c.name)
			};
		}
	}

	const unlockGroupNames = [
		'Common container',
		'Weapon',
		'Sights',
		'Weapon mod',
		'Food and drink',
		'Ammo',
		'Chest rig',
		'Backpack',
		'Armor Plate',
		'Headwear',
		'Face Cover',
		'Armored equipment',
		'Drug',
		'Stimulant',
		'Meds',
		'Item'
	];

	const unlockGroups = unlockGroupNames.map((name) => ({
		name,
		unlocks: [] as UnlockT[]
	}));

	for (const unlock of Object.values(unlocks)) {
		let orphan = true;
		for (const group of unlockGroups) {
			if (unlock.categories.includes(group.name)) {
				group.unlocks.push(unlock);
				orphan = false;
				break;
			}
		}
		if (orphan) console.error(`Orphan unlock: ${unlock.name}`);
	}
	const sortOptions = ['Name', 'Trader', 'Level'];
	let sort = $state('Name');
	let sortKey = $state('asd'); // Yikes but this is neccessary

	$effect(() => console.log('sort changed:', sort));

	$effect(() => {
		console.log(`Sorting by ${sort}`);
		unlockGroups.forEach((g) =>
			g.unlocks.sort((a, b) => {
				if (sort === 'Name') {
					return a.name.localeCompare(b.name);
				} else if (sort === 'Trader') {
					return a.trader.localeCompare(b.trader);
				} else if (sort === 'Level') {
					return a.quest.lvl - b.quest.lvl;
				}
				return 0;
			})
		);
		sortKey = `${sort}-${Math.random()}`;
	});

	let expanded = $state('');

	// const quests: Quest[] = tasks.map((t) => questsMap[t.name]);
</script>

<main>
	<div>
		<span class="font-semibold">Sort: </span>
		<select bind:value={sort} class="mb-4">
			{#each sortOptions as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
	</div>

	{#key sortKey}
		{#each unlockGroups as { name, unlocks }}
			<div class="not-first:mt-8 text-lg font-semibold">{name}</div>
			{#each Object.values(unlocks) as unlock}
				<Unlock
					name={unlock.name}
					trader={unlock.trader}
					quest={unlock.quest}
					wiki={unlock.wiki}
					icon={unlock.icon}
					expanded={unlock.name === expanded}
					expand={() => (expanded = unlock.name === expanded ? '' : unlock.name)}
				/>
			{/each}
		{/each}
	{/key}
</main>
