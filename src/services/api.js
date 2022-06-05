import PropTypes from 'prop-types';
import axios from 'axios';

const fetchImagesWithQuery = (searchQuery, page) => {
  const response = axios.get(
    `https://pixabay.com/api/?q=${searchQuery}&page=${page}&key=26121476-a97ee3888781a95bbdf240963&image_type=photo&orientation=horizontal&per_page=12`
  );
  return response;
};

export default {
  fetchImagesWithQuery,
};

fetchImagesWithQuery.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
};
