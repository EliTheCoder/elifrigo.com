import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ fetch }) => {
    return {
        fen: await (await fetch("/board")).text()
    }
}