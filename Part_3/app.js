const baseURL = "https://pokeapi.co/api/v2/pokemon"

// 1) Figure out how to make a single request to the Pokemon API to get names and URLs for every pokemon in the database.

async function part1() {
    let res = await axios.get(`${baseURL}`);
    console.log("Names and URLs of every POKEMONS :\n", res.data.results);
}
part1();

// 2) Once you have names and URLs of all the pokemon, pick three at random and make requests to their URLs. Once those requests are complete, console.log the data for each pokemon.

async function part2() {
    let res = await axios.get(`${baseURL}`);
    let results = res.data.results;

    // Picking 3 random "names and URLS" from the "results" ARRAY
    let randomPokemons = results.sort(() => 0.5 - Math.random()).slice(0, 3);
    console.log("Three Random Pokemons :\n", randomPokemons);
}
part2();

// 3) Start with your code from 2, but instead of logging the data on each random pokemon, store the name of the pokemon in a variable and then make another request, this time to that pokemon’s species URL (you should see a key of species in the data). Once that request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English. If you find one, console.log the name of the pokemon along with the description you found.

let randomPokemons = [];
let speciesNames;

async function part3() {
    let res = await axios.get(`${baseURL}`);

    results = res.data.results;

    // Picking 3 random "names and URLS" from the "results" ARRAY
    randomPokemons = results.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Storing all the URLS seperately into an ARRAY
    let randomPokemonsURLs = [];
    for (let url of randomPokemons) randomPokemonsURLs.push(url.url);


    // Making the request in parallel to all the URLS and returning those resolved values of promises
    let randomPokemonsURLsResponses = await Promise.all(randomPokemonsURLs.map(url => axios.get(url)));

    // Getting the SPECIES NAMES from all the response
    speciesNames = randomPokemonsURLsResponses.map(d => d.data.species.name);

    // Making request and returning those resolved values for the SPECIES URLS from the "randomPokemonsURLsResponses"
    let speciesResponses = await Promise.all(randomPokemonsURLsResponses.map(d => axios.get(d.data.species.url)));

    // Looking into the first english description under the "flavor_text_entries" KEY from the "speciesResponses"
    let descriptions = speciesResponses.map(d => {
        let descriptionObj = d.data.flavor_text_entries.find(
          entry => entry.language.name === "en"
        );
        return descriptionObj ? descriptionObj.flavor_text : "No description available."; 
    });
    
    // Now for each descriptions we print the species name along with the description 
    console.log("Descriptions of each species :\n ")
    descriptions.forEach((desc, i) => {
        console.log(`${speciesNames[i]}: ${desc}`);
    });

}
part3();

// 4) BONUS Instead of relying on console.log, let’s create a UI for these random pokemon. Build an HTML page that lets you click on a button to generate data from three randomly chosen pokemon. Include the name of the pokemon, an image of the pokemon, and the description of its species which you found in 3.

const btn = document.querySelector("button");
let pokemonCard = document.querySelector("#pokemon-area");

btn.addEventListener("click", async function (e) {
    e.preventDefault();

    pokemonCard.innerHTML = "";

    let randomPokemons = [];
    let speciesNamesAndImages = [];

    let res = await axios.get(`${baseURL}`);

    results = res.data.results;

    // Picking 3 random "names and URLS" from the "results" ARRAY
    randomPokemons = results.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Storing all the URLS seperately into an ARRAY
    let randomPokemonsURLs = [];
    for (let url of randomPokemons) randomPokemonsURLs.push(url.url);


    // Making the request in parallel to all the URLS and returninh thoseresolved values of promises
    let randomPokemonsURLsResponses = await Promise.all(randomPokemonsURLs.map(url => axios.get(url)));
    
    // Getting the SPECIES NAMES from the "randomPokemonsURLsResponses"
    speciesNamesAndImages = randomPokemonsURLsResponses.map(d => ({
        name: d.data.species.name,
        imgSrc: d.data.sprites.front_default
    }));

    // Making request and returning those resolved values for the SPECIES URLS from the "randomPokemonsURLsResponses"
    let speciesResponses = await Promise.all(randomPokemonsURLsResponses.map(d => axios.get(d.data.species.url)));

    // Looking into the first english description under the "flavor_text_entries" KEY and appending those into the DOM from tht "speciesResponses"
    speciesResponses.forEach((d, i) => {
        let descriptionObj = d.data.flavor_text_entries.find(function (entry) {
            return entry.language.name === "en";
        });
        let description = descriptionObj ? descriptionObj.flavor_text : "";

        let { name, imgSrc } = speciesNamesAndImages[i];

        pokemonCard.innerHTML += makePokeCard(name, imgSrc, description);
        
    });
        
})
    
function makePokeCard(name, imgSrc, description) {
    return `
        <div class="card">
        <h1>${name}</h1>
        <img src=${imgSrc} />
        <p>${description}</p>
        </div>
    `;
}