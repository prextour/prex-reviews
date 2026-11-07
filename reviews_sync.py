#!/usr/bin/env python3
"""Google yorumlarını günde bir kez çeker -> reviews.json
Gerekli ortam değişkenleri: GOOGLE_PLACES_KEY, GOOGLE_PLACE_ID
Hata olursa mevcut dosyaya dokunmaz (widget eski yorumları göstermeye devam eder)."""
import json, os, sys, urllib.request, datetime

key = os.environ.get("GOOGLE_PLACES_KEY", "").strip()
pid = os.environ.get("GOOGLE_PLACE_ID", "").strip()
if not key or not pid:
    sys.exit("GOOGLE_PLACES_KEY / GOOGLE_PLACE_ID tanımlı değil, atlandı")

url = f"https://places.googleapis.com/v1/places/{pid}?languageCode=tr"
req = urllib.request.Request(url, headers={
    "X-Goog-Api-Key": key,
    "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri,displayName",
})
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        d = json.load(r)
except Exception as e:
    sys.exit(f"Places API hatası: {e}")

reviews = []
for rv in d.get("reviews", []):
    a = rv.get("authorAttribution", {})
    reviews.append({
        "name": a.get("displayName", ""),
        "photo": a.get("photoUri", ""),
        "profile": a.get("uri", ""),
        "rating": rv.get("rating", 5),
        "time": rv.get("publishTime", ""),
        "text": (rv.get("originalText") or rv.get("text") or {}).get("text", ""),
    })
out = {
    "rating": d.get("rating"),
    "count": d.get("userRatingCount"),
    "mapsUri": d.get("googleMapsUri", ""),
    "writeUri": f"https://search.google.com/local/writereview?placeid={pid}",
    "updated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d"),
    "reviews": reviews,
}
pass
with open("reviews.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f"{len(reviews)} yorum, puan {out['rating']}, toplam {out['count']}")
