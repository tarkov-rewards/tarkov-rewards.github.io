import questsData from "./quests-data.json"

export type Quest = {
	name: string;
	trader: string;
	lvl: number;
	wiki?: string;
	prerequisites: Quest[];
}

export type Unlock = {
	name: string;
	trader: string;
	wiki?: string;
	icon?: string;
	categories: string[];
	quest: Quest;
}

// import _quests from "./quests.json"

// // export type Quest = typeof quests[keyof typeof quests];


// // const q: Quest = {
// // 	name: "Test Quest",
// // 	trader: "asd",
// // 	lvl: 1,
// // }

// type Keys = keyof typeof _quests;
// export type Quest = typeof _quests[Keys] & {
// 	prerequisites: Quest[];
// };

// const quests = (_quests as unknown as Record<string, Quest>).map((quest)=> ({}));

// for (const task of questsData) {
// 	const quest = quests[task.name];

// 	if (task.taskRequirements?.length > 0) {
// 		for (const prereqTask of task.taskRequirements) {
// 			const prereqQuest = questsMap[prereqTask?.task?.name];

// 			if (prereqQuest) {
// 				quest.prerequisites.push(prereqQuest);
// 			}
// 		}
// 	}
// }
