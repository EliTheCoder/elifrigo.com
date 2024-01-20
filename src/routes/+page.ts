import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ fetch, cookies, data }) => {
    return {
        board: await (await fetch("/board")).json(),
        splash: data.splash,
        black: data.black,
    };
}