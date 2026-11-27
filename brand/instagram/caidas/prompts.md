# Prompts para los clips de tensión (HU-18)

Se generan con los créditos gratis de una web de video con IA (Kling, Hailuo u otra), con la cuenta de Matias.
Los prompts van en inglés porque los modelos los entienden mejor. El look de cámara de seguridad ("CAM 02 ● REC", hora, grano) lo agrega el armador después: **no** se le pide texto al modelo.

## Cómo generarlos
- **Formato:** vertical 9:16. Si no deja, horizontal 16:9 (se recorta después).
- **Duración:** 5 s (o 10 s si alcanzan los créditos).
- **Modo:** texto a video ("text to video").
- Generá 2 o 3 versiones de cada uno y quedate con la que más tensión tenga y se vea más natural.
- Descartá las que tengan caras de cerca, texto, logos o marcas de agua, o movimientos raros (manos deformes, objetos que se atraviesan).
- Guardá el video con el nombre de la idea (por ejemplo `escalera-1.mp4`) en `brand/instagram/caidas/` y anotá en `fuentes.md` la web, el prompt y la fecha.

## 1. La escalera (el preferido)
```
Grainy security camera footage from a fixed high corner angle of a small garage workshop at night. A man stands on the top step of a tall wooden ladder, reaching up to change a light bulb. The ladder suddenly wobbles and tilts to one side, he waves his arms wildly and is about to fall, then at the last second he grabs a shelf and steadies himself. Realistic everyday CCTV look, slightly washed out colors, static camera, no text, no logos.
```

## 2. La silla con rueditas
```
Grainy security camera footage from a fixed ceiling corner of a small office. A man stands on a rolling office chair to reach a box on a high shelf. The chair starts rolling and spinning under his feet, he wobbles and almost falls backwards, then he grabs the shelf edge and freezes, balanced. Realistic CCTV look, static camera, muted colors, no text, no logos.
```

## 3. Las cajas apiladas
```
Grainy security camera footage from a fixed high angle in a narrow hallway. A delivery man walks carrying a tall stack of cardboard boxes that blocks his view. The top boxes start sliding and the whole stack leans dangerously to one side, he stops and leans his body to catch it, the stack sways back and forth and stays up. Realistic CCTV look, static camera, muted colors, no text, no logos.
```

## 4. La torta (más gracioso)
```
Grainy security camera footage from a fixed corner of a small kitchen. A person carries a tall three-tier cake on a tray, trips slightly on the edge of a rug, the cake tilts and wobbles dramatically as if it is going to fall, and the person freezes and slowly rebalances it. Realistic CCTV look, static camera, muted colors, no text, no logos.
```

## Si el resultado no convence
- Si sale "demasiado de película": agregar `low quality, low resolution, slightly blurry, amateur` al final.
- Si no hay tensión: agregar `the wobble lasts several seconds before he recovers`.
- Si se cae del todo y queda raro: sacar la parte de "se salva" y dejar `and he falls off the ladder onto a pile of soft cardboard boxes, unharmed`.
