import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch results from backend API
    fetch("http://127.0.0.1:8000/results")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl border border-gray-200 bg-white">
        <CardContent className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
            📊 Marksheet Results
          </h1>

          {!data ? (
            <p className="text-center text-gray-600">Loading results...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-bold">Name:</span> {data.name}
              </p>
              <p className="text-lg">
                <span className="font-bold">Roll No:</span> {data.roll_no}
              </p>
              <p className="text-lg">
                <span className="font-bold">Course:</span> {data.course}
              </p>
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">📚 Subjects</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {data.subjects.map((subj, index) => (
                    <li key={index}>
                      {subj.name}: <span className="font-bold">{subj.marks}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xl font-bold mt-6 text-green-700">
                ✅ Total: {data.total}
              </p>
              <p className="text-xl font-bold text-blue-700">
                🎯 Percentage: {data.percentage}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
