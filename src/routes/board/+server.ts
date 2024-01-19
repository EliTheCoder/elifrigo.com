import { error, json, type RequestHandler } from "@sveltejs/kit";
import { readFile, stat, writeFile } from "fs/promises";
import { Chess } from "chess.js";

export const GET: RequestHandler = async () => {
    return json(JSON.parse(await readFile("data.json")));
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    const data = JSON.parse(await readFile("data.json"));

    const chess = new Chess(data.fen);
    if (chess.turn() !== "w") error(400, "Not white's turn");
    if (chess.isGameOver()) error(400, "Game is over");
    try {
        const move = chess.move((await request.json()));
        data.lastMove = { from: move.from, to: move.to };
    } catch {
        return error(400, "Illegal move")
    }

    data.fen = chess.fen();
    data.timestamp = Date.now();

    writeFile("data.json", JSON.stringify(data))

    return json(data)
};