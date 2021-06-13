const fetch = require('node-fetch');

describe("omdbAPI", () => {
  let response;
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
    it("verify year matches", () => {
      response.Search.forEach((movie) => {
        if (movie.Type === "movie") {
          expect(movie.Year).toMatch(/[0-9]{4}/)
        }
        else {
          movie.Year.split('-').forEach((year) => {
            expect(year).toMatch(/[0-9]{4}/)
          })
        }
      })
    })
  })
  describe("imdbID access", () => {
    it("can get data through imdb value", async() => {
      const imdbIDs = response.Search.map((movie) => {
        return [movie.Title, movie.imdbID]
      })
      imdbIDs.forEach(async([title, id]) => {
        let idResponse = await fetch(`http://www.omdbapi.com?apikey=63856c6&i=${id}`, {method: 'GET'})
        .then((data) => {
        return data.json()
        })
        expect(idResponse.Title).toBe(title)
      })
    })
  })
  describe("poster links unbroken", () => {
    it("shouldn't be broken", async() => {
      const posterURLs = response.Search.map((movie) => {
        return movie.Poster
      })
      posterURLs.forEach(async(poster) => {
        let posterResponse = await fetch(poster, {method: 'GET'})
        expect(posterResponse.ok).toBe(true)
      })
    })
  })
})
