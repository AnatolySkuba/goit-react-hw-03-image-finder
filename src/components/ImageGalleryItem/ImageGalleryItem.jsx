import s from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';

export default function ImageGalleryItem({ images, openModal }) {
  return images.map(({ id, webformatURL }, index) => (
    <li key={id} className={s.ImageGalleryItem}>
      <img
        className={s.ImageGalleryItem__image}
        src={webformatURL}
        onClick={() => openModal(index)}
        alt=""
      />
    </li>
  ));
}

ImageGalleryItem.propTypes = {
  openModal: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      webformatURL: PropTypes.string.isRequired,
    })
  ),
};
