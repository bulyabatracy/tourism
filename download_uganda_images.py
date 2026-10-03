import os
import re

import requests

workspace = r"c:\Users\ASD\Desktop\block5\tourism"
images_dir = os.path.join(workspace, "images")
os.makedirs(images_dir, exist_ok=True)

image_urls = {
    1: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80",
    2: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    3: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    4: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
    5: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80",
    6: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80",
    7: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    8: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    9: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    10: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=900&q=80",
}

names = {
    1: "kasubi_tombs",
    2: "uganda_museum",
    3: "lake_victoria",
    4: "ndere_cultural_centre",
    5: "gaddafi_mosque",
    6: "mabamba_swamp",
    7: "bwindi_forest",
    8: "murchison_falls",
    9: "source_of_the_nile",
    10: "kidepo_valley",
}

headers = {"User-Agent": "Mozilla/5.0"}

for place_id, image_url in image_urls.items():
    filename = f"{place_id}_{names[place_id]}.jpg"
    local_path = os.path.join(images_dir, filename)

    response = requests.get(image_url, headers=headers, timeout=30)
    response.raise_for_status()

    with open(local_path, "wb") as file:
        file.write(response.content)

    print(f"saved: {place_id} -> {local_path}")

print(f"Images saved in: {images_dir}")
