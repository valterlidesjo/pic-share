import React from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";
import SearchBar from "./ui/SearchBar";

const AlgoliaSearch = () => {
  const searchClient = algoliasearch(
    "Q48G9KJAB2",
    "e99259b367e29f6036df2bee7eae6a02"
  );

  return (
    <>
      <InstantSearch searchClient={searchClient} indexName="users">
        <SearchBar text="Search user" />
      </InstantSearch>
    </>
  );
};

export default AlgoliaSearch;
