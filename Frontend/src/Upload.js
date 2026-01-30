import React, { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.split("\n").slice(0, 21);
      setPreview(lines);
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    alert("File uploaded successfully");
  };

  return (
    <div style={{ marginTop: 40 }}>
      <h2>Upload CSV</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} />

      {preview.length > 0 && (
        <>
          <h3>Preview (first 20 rows)</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: 10,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            {preview.join("\n")}
          </pre>
        </>
      )}

      <br />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;