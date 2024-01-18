<script lang="ts">
    import { Chessground } from "svelte-chessground";
    import type { PageData } from "./$types";
	import { Chess, SQUARES } from "chess.js";
    import type { Config } from "chessground/config";
    import type { Key } from "chessground/types";
    import moment from "moment";
    export let data: PageData;

    let { fen } = data;

    async function move(from: Key, to: Key) {
        const res = await fetch("/board", {
            method: "POST",
            body: JSON.stringify({ from, to }),
        })

        if (!res.ok) {
            fen = (await (await fetch("/board")).json()).fen;
        } else {
            fen = (await res.json()).fen;
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
        premovable: { enabled: false },
        lastMove: data.lastMove ? [data.lastMove.from, data.lastMove.to] : undefined,
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


</script>

<svelte:head>
    <title>Eli Frigo</title>
</svelte:head>

<div class="container">
    <div class=center>
        <h1 class="name">Eli Frigo</h1>
        <h2>Simple is better</h2>
        <h3><a href="mailto:eli@elifrigo.com">eli@elifrigo.com</a></h3>
    </div>
    <div class=center style:max-width="512px">
        <Chessground {config} {fen} />
        <h2>Last move was {moment(data.time).fromNow()}</h2>
    </div>
</div>

<style>
    a {
        color: white;
    }
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .container {
        height: 100%;
        display: grid;
        grid-auto-rows: 100%;
        grid-template-columns: 1fr 1fr;
    }
    .name {
        font-size: 80px;
    }
</style>