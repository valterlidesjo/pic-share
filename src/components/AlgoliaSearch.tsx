import React from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits } from "react-instantsearch";
import { User } from "@/hooks/useGetVerifiedUsers";
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
