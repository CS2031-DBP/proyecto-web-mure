import React from 'react';
import Search from '@mui/icons-material/Search';

const SearchInput = ({ searchTerm, handleSearchTermChange, handleSearch, type }) => {
    const getLabel = (type) => {
        switch (type) {
            case 'artist':
                return 'Artista';
            case 'song':
                return 'Canción';
            case 'album':
                return 'Album';
            default:
                return '';
        }
    };

    return (
        <div>
            <h2>Buscar {getLabel(type)} <Search/> </h2>
            <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
            <button type="button" onClick={() => handleSearch(type)}>Buscar {getLabel(type)}</button>
        </div>
    );
};

export default SearchInput;
