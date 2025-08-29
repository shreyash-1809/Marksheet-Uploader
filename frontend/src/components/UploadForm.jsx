import React, { useState } from "react";
import { uploadMarksheet } from "../services/api"; // API call

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error | warning

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Please select a file before uploading!");
      setMessageType("warning");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const result = await uploadMarksheet(file);

      setMessage("✅ Marksheet uploaded successfully!");
      setMessageType("success");

      // Clear file input
      setFile(null);
      e.target.reset();

      if (onUploadSuccess) onUploadSuccess(result);
    } catch (err) {
      setMessage("❌ Upload failed. Please try again.");
      setMessageType("error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Upload Marksheet</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && (
        <p className={`mt-3 font-medium ${messageType === "success" ? "text-green-600" : messageType === "error" ? "text-red-600" : "text-yellow-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadForm;
