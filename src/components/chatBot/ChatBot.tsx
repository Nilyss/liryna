import "./chatBot.scss";

import leAlfredPP from "../../assets/images/leAlfred.webp";

import { IoMdClose } from "react-icons/io";
import { BiSend } from "react-icons/bi";

import { ReactElement, useState, FormEvent, ChangeEvent } from "react";
import { chatResponse } from "../../API/services/mistral.service.ts";

interface IChatMessage {
  message: string;
  sender: string;
}

export default function ChatBot(): ReactElement {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<IChatMessage[]>([]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (prompt.trim()) {
      const userMessage = { message: prompt, sender: "user" };
      setMessages((prevMessages: IChatMessage[]): IChatMessage[] => [...prevMessages, userMessage]);

      try {
        const AIResponse = await chatResponse(prompt);

        if (typeof AIResponse === "string") {
          const AIMessage = { message: AIResponse, sender: "AI" };
          setMessages((prevMessages: IChatMessage[]): IChatMessage[] => [...prevMessages, AIMessage]);
        } else {
          console.error("AIResponse is not a string:", AIResponse);
        }
      } catch (err) {
        console.error(`Error while sending message: ${err}`);
      }

      setPrompt("");
    }
  };

  return (
      <section id={"chatBot"}>
        <div className={"chatBotHeader"}>
          <figure>
            <img src={leAlfredPP} alt={"Chat bot logo"} />
          </figure>
          <h2>Le Alfred</h2>
          <IoMdClose className={"closeIcon"} />
        </div>
        <div className={"chatBotBody"}>
          {messages.map((msg: IChatMessage, i: number): ReactElement => (
              <p
                  key={i}
                  className={msg.sender === "user" ? "userMessage" : "chatBotMessage"}
              >
                {msg.message}
              </p>
          ))}
        </div>
        <form className={"chatBotFooter"} onSubmit={handleSendMessage}>
          <label htmlFor={"inputText"}>Entrez votre message</label>
          <div className={"inputWrapper"}>
            <input
                id={"inputText"}
                type={"text"}
                value={prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>): void => setPrompt(e.target.value)}
            />
            <button type={'submit'}>
              <BiSend className={"sendIcon"} />
            </button>
          </div>
        </form>
      </section>
  );
}