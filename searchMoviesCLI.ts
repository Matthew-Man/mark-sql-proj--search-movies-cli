import { question } from "readline-sync";
import { Client } from "pg";


//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.
const client = new Client({ 
    database: "omdb" 
});


async function runCLI() {
    await client.connect();
    
    console.log("Welcome to search-movies-cli!");
    
    while (true) {
        const searchString = question("Search for what movie? (or 'q' to quit): ");
        console.log(searchString);
        if (searchString.toLowerCase() === "q") {
            await client.end()
            process.exit(0)
        } else if (searchString === "") {
            console.log("Please try again...your query cannot be empty - Search for what movie? (or 'q' to quite): ")
        } else {
        const result = await makeQuery(searchString);
        console.table(result)
        }
    }
}


async function makeQuery(query: string) {
    const text = "SELECT id, name, date, runtime, revenue, budget, vote_average, votes_count FROM movies WHERE kind = 'movie' AND LOWER(name) LIKE $1 ORDER BY date DESC LIMIT 10;";
    const values = [`%${query}%`]
    const result = await client.query(text, values);
    return result.rows;
}


runCLI()