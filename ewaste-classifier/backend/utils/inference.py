# backend/utils/inference.py
import io
import asyncio
from PIL import Image
from ultralytics import YOLO

# Load model globally one time
MODEL_PATH = "models/best.pt"   # change if needed
model = YOLO(MODEL_PATH)


async def run_inference(image_bytes: bytes, conf_thresh: float = 0.25):
    """
    Async + thread-safe YOLOv8 inference.
    Runs model in a background thread so FastAPI stays responsive.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Offload YOLO inference to background thread (prevents blocking the main event loop)
    results = await asyncio.to_thread(
        model.predict,
        img,
        imgsz=640,
        conf=conf_thresh,
        verbose=False
    )

    preds = []
    r = results[0]

    for box in r.boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        bbox = [float(x) for x in box.xyxy[0].tolist()]

        preds.append({
            "class_id": cls_id,
            "class_name": r.names[cls_id],
            "confidence": conf,
            "bbox": bbox
        })

    return preds
