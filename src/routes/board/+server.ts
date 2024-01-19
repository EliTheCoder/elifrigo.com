import { error, json, type RequestHandler } from "@sveltejs/kit";
import { readFile, stat, writeFile } from "fs/promises";
import { Chess } from "chess.js";
import { BLACK_KEY, CHESS_WEBHOOK } from "$env/static/private";

export const GET: RequestHandler = async () => {
    return json(JSON.parse(await readFile("data.json")));
};

export const POST: RequestHandler = async ({ request, cookies }) => {
    const data = JSON.parse(await readFile("data.json"));

    const chess = new Chess(data.fen);
    if (chess.turn() !== "w" && cookies.get("black") !== BLACK_KEY) error(400, "Not white's turn");
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

    await fetch(CHESS_WEBHOOK, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: "```" + chess.ascii() + "```" })
    });

    return json(data)
};