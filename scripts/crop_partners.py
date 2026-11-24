import os
from PIL import Image
import numpy as np

src1_path = r"C:\Users\moham\.gemini\antigravity-ide\brain\56f0c331-e5a5-4de2-a6ad-d683f36562ba\.tempmediaStorage\media_1791715049302.png"
src2_path = r"C:\Users\moham\.gemini\antigravity-ide\brain\56f0c331-e5a5-4de2-a6ad-d683f36562ba\.tempmediaStorage\media_1791715045625.png"

src1 = Image.open(src1_path).convert("RGB")
src2 = Image.open(src2_path).convert("RGB")

bg = np.array([217, 217, 217], dtype=np.float32)

def extract_logo(im, box, tol=10, feather=18):
    crop = im.crop(box)
    arr = np.array(crop, dtype=np.float32)
    diff = np.sqrt(np.sum((arr - bg) ** 2, axis=-1))
    
    alpha = np.zeros_like(diff, dtype=np.uint8)
    solid = diff >= (tol + feather)
    blend = (diff > tol) & (diff < (tol + feather))
    
    alpha[solid] = 255
    alpha[blend] = np.clip(((diff[blend] - tol) / feather) * 255, 0, 255).astype(np.uint8)
    
    rgba = np.dstack((arr.astype(np.uint8), alpha))
    res = Image.fromarray(rgba, "RGBA")
    
    # Trim transparent borders cleanly:
    bbox = res.getbbox()
    if bbox:
        pad = 8
        x1 = max(0, bbox[0] - pad)
        y1 = max(0, bbox[1] - pad)
        x2 = min(res.width, bbox[2] + pad)
        y2 = min(res.height, bbox[3] + pad)
        res = res.crop((x1, y1, x2, y2))
    
    # Upscale 2x with Lanczos for super-crisp retina display
    res_2x = res.resize((res.width * 2, res.height * 2), Image.Resampling.LANCZOS)
    return res_2x

# Mapping of all 24 partners
partner_specs = {
    # Sheet 1:
    "uae-climate-ministry": (src1, (30, 8, 225, 155)),
    "enoc": (src1, (230, 40, 368, 120)),
    "youth-councils": (src1, (360, 40, 560, 125)),
    "museum-of-the-future": (src1, (580, 25, 760, 155)),
    "arab-youth-center": (src1, (965, 20, 1075, 130)),
    "ic-youth-capital": (src1, (1100, 35, 1300, 115)),
    
    "world-utilities-congress": (src1, (150, 165, 410, 265)),
    "youngo": (src1, (510, 185, 770, 275)),
    "schneider-electric": (src1, (825, 215, 972, 266)),
    "icyf": (src1, (1125, 160, 1310, 240)),
    "cop29-baku": (src1, (1145, 252, 1288, 340)),
    
    "zayed-university": (src1, (15, 210, 145, 385)),
    "iucn": (src1, (165, 290, 415, 405)),
    "khalifa-university": (src1, (450, 320, 745, 400)),
    "uaeu": (src1, (785, 320, 940, 415)),
    # EU NEIGHBOURS south: includes flag + text
    "eu-neighbours": (src1, (980, 365, 1095, 485)),
    
    "rcoy-mena": (src1, (290, 445, 435, 570)),
    "almanakh-bil-arabi": (src1, (660, 445, 825, 565)),
    # IOM UN MIGRATION: full box without slicing the N
    "iom-un-migration": (src1, (960, 495, 1145, 575)),
    "plant-for-the-planet": (src1, (1160, 444, 1312, 580)),
    
    # Sheet 2:
    "heliopolis-university": (src2, (30, 20, 355, 120)),
    "inco-academy": (src2, (370, 20, 650, 125)),
    "project-set": (src2, (665, 20, 1070, 120)),
    "oxfam": (src2, (1070, 20, 1320, 130)),
}

out_dir = r"d:\lab\Climatify Project\public\partners"
os.makedirs(out_dir, exist_ok=True)

for name, (im_src, box) in partner_specs.items():
    extracted = extract_logo(im_src, box)
    dest_path = os.path.join(out_dir, f"{name}.webp")
    extracted.save(dest_path, "WEBP", quality=95, method=6)
    print(f"Saved: {name}.webp -> size: {extracted.size}")

print("All 24 logos successfully extracted and updated!")
