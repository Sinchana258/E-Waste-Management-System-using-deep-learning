# backend/utils/inference.py
import io
import asyncio
import time
from PIL import Image
from ultralytics import YOLO

# Load model globally one time
MODEL_PATH = "models/best.pt"
model = YOLO(MODEL_PATH)

# If your model classes are exactly these names, fine.
# If not, adjust this mapping to match model.names values.
KNOWN_CATEGORIES = {"recyclable", "reusable", "hazardous"}


async def run_inference(image_bytes: bytes, conf_thresh: float = 0.25, top_k: int = 6):
    """
    Async + thread-safe YOLOv8 inference.
    Returns:
      {
        "predictions": [ { "label": str, "confidence": float, "bbox": [x1,y1,x2,y2] }, ... ],
        "category": "recyclable" | "reusable" | "hazardous" | None,
        "speed_ms": 123.4
      }
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    start = time.time()
    # Offload YOLO inference to background thread (prevents blocking the main event loop)
    results = await asyncio.to_thread(
        model.predict,
        img,
        imgsz=640,
        conf=conf_thresh,
        verbose=False
    )
    end = time.time()

    elapsed_ms = (end - start) * 1000.0

    preds = []
    r = results[0]

    # collect boxes -> build predictions list
    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        bbox = [float(x) for x in box.xyxy[0].tolist()]

        # model.names should exist and map class ids to name strings
        label = r.names.get(cls_id, str(cls_id)) if hasattr(r, "names") else str(cls_id)

        preds.append({
            "label": label,
            "confidence": conf,
            "bbox": bbox
        })

    # sort by confidence desc and limit to top_k
    preds = sorted(preds, key=lambda x: x["confidence"], reverse=True)[:top_k]

    # If the model was trained directly with 'recyclable','reusable','hazardous',
    # prefer that. Otherwise return None and let frontend do heuristics.
    category = None
    if preds:
        # if any top prediction label matches known categories, pick the most confident match
        for p in preds:
            lab = str(p["label"]).lower().strip()
            if lab in KNOWN_CATEGORIES:
                category = lab
                break

        # fallback: if no exact match, attempt fuzzy match by checking if predicted label contains keywords
        if category is None:
            lower_labels = " ".join([str(p["label"]).lower() for p in preds])
            for known in KNOWN_CATEGORIES:
                if known in lower_labels:
                    category = known
                    break

    return {
        "predictions": preds,
        "category": category,      # may be None if model's class names are different
        "speed_ms": round(elapsed_ms, 1),
    }
