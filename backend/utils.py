# utils.py
import io
from PIL import Image
import fitz  # PyMuPDF
import pytesseract

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def pdf_to_images(file_bytes, dpi=200):
    images = []
    pdf = fitz.open(stream=file_bytes, filetype="pdf")
    for page in pdf:
        pix = page.get_pixmap(dpi=dpi)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(img)
    return images, len(images)

def ocr_image(image):
    # Use pytesseract to extract text
    text = pytesseract.image_to_string(image)
    # simple token structure
    tokens = [{"text": word} for word in text.split()]
    meta = {"length": len(text)}
    return tokens, meta
