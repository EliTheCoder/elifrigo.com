import { error, type RequestHandler } from "@sveltejs/kit";
import { readFile, writeFile } from "fs/promises";
import { Chess } from "chess.js";

export const GET: RequestHandler = async () => {
    try {
        return new Response(await readFile("chessboard.fen", { encoding: "utf-8" }));
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
        chess.move(await request.text());
    } catch {
        return error(400, "Illegal move")
    }

    const newFen = chess.fen();
    try {
        writeFile("chessboard.fen", newFen);
    } catch {
        return error(500, "Couldn't save chessboard.fen")
    }

    return new Response(newFen);
};