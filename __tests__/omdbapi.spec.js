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
    it("verifies titles are a relevant match", () => {
      response.Search.forEach((movie) => {
        expect(movie.Title.toLowerCase()).toContain("thomas")
      });
    })
    it("verify movie properties", () => {
      response.Search.forEach((movie) => {
        const alphabetizedProperties = Object.keys(movie).sort((a, b) => a.localeCompare(b))
        expect(alphabetizedProperties).toStrictEqual(["imdbID", "Poster", "Title", "Type", "Year"])
      });
    })
    it("verify values are of correct object class", () => {
      response.Search.forEach((movie) => {
        Object.values(movie).forEach((value) => {
          expect(typeof value).toEqual("string")
        })
      })
    })
  })
})
