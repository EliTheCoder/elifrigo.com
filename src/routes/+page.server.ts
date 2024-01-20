import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    return {
        black: cookies.get("black"),
        splash: (await (await fetch("/splash")).json()).splash,
    };
}
