import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";

type CategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  return (
    <FormControl fullWidth sx={{ marginBottom: "1rem" }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={value}
        label="Category"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        <MenuItem value={"all"}>All categories</MenuItem>
        <MenuItem value={"friends and family"}>Friends and family</MenuItem>
        <MenuItem value={"food and drinks"}>Food and drinks</MenuItem>
        <MenuItem value={"sports"}>Sports</MenuItem>
        <MenuItem value={"work and tech"}>Work and tech</MenuItem>
        <MenuItem value={"travel and vacation"}>Travel and vacation</MenuItem>
        <MenuItem value={"animals"}>Animals</MenuItem>
        <MenuItem value={"nature"}>Nature</MenuItem>
        <MenuItem value={"hobbies"}>Hobbies</MenuItem>
        <MenuItem value={"events and celebrations"}>
          Events and celebrations
        </MenuItem>
        <MenuItem value={"art and architecture"}>Art and architecture</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
