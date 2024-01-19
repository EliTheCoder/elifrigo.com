import { text, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, params }) => {
    cookies.set("black", params.key, { path: "/", maxAge: 60*60*24*400 });
    return text(`Set your cookie to ${params.key}`);
};