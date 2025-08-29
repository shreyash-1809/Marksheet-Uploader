import React from "react";

const ResultCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="max-w-md mx-auto p-4 border rounded-xl shadow-md bg-gray-50 mt-4">
      <h3 className="text-lg font-bold mb-2">{data.filename}</h3>
      <p><strong>Name:</strong> {data.parsed.candidate_name}</p>
      <p><strong>Roll No:</strong> {data.parsed.roll_no}</p>
      <p><strong>Total:</strong> {data.parsed.total}</p>
      <h4 className="mt-2 font-semibold">Marks:</h4>
      <ul>
        {Object.entries(data.parsed.marks).map(([subject, mark]) => (
          <li key={subject}>{subject}: {mark}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResultCard;
