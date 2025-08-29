import React, { useEffect, useState } from "react";
import { fetchMarkSheets } from "../services/api";

const MarksheetList = () => {
  const [marksheets, setMarksheets] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchMarkSheets();
      setMarksheets(data);
    };
    getData();
  }, []);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Uploaded Marksheets</h2>
      <ul className="list-disc pl-5">
        {marksheets.map((m) => (
          <li key={m.id}>
            <a
              href={m.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {m.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarksheetList;
