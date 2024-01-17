<script lang="ts">
    import { Chessground } from "svelte-chessground";
    import type { PageData } from "./$types";
	import { Chess, SQUARES } from "chess.js";
    import type { Config } from "chessground/config";
    import type { Key } from "chessground/types";
    export let data: PageData;

    let { fen } = data;

    async function move(orig: Key, dest: Key) {
        const res = await fetch("/board", {
            method: "POST",
            body: `${orig}${dest}`,
        })
        if (!res.ok) {
            const newFen = await (await fetch("/board")).text();
            chess.load(newFen);
            fen = newFen;
        } else {
            const newFen = await res.text();
            chess.load(newFen);
            fen = newFen
        }
    }

    const chess = new Chess(fen);

    const dests = new Map();
    SQUARES.forEach(square => {
        const ms = chess.moves({ square, verbose: true });
        if (ms.length > 0) dests.set(square, ms.map(m => m.to));
    });

    let config: Config = {
        premovable: { enabled: false },
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

<p>beans</p>
<div style="max-width: 512px">
    <Chessground {config} {fen} />
</div>