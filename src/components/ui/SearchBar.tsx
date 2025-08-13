import React from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Hits, useSearchBox } from "react-instantsearch";

import { User } from "@/hooks/useGetVerifiedUsers";
import { useRouter } from "next/navigation";

const SearchBar = ({ text }: { text: string }) => {
  const { query, refine } = useSearchBox();
  const router = useRouter();

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const Hit = ({ hit }: { hit: User }) => {
    return (
      <Button
        variant="outlined"
        key={hit.userId}
        className="flex flex-col justify-start items-center border-2 border-black mb-2 cursor-pointer w-full"
        onClick={() => handleUserClick(hit.userId)}
      >
        <p className="text-sm">{hit.email}</p>
        <p className="text-xs">{hit.username}</p>
      </Button>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center">
        <FormControl variant="outlined" sx={{ m: 1, width: "100%" }}>
          <InputLabel htmlFor="outlined-adornment-search">{text}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="search" edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            value={query}
            onChange={(event) => refine(event.currentTarget.value)}
            label={text}
          />
        </FormControl>
        {query && (
          <div className="w-full">
            <Hits
              hitComponent={Hit}
              classNames={{
                root: "list-none",
                list: "flex flex-col gap-2 w-[100%]",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
