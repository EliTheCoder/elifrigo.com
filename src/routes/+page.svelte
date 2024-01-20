<script lang="ts">
    import { onMount } from "svelte";
    import { invalidate } from "$app/navigation"
    import type { PageData } from "./$types";
    import MediaQuery from "svelte-media-queries";
    export let data: PageData;

    function selectCell(event: MouseEvent) {
        if (timer > 0) return;
        let coords: string[] = [];
        if (event.target instanceof HTMLDivElement) {
            coords = event.target.parentElement!.id.split("-");
        } else if (event.target instanceof HTMLTableCellElement) {
            coords = event.target.id.split("-");
        }
        if (coords.length < 3) return;
        const y = parseInt(coords[1]);
        const x = parseInt(coords[2]);
        data.place.board[y][x] = data.place.board[y][x] === "black" ? "white" : "black";
        data.place.timestamp = Date.now();
        fetch("/place", {
            method: "POST",
            body: JSON.stringify({ x, y, color: data.place.board[y][x] }),
        });
    }

    let timer = (data.place.timestamp + 600000 - Date.now())/1000;
    $: minutes = Math.max(0, Math.floor(timer / 60));
    $: seconds = Math.max(0, Math.floor(timer % 60));
    $: countdown = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    onMount(() => {
        setInterval(() => {
            timer = (data.place.timestamp + 600000 - Date.now())/1000
        }, 1000)
        setInterval(() => {
            if (timer <= 0) invalidate("/place");
        }, 2000);
    })
</script>

<svelte:head>
    <title>Eli Frigo</title>
</svelte:head>

<MediaQuery query="(max-width: 480px)" let:matches>
    <div class="container" class:mobile={matches} class:desktop={!matches}>
        <div class="center">
            <h1 class="name">Eli Frigo</h1>
            <h2>{@html data.splash}</h2>
            <div>
                <h3 style:display="inline-block">
                    <a href="mailto:eli@elifrigo.com">eli@elifrigo.com</a>
                </h3>
                &nbsp;
                <h3 style:display="inline-block">
                    <a href="https://github.com/EliTheCoder">github/EliTheCoder</a>
                </h3>
            </div>
        </div>
        <div class="center" style:max-width="512px">
            <table style:width="100%">
                {#each data.place.board as row, i}
                    <tr>
                        {#each row as cell, j}
                            <td on:click={selectCell} id="cell-{i}-{j}" class:selectable={timer <= 0}>
                                <div class="cell"  style="background-color: {cell == "black" ? "#0c0c0c" : cell}"></div>
                            </td>
                        {/each}
                    </tr>
                {/each}
            </table>
            <h2>{countdown}</h2>
        </div>
    </div>
</MediaQuery>

<style>
    a {
        color: white;
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
        font-size: 80px;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
        padding: 0;
    }
    .cell {
        border: 2px solid transparent;
        aspect-ratio: 1 / 1;
    }
    .selectable:hover div {
        border-color: white;
    }
</style>
