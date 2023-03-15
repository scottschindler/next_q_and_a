import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const getAnswer = async () => {
    setAnswer("");
    setLoading(true);
    const response = await fetch("/api/getAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setLoading(false);
    setAnswer(data.text);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl leading-6 font-bold mt-12">
        Ask a bot about the SVB collapse
      </h1>
      <input
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            getAnswer();
          }
        }}
        className="my-6 border rounded border-blue-300 p-2 w-96"
        value={question}
        placeholder="Ask a question"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button className="bg-pink-300 px-4 py-2 rounded" onClick={getAnswer}>
        Send
      </button>
      {loading && <p>Loading...</p>}
      {answer && (
        <p className="text-xl leading-6 font-bold mt-12 px-12 w-1/3">
          {answer}
        </p>
      )}
    </div>
  );
}
