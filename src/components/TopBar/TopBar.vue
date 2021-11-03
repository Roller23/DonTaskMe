<template>
	<div class="bar">
		<AtlassianMenu />
		<div id="funcTabs" ref="funcTabs">
			<Tab
				class="tab"
				v-for="tab in tabs"
				:name="tab.name"
				:key="tab.id"
				:dropShowing="tab.isDropShown"
				@click="showDrop(tab)"
				:ref="setTabRef(tabs[tab.id])"
			>
				<component :is="tab.comp" class="tab-pop-over" />
			</Tab>
		</div>
		<div id="moreTabs">
			<Tab
				class="tab"
				v-if="moreTabs.moreTab.tabsFolded.length > 0"
				:name="moreTabs.moreTab.name"
				:dropShowing="moreTabs.moreTab.isDropShown"
				@click="showDrop(moreTabs.moreTab)"
				:ref="setTabRef(moreTabs.moreTab)"
			>
				<MorePopover class="tab-pop-over" />
			</Tab>
			<Tab
				class="tab"
				:name="
					moreTabs.moreTab.tabsFolded.length > 0
						? '+'
						: moreTabs.createTab.name
				"
				:dropShowing="moreTabs.createTab.isDropShown"
				arrowDown="false"
				@click="showDrop(moreTabs.createTab)"
				:ref="setTabRef(moreTabs.createTab)"
			>
				<CreatePopover class="tab-pop-over" />
			</Tab>
		</div>
		<div id="rightTabs">
			<input class="tab" />
			<Tab>b</Tab>
			<Tab>konto</Tab>
		</div>
	</div>
</template>

<script>
import AtlassianMenu from "./Tabs/AtlassianMenu.vue";
import Tab from "./Tabs/Tab.vue";
import WorkspacePopover from "./Popovers/WorkspacePopover.vue";
import RecentBoardsPopover from "./Popovers/RecentBoardsPopover.vue";
import StarredBoardsPopover from "./Popovers/StarredBoardsPopover.vue";
import TemplatesPopover from "./Popovers/TemplatesPopover.vue";
import MorePopover from "./Popovers/MorePopover.vue";
import CreatePopover from "./Popovers/CreatePopover.vue";

export default {
	data() {
		return {
			breakPoints: [],
			tabs: [
				{
					name: "Przestrzenie robocze",
					id: 0,
					comp: "WorkspacePopover",
					isDropShown: false,
				},
				{
					name: "Ostatnie",
					id: 1,
					comp: "RecentBoardsPopover",
					isDropShown: false,
				},
				{
					name: "Oznaczone gwiazdką",
					id: 2,
					comp: "StarredBoardsPopover",
					isDropShown: false,
				},
				{
					name: "Szablony",
					id: 3,
					comp: "TemplatesPopover",
					isDropShown: false,
				},
			],
			moreTabs: {
				moreTab: {
					name: "Więcej",
					id: 4,
					comp: "MorePopover",
					isDropShown: false,
					tabsFolded: [],
				},
				createTab: {
					name: "Utwórz",
					id: 5,
					comp: "CreatePopover",
					isDropShown: false,
				},
			},
			tabRefs: [],
		};
	},
	components: {
		AtlassianMenu,
		Tab,
		WorkspacePopover,
		RecentBoardsPopover,
		StarredBoardsPopover,
		TemplatesPopover,
		MorePopover,
		CreatePopover,
	},
	methods: {
		showDrop(ref) {
			this.tabRefs.forEach((t) => (t.isDropShown = false));
			this.tabRefs.find((t) => t.id == ref.id).isDropShown = true;
		},
		detectWrap() {
			var moreTab = document.getElementById("moreTabs").lastElementChild;
			var weirdTab = document.getElementById("rightTabs");
			var functabs = this.$refs.funcTabs;
			var marginWeird = parseInt(
				window.getComputedStyle(weirdTab).marginLeft,
				10
			);
			if (
				(functabs.offsetTop > 30 ||
					moreTab.offsetTop > 30 ||
					weirdTab.offsetTop > 30 ||
					marginWeird < 15) &&
				this.tabs.length > 0
			) {
				let toFold = this.tabs.pop();
				toFold.isDropShown = false;
				this.moreTabs.moreTab.tabsFolded.push(toFold);
				this.breakPoints.push(window.innerWidth);
			} else if (this.moreTabs.moreTab.tabsFolded.length > 0) {
				let currWidth = window.innerWidth;
				if (currWidth > this.breakPoints[this.breakPoints.length - 1]) {
					let toUnfold = this.moreTabs.moreTab.tabsFolded.pop();
					this.tabs.push(toUnfold);
					this.breakPoints.pop();
				}
			}
		},
		setTabRef(el) {
			if (el) {
				this.tabRefs.push(el);
			}
		},
	},
	beforeUpdate() {
		this.tabRefs = [];
	},
	mounted() {
		window.addEventListener("resize", this.detectWrap);
	},
};
</script>

<style>
.bar {
	backdrop-filter: blur(2px);
	height: 50px;
	color: white;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
}

.bar .tab {
	height: 35px;
	width: auto;
	background: rgba(0, 0, 0, 0);
	color: white;
	border-radius: 5px;
	position: relative;
	padding: 5px 5px;
	display: flex;
	align-items: center;
}

.bar .tab:hover {
	background-color: rgba(128, 128, 128, 0.616);
}

#moreTabs {
	display: flex;
}

#rightTabs {
	display: flex;
	margin-left: auto;
}

#funcTabs {
	display: flex;
}

.tab-pop-over {
	position: absolute;
	bottom: 0;
	transform: translateY(110%);
	width: 300px;
	height: auto;
	background-color: white;
	color: #5e6c84;
}
</style>
