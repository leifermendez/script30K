import axios from "axios";
import { Console } from "console";
import { createWriteStream } from "fs";

let comments: any = [];
const myLogger = new Console({
  stdout: createWriteStream("participantes.log"),
});
async function callHttp(next?: string) {
  console.log(`Entrando:${next ? "Con Token" : "Sin Token"}`);
  const res = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=VxFENxcq-yU&maxResults=100&alt=json&prettyPrint=true&key=TOKEN__________-KVjVtX7H1mIl8_-a6Aah4D2qFjo${
      next ? "&pageToken=" + next : ""
    }`
  );

  const { items = [], nextPageToken = undefined } = res.data;
  for (const comment of items) {
    const textComment = comment.snippet.topLevelComment.snippet.textDisplay;
    const user = comment.snippet.topLevelComment.snippet.authorDisplayName;
    comments.push(textComment);
    myLogger.log(`${user}-------${textComment}`);
  }
  if (nextPageToken) await callHttp(nextPageToken);
}

callHttp().then(() => console.log(comments.length));
