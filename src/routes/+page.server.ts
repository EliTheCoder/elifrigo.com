import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    return {black: cookies.get("black")};
}