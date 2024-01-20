import { error, json, type RequestHandler } from "@sveltejs/kit";
import { readFile, stat, writeFile } from "fs/promises";

export const GET: RequestHandler = async () => json(JSON.parse(await readFile("data.json")));

export const POST: RequestHandler = async ({ request }) => {
    const data = JSON.parse(await readFile("data.json"));
    if (Date.now() - data.timestamp < 600_000) error(400, "You can only make a move every 10 minutes");
    const move = await request.json();
    if (!move.color) error(400, "You must specify a color");
    if (Number.isNaN(move.x)) error(400, "You must specify an x");
    if (Number.isNaN(move.y)) error(400, "You must specify a y");
    if (!["black", "white"].includes(move.color)) error(400, "Invalid color");
    if (move.x < 0 || move.x >= 20) error(400, "Out of bounds x");
    if (move.y < 0 || move.y >= 20) error(400, "Out of bounds y");

    data.board[move.y][move.x] = move.color;
    data.timestamp = Date.now();

    writeFile("data.json", JSON.stringify(data));

    return json(data)
};