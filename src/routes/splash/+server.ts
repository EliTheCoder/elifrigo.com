import { error, json, type RequestHandler } from "@sveltejs/kit";
import { readFile } from "fs/promises";

export const GET: RequestHandler = async () => {
    return json({
        splash: await readFile("splash.txt", { encoding: "utf-8" })
    });
};