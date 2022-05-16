export const StaticFiles = `Nextjs can server static files like images, under a folder called \`public\` in the root directory. Files under the \`public\` folder can then be referenced in the code starting from the base url \`(/)\`
Static Files can't be access in api routes with base url.
[Read More](https://nextjs.org/docs/basic-features/static-file-serving)`;

export const RouterQuery = `My \`router.query\`is Empty.
The \`router.query\` is an object that contains the query parameters passed in the url.
You can use \`router.isReady\` to check if the router query is ready to be used.
Code Example: \`\`\`js
import { useEffect } from "react";
import { useRouter } from "next/router";
export default function App(){
    const {isReady,query} = useRouter();
    useEffect(() => {},[isReady]);
    return <div>{JSON.stringify(query)}</div>
    }\`\`\``;

export default {
  StaticFiles,
  RouterQuery,
};
