# backend/main.py
import io
import os
import time
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import fitz  # PyMuPDF

# Set path to Tesseract if not in PATH (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}

app = FastAPI(title="Marksheet Extractor API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def allowed_file(filename):
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

@app.get("/")
async def root():
    return {"message": "Marksheet Extractor API is running. Use /upload/ to upload a file."}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    # Validate file extension
    if not allowed_file(file.filename):
        raise HTTPException(status_code=415, detail="Only PDF, PNG, JPG files allowed")

    # Read file bytes
    data = await file.read()
    if len(data) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 10 MB)")

    # Save uploaded file
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as f:
        f.write(data)

    start_time = time.time()
    extracted_text = ""

    try:
        if file.filename.lower().endswith(".pdf"):
            doc = fitz.open(io.BytesIO(data))
            for page in doc:
                page_text = page.get_text()
                if page_text.strip():
                    extracted_text += page_text + "\n"
            # OCR fallback
            if not extracted_text.strip():
                for page in doc:
                    pix = page.get_pixmap(dpi=200)
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    extracted_text += pytesseract.image_to_string(img) + "\n"
        else:
            img = Image.open(io.BytesIO(data)).convert("RGB")
            extracted_text = pytesseract.image_to_string(img)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR/PDF error: {str(e)}")

    # Parse basic marksheet info
    parsed = {"candidate_name": "", "roll_no": "", "marks": {}, "total": None}
    for line in extracted_text.splitlines():
        line_lower = line.lower()
        if any(k in line_lower for k in ["name", "student name", "candidate name"]):
            parsed["candidate_name"] = line.split(":")[-1].strip()
        elif any(k in line_lower for k in ["roll", "roll no", "roll number"]):
            parsed["roll_no"] = line.split(":")[-1].strip()
        elif ":" in line and any(sub in line for sub in ["Math", "Science", "English"]):
            subject, marks = line.split(":")
            try:
                parsed["marks"][subject.strip()] = int(marks.strip())
            except:
                parsed["marks"][subject.strip()] = marks.strip()
        elif "total" in line_lower:
            try:
                parsed["total"] = int(line.split(":")[-1].strip())
            except:
                parsed["total"] = line.split(":")[-1].strip()

    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    return JSONResponse({
        "filename": file.filename,
        "size_bytes": len(data),
        "extracted_text": extracted_text,
        "parsed": parsed,
        "timings_ms": {"ocr_ms": elapsed_ms},
    })
