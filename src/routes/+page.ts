import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ fetch }) => await (await fetch("/board")).json();