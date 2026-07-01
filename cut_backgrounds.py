from PIL import Image
import os, sys

# ── Configuração ──────────────────────────────────────────────────────────────
INPUT  = "Mobile - Stumble Guys - Miscellaneous - Map Banners.png"
OUTPUT = "public/backgrounds"       # pasta de saída
COLS   = 5
ROWS   = 7

os.makedirs(OUTPUT, exist_ok=True)

img = Image.open(INPUT)
W, H = img.size
print(f"Imagem: {W}x{H}")

cell_w = W // COLS
cell_h = H // ROWS
print(f"Célula: {cell_w}x{cell_h}")

# Tamanho quadrado final (menor dimensão da célula)
size = min(cell_w, cell_h)

count = 0
for row in range(ROWS):
    for col in range(COLS):
        x0 = col * cell_w
        y0 = row * cell_h
        x1 = x0 + cell_w
        y1 = y0 + cell_h

        cell = img.crop((x0, y0, x1, y1))
        cw, ch = cell.size

        # Crop centralizado para quadrado
        if cw > ch:
            offset = (cw - ch) // 2
            cell = cell.crop((offset, 0, offset + ch, ch))
        elif ch > cw:
            offset = (ch - cw) // 2
            cell = cell.crop((0, offset, cw, offset + cw))

        # Redimensiona para tamanho uniforme
        cell = cell.resize((size, size), Image.LANCZOS)

        out_path = os.path.join(OUTPUT, f"bg_{count+1:02d}.jpg")
        cell = cell.convert("RGB")
        cell.save(out_path, "JPEG", quality=92)
        print(f"  Salvo: {out_path}")
        count += 1

print(f"\n✅ {count} backgrounds cortados em '{OUTPUT}/'")
