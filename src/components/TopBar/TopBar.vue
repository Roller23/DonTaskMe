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
				v-if="moreTab.tabsFolded.length > 0"
				:name="moreTab.name"
				:dropShowing="moreTab.isDropShown"
				@click="showDrop(moreTab)"
				:ref="setTabRef(moreTab)"
			>
				<MoreTab class="tab-pop-over" />
			</Tab>
			<Tab
				class="tab"
				:name="moreTab.tabsFolded.length > 0 ? '+' : 'Utwórz'"
				:dropShowing="moreTab.isDropShown"
				@click="showDrop(moreTab)"
				:ref="setTabRef(moreTab)"
			>
			</Tab>
		</div>
		<div id="rightTabs">
			<Tab>a</Tab>
			<Tab>b</Tab>
			<Tab>konto</Tab>
		</div>
	</div>
</template>

<script>
import AtlassianMenu from "../AtlassianMenu.vue";
import Tab from "./Tab.vue";

const WorkspaceTab = {
	data() {
		return {
			title: "Przestrzenie robocze",
		};
	},
	render() {
		return <div> {this.title}</div>;
	},
};

const RecentBoardsTab = {
	data() {
		return {
			title: "Ostatnie Tablice",
		};
	},
	render() {
		return <div> {this.title}</div>;
	},
};

const StarredBoardsTab = {
	data() {
		return {
			title: "Oznaczone Tablice",
		};
	},
	render() {
		return <div> {this.title}</div>;
	},
};

const TemplatesTab = {
	data() {
		return {
			title: "Szablony",
		};
	},
	render() {
		return <div> {this.title}</div>;
	},
};

const MoreTab = {
	data() {
		return {
			title: "Więcej",
			tabsFolded: [],
		};
	},
	render() {
		return <div> {this.title}</div>;
	},
};

export default {
	data() {
		return {
			breakPoints: [],
			tabs: [
				{
					name: "Przestrzenie robocze",
					id: 0,
					comp: "WorkspaceTab",
					isDropShown: false,
				},
				{
					name: "Ostatnie",
					id: 1,
					comp: "RecentBoardsTab",
					isDropShown: false,
				},
				{
					name: "Oznaczone gwiazdką",
					id: 2,
					comp: "StarredBoardsTab",
					isDropShown: false,
				},
				{
					name: "Szablony",
					id: 3,
					comp: "TemplatesTab",
					isDropShown: false,
				},
			],
			moreTab: {
				name: "Więcej",
				id: 4,
				comp: "MoreTab",
				isDropShown: false,
				tabsFolded: [],
			},
			tabRefs: [],
		};
	},
	components: {
		AtlassianMenu,
		Tab,
		WorkspaceTab,
		RecentBoardsTab,
		StarredBoardsTab,
		TemplatesTab,
		MoreTab,
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
					marginWeird < 15) &&
				this.tabs.length > 0
			) {
				let toFold = this.tabs.pop();
				toFold.isDropShown = false;
				this.moreTab.tabsFolded.push(toFold);
				this.breakPoints.push(window.innerWidth);
			} else if (this.moreTab.tabsFolded.length > 0) {
				let currWidth = window.innerWidth;
				if (currWidth > this.breakPoints[this.breakPoints.length - 1]) {
					let toUnfold = this.moreTab.tabsFolded.pop();
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
	flex-wrap: wrap;
	flex-direction: row;
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

* {
	border: 1 px red solid;
}
</style>
