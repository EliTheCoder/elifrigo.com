import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ fetch, data }) => {
    const place = await (await fetch("/place")).json();
    return { place, splash: data.splash };
}