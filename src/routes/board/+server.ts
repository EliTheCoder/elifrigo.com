import { error, json, type RequestHandler } from "@sveltejs/kit";
import { readFile, stat, writeFile } from "fs/promises";
import { Chess } from "chess.js";

let lastMove: {from: string, to: string};

export const GET: RequestHandler = async () => {
    try {
        return json({
            fen: await readFile("chessboard.fen", { encoding: "utf-8" }),
            time: (await stat("chessboard.fen")).mtimeMs,
            lastMove,
        });
    } catch {
        return error(500, "Couldn't open chessboard.fen");
    }
};

export const POST: RequestHandler = async ({ request }) => {
    let fen: string;
    try {
        fen = await readFile("chessboard.fen", { encoding: "utf-8" });
    } catch {
        return error(500, "Couldn't open chessboard.fen");
    }

    const chess = new Chess(fen);
    if (chess.turn() !== "w") return error(400, "Not white's turn");
    if (chess.isGameOver()) return error(400, "Game is over");
    try {
        const move = chess.move((await request.json()));
        lastMove = { from: move.from, to: move.to };
    } catch {
        return error(400, "Illegal move")
    }

    fen = chess.fen();
    try {
        writeFile("chessboard.fen", fen);
    } catch {
        return error(500, "Couldn't save chessboard.fen")
    }

    return json({ fen })
};