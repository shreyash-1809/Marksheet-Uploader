import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [extractedText, setExtractedText] = useState(""); // ✅ store OCR text

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setExtractedText(""); // clear old results when new file selected
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("");
    setExtractedText("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setMessage(result.message || "✅ Upload successful");
      setExtractedText(result.extracted_text || "No text found.");
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }

    setUploading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-black mb-6">
          📑 Marksheet Uploader
        </h1>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-lg p-2 w-full mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.startsWith("❌") ? "text-red-600" : "text-green-700"
            }`}
          >
            {message}
          </p>
        )}

        {extractedText && (
          <div className="mt-6 text-left bg-gray-50 border border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">📄 Extracted Text</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {extractedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
