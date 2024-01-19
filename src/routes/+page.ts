import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ fetch }) => {
    const [board, splash] = await Promise.all([
        fetch("/board").then(x => x.json()),
        fetch("/splash").then(x => x.json()),
    ]);
    return { board, splash: splash.splash };
}