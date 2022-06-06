import s from './ImageGallery.module.css';
import PropTypes from 'prop-types';

export default function ImageGallery({ children }) {
  return <ul className={s.ImageGallery}>{children}</ul>;
}

ImageGallery.propTypes = {
  children: PropTypes.object.isRequired,
};
