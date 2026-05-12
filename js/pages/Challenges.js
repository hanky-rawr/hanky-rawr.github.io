import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchChallengesList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown", admin: "user-gear", helper: "user-shield",
    dev: "code", trial: "user-lock", "owner / dev": "crown", editor: "video",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list && list.length">
                    <tr v-for="([level, err], i) in list" :key="i">
                        <td class="rank">
                            <p class="type-label-lg">#{{ i + 1 }}</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    
                    <ul class="stats">
                        <li>
                            <div class="type-label-md">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li v-if="level.password">
                            <div class="type-label-md">Password</div>
                            <p>{{ level.password }}</p>
                        </li>
                    </ul>

                    <div class="records-section">
                        <h2 class="type-label-lg" style="margin-bottom: 15px;">Récords</h2>
                        <table class="records" style="width: 100%; border-spacing: 0 10px;">
                            <tr v-for="record in level.records">
                                <td class="user">
                                    <a :href="record.link" target="_blank" class="type-label-lg">
                                        {{ record.user }}
                                    </a>
                                </td>
                                <td class="hz" style="text-align: right;">
                                    <p>{{ record.hz }}Hz</p>
                                </td>
                            </tr>
                        </table>
                        <p v-if="!level.records || level.records.length == 0" class="type-label-md">
                            No hay récords para este challenge aún.
                        </p>
                    </div>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p class="type-label-lg">Selecciona un challenge para ver los detalles</p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return (this.list && this.list[this.selected]) ? this.list[this.selected][0] : null;
        }
    },
    async mounted() {
        this.list = await fetchChallengesList();
        this.editors = await fetchEditors();
        this.loading = false;
    },
    methods: { embed, score },
};
