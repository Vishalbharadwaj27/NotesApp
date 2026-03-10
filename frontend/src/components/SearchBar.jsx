import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBar = ({ onSearch, placeholder = 'Search notes...' }) => {
  return (
    <Search
      placeholder={placeholder}
      onSearch={onSearch}
      style={{ width: 300, marginBottom: 16 }}
    />
  );
};

export default SearchBar;
