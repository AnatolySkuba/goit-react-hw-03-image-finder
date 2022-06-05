import s from './Button.module.css';
import PropTypes from 'prop-types';

export default function Button({ onButton }) {
  return (
    <button type="button" className={s.Button} onClick={onButton}>
      Load more
    </button>
  );
}

Button.propTypes = {
  onButton: PropTypes.func.isRequired,
};
