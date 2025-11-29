<script lang="ts">
	import { stopPropagation } from 'svelte/legacy';
	import Quest from './Quest.svelte';
	import type { Quest as QuestT } from './types';

	export const {
		name,
		trader,
		quest,
		expanded,
		icon,
		wiki,
		expand
	}: {
		name: string;
		trader: string;
		quest: QuestT;
		icon?: string;
		wiki?: string;
		expanded: boolean;
		expand: () => void;
	} = $props();

	let questsCount = $derived.by(() => {
		let count = 1;

		let quests = [quest];

		while (quests.length > 0) {
			const current = quests.pop();
			if (current) {
				for (const prereq of current.prerequisites) {
					count += 1;
					quests.push(prereq);
				}
			}
		}

		return count;
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class:bg-slate-200={expanded} onclick={expand} class="group cursor-pointer">
	<div class="flex items-center gap-2">
		<img src={icon ?? '#'} alt={name} height="20px" class="h-12" />
		<span class="font-semibold group-hover:underline w-30 text-nowrap">
			{trader}
		</span>
		<span class="w-18 text-nowrap font-semibold group-hover:underline">
			(lv. {quest.lvl})
		</span>
		<span class="font-semibold group-hover:underline">
			{name}
		</span>
		<a
			href={wiki}
			target="_blank"
			class="hover:underline cursor-pointer"
			onclick={(e) => e.stopPropagation()}
		>
			(wiki)
		</a>
	</div>
	{#if expanded}
		<div>Quests: ({questsCount})</div>
		<Quest {quest} />
	{/if}
</div>
