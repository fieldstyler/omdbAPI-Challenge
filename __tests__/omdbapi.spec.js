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
  describe("no duplicate records", () => {
    let response2, response3, response4, response5;
    beforeAll(async() => {
      response2 = await fetch("http://www.omdbapi.com?apikey=63856c6&s=thomas&page=2", {method: 'GET'})
      .then((data) => {
        return data.json()
      })
      response3 = await fetch("http://www.omdbapi.com?apikey=63856c6&s=thomas&page=3", {method: 'GET'})
      .then((data) => {
        return data.json()
      })
      response4 = await fetch("http://www.omdbapi.com?apikey=63856c6&s=thomas&page=4", {method: 'GET'})
      .then((data) => {
        return data.json()
      })
      response5 = await fetch("http://www.omdbapi.com?apikey=63856c6&s=thomas&page=5", {method: 'GET'})
      .then((data) => data.json())
    })
    it("no duplicates on first five pages", () => {
      let responseArray = [response, response2, response3, response4, response5]
      responseArray.forEach((resp, i) => {
        responseArray[i] = resp.Search.map((movie) => {
          return movie.imdbID
        })
      })
      responseArray = responseArray.flat()
      responseArray.forEach((movieID) => {
        expect(isUnique(responseArray, movieID)).toBe(true)
      })
    })
  })
})
// helper function
function isUnique(array, entry) {
  let first = array.indexOf(entry)
  let last = array.lastIndexOf(entry)
  return first == last
}
