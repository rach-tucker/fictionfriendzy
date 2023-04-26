"use client"
import React from 'react';
import { useState } from 'react';


const Prompt: React.FC= () => {
  const [genre, setGenre] = useState("");
  const [result, setResult] = useState<string | undefined>(undefined);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    console.log("TEST")
    console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)
    event.preventDefault();
    try {
      const prompt = {
        prompt: `write me a story prompt and the first few sentences for the genre ${genre}`,
        temperature: 1,
        max_tokens: 80,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };
      const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify(prompt),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      //Ensure response ends on a full sentence
      let fullStopIndex = data.choices[0].text.lastIndexOf(".");
      if (fullStopIndex === -1) {
      fullStopIndex = data.choices[0].text.lastIndexOf("!");
      }
     if (fullStopIndex === -1) {
      fullStopIndex = data.choices[0].text.lastIndexOf("?");
      }
      if (fullStopIndex !== -1) {
        data.choices[0].text = data.choices[0].text.substring(0, fullStopIndex + 1);
      }

      setResult(data.choices[0].text);
      console.log(data);
      console.log(data.choices[0].text);
      setGenre("");
    } catch(error: any) {
      console.error(error);
      alert(error.message);
    }
  }



  return (
    <div>
      <main>
        <h3>Generate Random Story</h3>
        <form onSubmit={onSubmit}>
          <div>
            <p>Select a genre:</p>
            <button onClick={() => setGenre("fantasy")}>Fantasy</button>
            <button onClick={() => setGenre("mystery")}>Mystery</button>
            <button onClick={() => setGenre("sci-fi")}>Sci-Fi</button>
            <button onClick={() => setGenre("random")}>Random</button>
          </div>
          <input type="submit" value="Generate" />
        </form>
        <div className='results'>{result}</div>
      </main>
    </div>
  );
};

export default Prompt;