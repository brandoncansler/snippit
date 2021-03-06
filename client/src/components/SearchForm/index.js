import React, { useState, useContext } from 'react';
import { Row, Col, Icon, Button, TextInput } from 'react-materialize';
import SearchLanguage from '../SearchLanguage';
import KeywordContext from '../../utils/KeywordContext';
import LanguageContext from '../../utils/LanguageContext';

function SearchForm(props) {
    const { language, updateLanguage } = useContext(LanguageContext);
    const { keywords, updateKeywords } = useContext(KeywordContext);
    const [state, setState] = useState({
        search: '',
        language: ''
    });

    function handleChange(event) {

        const name = event.target.name;
        setState({ ...state, [name]: event.target.value })
    }

    function handleSubmit(event) {
        event.preventDefault();
        const words = state.search.split(' ');

        updateKeywords(words);
        updateLanguage(state.language);
    };

    function handleClick() {
        updateKeywords([]);
    }

    return (
        <form>
            <div className="input-field">
                <Row>
                    <Col s={12} m={7}>
                        <TextInput className='search' name='search' placeholder="Search" noLayout onChange={handleChange} onClick={handleClick}/>
                    </Col>
                    <Col s={6} m={3}>
                        <SearchLanguage handleChange={handleChange}/>
                    </Col>
                    <Col s={6} m={2}>
                        <Button id='submit-search' node='button' type='submit' waves='light' onClick={handleSubmit}>Submit</Button>
                    </Col>
                </Row>
            </div>
        </form>
    )
};

export default SearchForm;
