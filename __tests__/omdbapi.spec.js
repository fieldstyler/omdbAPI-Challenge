const fetch = require('node-fetch');

describe("omdbAPI", () => {
  let response;
  // beforeAll so that we only run fetch once
  beforeAll(async() => {
    response = await fetch("http://www.omdbapi.com?apikey=63856c6&s=thomas", {method: 'GET'})
    .then((data) => {
    return data.json()
    })
  })
  describe("simple response validation", () => {
    // fetch returns promise, have to wait for promise to return response data
    it("verifies titles are a relevant match", () => {
      response.Search.forEach((movie) => {
        expect(movie.Title.toLowerCase()).toContain("thomas")
      });
    })
  })
})
