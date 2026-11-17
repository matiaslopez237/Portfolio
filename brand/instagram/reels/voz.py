# HU-15: genera la voz de Hefesto con edge-tts (voz neural gratuita, es-AR) y el tiempo de cada palabra.
# Uso: py brand/instagram/reels/voz.py <guion.json> <id-del-reel> <carpeta-salida>
# Escribe voz.mp3 y palabras.json ([{texto, inicio, fin}] en segundos).
import asyncio, json, sys, edge_tts

guion_path, reel_id, salida = sys.argv[1], sys.argv[2], sys.argv[3]
reel = next(r for r in json.load(open(guion_path, encoding="utf-8"))["reels"] if r["id"] == reel_id)
texto = " ".join(l["texto"] for l in reel["lineas"])

async def main():
    com = edge_tts.Communicate(texto, reel.get("voz", "es-AR-TomasNeural"), rate=reel.get("velocidad", "+0%"), boundary="WordBoundary")
    palabras = []
    with open(f"{salida}/voz.mp3", "wb") as f:
        async for parte in com.stream():
            if parte["type"] == "audio":
                f.write(parte["data"])
            elif parte["type"] == "WordBoundary":
                ini = parte["offset"] / 1e7
                palabras.append({"texto": parte["text"], "inicio": round(ini, 3), "fin": round(ini + parte["duration"] / 1e7, 3)})
    json.dump(palabras, open(f"{salida}/palabras.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"{len(palabras)} palabras, {palabras[-1]['fin']:.1f} s")

asyncio.run(main())
