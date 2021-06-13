# QA API Code Test

It is time to run some tests against OMDb API - The Open Movie Database!

# Getting Started
Clone this repository --> `git clone git@github.com:fieldstyler/omdbAPI-Challenge.git`

`cd omdbAPI-Challenge`

To make sure you can successfully run tests against the OMDb API, run the following commands in your terminal...

`npm install`

`npm install jest`

`npm install node-fetch`

To run your tests, run `npm test` in your terminal and you're good to go!

## Tests:

1. Successfully make api requests to omdbapi from within tests in omdbapi.spec.js

2. Add assertion to test_no_api_key to ensure the response at runtime matches what is currently displayed with the api key missing

3. Extend omdbapi.spec.js by creating a test that performs a search on 'thomas'.

  ```
  - Verify all titles are a relevant match
  - Verify keys include Title, Year, imdbID, Type, and Poster for all records in the response
  - Verify values are all of the correct object class
  - Verify year matches correct format
  ```

4. Test that uses the i parameter to verify each title on page 1 is accessible via imdbID

5. Test that none of the poster links on page 1 are broken

6. Test that there are no duplicate records across the first 5 pages

7. Test something I am curious about with regard to movies or data in the database.
