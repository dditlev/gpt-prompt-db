const fetch = require("node-fetch")

const OPENAI_TOKEN = "sk-yourkey";
const OACO = {
  max_tokens: 512,
  model: "text-davinci-003",
  prompt: "",
  temperature: 0.6,
}
async function oac(
  input_prompt,
  opts = OACO
) {
  console.log("Posting prompt:\n",input_prompt)
  return new Promise((rese, reje) =>
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + OPENAI_TOKEN,
      },
      body: JSON.stringify({...opts, prompt:input_prompt}),
    })
      .then((r) => r.json())
      .then((t) => {
        t.choices[0] ?
        rese(t.choices[0].text)
        : reje("no completion found in openai response")
      })
      .catch((err) => {
        console.log("openai err", err);
        reje(err);
      })
  );
}
const db = {
  test: { // namespace
    state: {
      dogs: [
        { name: "fido", age: 1 },
        { name: "odif", age: 2 },
      ],
    },
  },
};
function post_call(api_call) {
  const statemachine = `
API Call (indexes are zero-indexed):
${api_call}
Database State:
${JSON.stringify(db["test"]["state"])}

Output the API response prefixed with 'API response:'. Then output the new database state as json, prefixed with 'New Database State:'. If the API call is only requesting data, then don't change the database state, but base your 'API Response' off what's in the database.`;

  console.log("\n\n======");
  console.log(statemachine);
  console.log("\n\n======");

  oac(statemachine).then((completion) => {
    const future1 = `${completion}\n\nAPI Response as valid json (as above, ignoring new database state):`;
    const future2 = `${completion}\n\nThe value of 'New Database State' above (as json):"`;
    Promise.all([future1, future2].map((f) => oac(f))).then((r) => {
      db["test"].state = r[1];
      // pretty print json
      console.log(JSON.stringify(JSON.parse(r[0]), null, 2));
    });
  });
}
if (process.argv[2]) {
  post_call(process.argv[2])
}
else {
  post_call("create_dog(fifi,4)")
}