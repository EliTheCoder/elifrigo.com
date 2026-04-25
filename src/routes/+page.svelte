<script lang="ts">
    import { Chessground } from "svelte-chessground";
    import type { PageData } from "./$types";
	import { Chess, SQUARES } from "chess.js";
    import type { Config } from "chessground/config";
    import type { Key } from "chessground/types";
    import MediaQuery from "svelte-media-queries";
    import moment from "moment";
    import { onMount } from "svelte";
    export let data: PageData;

    let { fen, timestamp } = data.board;
    let now = Date.now();

    onMount(() => {
        const ticker = setInterval(() => { now = Date.now(); }, 10000);
        return () => clearInterval(ticker);
    });

    $: timeAgo = (() => { now; return moment(timestamp).fromNow(); })();

    async function move(from: Key, to: Key) {
        const res = await fetch("/board", {
            method: "POST",
            body: JSON.stringify({ from, to }),
        })

        if (!res.ok) {
            fen = (await (await fetch("/board")).json()).fen;
        } else {
            const data = await res.json();
            fen = data.fen;
            timestamp = data.timestamp;
            now = Date.now();
        }
    }

    const chess = new Chess(fen);
    $: chess.load(fen);

    const dests = new Map();
    SQUARES.forEach(square => {
        const ms = chess.moves({ square, verbose: true });
        if (ms.length > 0) dests.set(square, ms.map(m => m.to));
    });

    let config: Config = {
        coordinates: false,
        premovable: { enabled: false },
        lastMove: data.board.lastMove ? [data.board.lastMove.from, data.board.lastMove.to] : undefined,
        movable: {
            free: false,
            events: { after: move },
            dests,
        }
    };
    if (chess.turn() === "w" && !chess.isGameOver()) {
        config.movable!.color = "white";
    } else {
        config.movable!.color = undefined;
    }
    const orientation = data.black ? "black" : "white";
    if (data.black) {
        config.movable!.color = "both";
    }


</script>

<svelte:head>
    <title>Eli Frigo</title>
</svelte:head>

<MediaQuery query="(max-width: 480px)" let:matches>
    <div class="container" class:mobile={matches} class:desktop={!matches}>
        <div class=center>
            <h1 class="name">Eli Frigo</h1>
            <h2>{@html data.splash}</h2>
            <div>
                <h3 style:display="inline-block"><a href="mailto:eli@elifrigo.com">eli@elifrigo.com</a></h3>
                &nbsp;
                <h3 style:display="inline-block"><a href="https://github.com/EliTheCoder">github/EliTheCoder</a></h3>
            </div>
        </div>
        <div class=center style:max-width="512px">
            <Chessground {config} {fen} {orientation} />
            <p class="timestamp">last move <span class="timeago">{timeAgo}</span></p>
        </div>
    </div>
</MediaQuery>

<style>
    a {
        color: rgba(255, 255, 255, 0.65);
        text-decoration: none;
        transition: color 0.15s ease;
    }
    a:hover {
        color: rgba(255, 255, 255, 0.95);
    }
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
    }
    .container {
        height: 100%;
        display: grid;
    }
    .desktop {
        grid-auto-rows: 100%;
        grid-template-columns: 1fr 1fr;
    }
    .mobile {
        grid-auto-columns: 100%;
        grid-template-rows: 1fr 1fr;
    }
    .name {
        font-size: 5rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: rgba(255, 255, 255, 0.97);
        margin-bottom: 0.15em;
    }
    :global(h2) {
        font-size: 1.1rem;
        font-weight: 400;
        font-style: italic;
        color: rgba(255, 255, 255, 0.65);
        line-height: 1.5;
        margin-bottom: 1rem;
    }
    :global(h3) {
        font-size: 0.85rem;
        font-weight: 400;
        letter-spacing: 0.03em;
    }
    .timestamp {
        margin-top: 0.75rem;
        font-size: 0.78rem;
        color: rgba(255, 255, 255, 0.3);
        letter-spacing: 0.05em;
        font-style: normal;
    }
    .timeago {
        color: rgba(255, 255, 255, 0.55);
        font-style: italic;
    }
</style>