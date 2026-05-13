import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <div class="board-wrapper">
                        <table class="board">
                            <tr v-for="(ientry, i) in leaderboard" :key="i" :class="{
                                'rank-1': i === 0,
                                'rank-2': i === 1,
                                'rank-3': i === 2,
                                'active': selected === i
                            }">
                                <td class="rank">
                                    <p class="type-label-lg">#{{ i + 1 }}</p>
                                </td>
                                <td class="total">
                                    <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                                </td>
                                <td class="user" :class="{ 'active': selected === i }">
                                    <button @click="selected = i">
                                        <span class="type-label-lg">{{ ientry.user }}</span>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div class="player-container">
                        <div class="player" v-if="leaderboard.length > 0">
                            <h1>#{{ selected + 1 }} {{ leaderboard[selected].user }}</h1>
                            <h3>{{ localize(leaderboard[selected].total) }} points</h3>
                            
                            <h2 v-if="leaderboard[selected].completed.length > 0">
                                Completed ({{leaderboard[selected].completed.length}})
                            </h2>
                            <table class="table" v-if="leaderboard[selected].completed.length > 0">
                                <tr v-for="score in leaderboard[selected].completed">
                                    <td class="rank"><p>#{{ score.rank }}</p></td>
                                    <td class="level">
                                        <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    </td>
                                    <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                </tr>
                            </table>

                            <h2 v-if="leaderboard[selected].challenges && leaderboard[selected].challenges.length > 0">
                                Challenges ({{leaderboard[selected].challenges.length}})
                            </h2>
                            <table class="table" v-if="leaderboard[selected].challenges && leaderboard[selected].challenges.length > 0">
                                <tr v-for="score in leaderboard[selected].challenges">
                                    <td class="rank"><p>#{{ score.rank }}</p></td>
                                    <td class="level">
                                        <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    </td>
                                    <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                </tr>
                            </table>

                            <h2 v-if="leaderboard[selected].progressed.length > 0">
                                Progressed ({{leaderboard[selected].progressed.length}})
                            </h2>
                            <table class="table" v-if="leaderboard[selected].progressed.length > 0">
                                <tr v-for="score in leaderboard[selected].progressed">
                                    <td class="rank"><p>#{{ score.rank }}</p></td>
                                    <td class="level">
                                        <a class="type-label-lg" target="_blank" :href="score.link">{{ score.percent }}% {{ score.level }}</a>
                                    </td>
                                    <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `,
    async mounted() {
        document.body.classList.add('gold-theme');
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;
    },
    unmounted() {
        document.body.classList.remove('gold-theme');
    },
    methods: {
        localize,
    },
};
