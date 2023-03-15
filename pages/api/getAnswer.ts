import { OpenAI } from "langchain/llms";
import { VectorDBQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NextApiRequest, NextApiResponse } from "next";
import { text } from "../../text";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve) => {
    try {
      const model = new OpenAI({
        openAIApiKey: process.env.OPEN_AI_KEY,
      });
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });

      const docs = await textSplitter.createDocuments([text]);
      const vectorStore = await HNSWLib.fromDocuments(
        docs,
        new OpenAIEmbeddings({
          openAIApiKey: process.env.OPEN_AI_KEY,
        })
      );
      const chain = VectorDBQAChain.fromLLM(model, vectorStore);
      const result = await chain.call({
        query: req.body.question,
      });
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).end();
      return resolve();
    }

    res.status(405).end();
    return resolve();
  });
}
