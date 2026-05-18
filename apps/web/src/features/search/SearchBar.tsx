import React from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router';
import styles from "./SearchBar.module.css"
import SearchIcon from "@/assets/icons/magnifying-glass-solid-full.svg?react"

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if(!trimmedSearch) {
      navigate("/products");
      return;
    }
    navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`)
  }

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <SearchIcon className={styles.icon} />
      <input 
        className={styles.inputField}
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </form>




    // <div className={styles.searchBar}>
    //     <SearchIcon className={styles.icon}/>
    //     <input className={styles.inputField} type="text" placeholder='Search...'/>
    // </div>
  )
}

export default SearchBar