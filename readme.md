GPT as a database/state machine
===
A javascript version of [Backend GPT](https://github.com/TheAppleTucker/backend-GPT) a set of prompts to instruct GPT (openai text-davinci-003) to work as a database/state machine and "API".


ChatGPT defines it as a GPT context-based prompt state machine


With 3 completion API calls to openai via fetch, it is possible to carry a json data through a completion and capture changes.


This transforms GPT into the ultimate chaotic/dynamic system that opens up for cool prototyping and down the line – with appropriate error correction prompts – changes how we construct digital systems.


## Example
There are two parts of the prompt. The JSON state and the "API call".


### Initial state
An initial state is defined in JS, which will be JSON.stringified and interpolated into the first prompt (could also be typed directly, js is just for state management).


The structure of the state object could be many things, in this example, a "database" with a table (dogs) and rows of doggies.
````js
const state_string = JSON.stringify({
   dogs:[
       {name:"fido",age:4},
       {name:"fifo",age:1},
       {name:"odif",age:14},
       {name:"ofif",age:8},
   ]
})
````


### The API call
The API call is some fictitious, but relevant, function name. *getAllDogs()* A really good example of pseudocode. It could also be *create20dogs()* or *listDogs(age > 4)* or *get_all_dogs_that_starts_with(f)* it could even be an SQL statement; *select * from dogs where age < 7*


## The first magical prompt


*\${api_call}* and *${state_string}* will be interpolated with a the chosen api call and the stringified state object


The instruction to GPT is magical and is declared below as seed_prompt:
````js
const seed_prompt = `
API Call (indexes are zero-indexed):
${api_call}
Database State:
${state_string}


Output the API response prefixed with 'API response:'. Then output the new database state as json, prefixed with 'New Database State:'. If the API call is only requesting data, then don't change the database state, but base your 'API Response' off what's in the database.
`
````


### The first completion
The string is posted via fetch to open-ai completion.
In return we get a text completion


## The second and third completion
From the completion, two new prompts can be created to get the data


### The API response
To get the "API response" json data we prompt open-ai for a completion with the following
````js
const api_response_json_prompt = `${completion}\n\nAPI Response as valid json (as above, ignoring new database state):`
````


### The (new) database json state
To get the json database state data we prompt open-ai for a completion with the following
````js
const  new_state_prompt = `${completion}\n\nThe value of 'New Database State' above (as json):"`
````


The api response is shown and the new database state is saved for the next run.


This opens up for "stateful" api magic with the following imaginative api calls:

*create20dogs()* creates 100 dogs and returns ```{
  "success": true,
  "message": "100 dogs created"
}```

*create_dog(fifi,2)* creates a new dog called fifi age 2 and returns ```{
  "name": "fifi",
  "age": 2
}```.

*update_dog(fifi,4)* dang, fifi is 4 not 2. updates the age of fifi and returns ```{
  "message": "Dog 'fifi' updated with age 4."
}```

## ChatGPT generated summary:
a JavaScript version of Backend GPT is a set of prompts that can be used to instruct OpenAI's GPT (text-davinci-003) to work as a database/state machine and API.


By using completion API calls to OpenAI, it is possible to manage a JSON data state and perform desired actions on it using API calls.

The process involves defining an initial state object, stringifying it, and interpolating it into a seed_prompt along with the desired API call.

The seed_prompt is then sent as a completion API call to OpenAI, which returns a text completion. From this text completion, two additional prompts can be created to extract the "API response" and the updated state of the database in JSON format.

This allows for dynamic management and manipulation of the state and provides a powerful tool for prototyping and constructing digital systems.

