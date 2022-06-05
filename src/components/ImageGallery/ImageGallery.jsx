import { Component } from 'react';
import s from './ImageGallery.module.css';
import fetchImagesWithQuery from 'services/api';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';

export default class ImageGallery extends Component {
  state = {
    searchData: '',
    images: [],
    nextImages: [],
    page: 1,
    largeImage: '',
    showModal: false,
    isLoading: false,
    error: null,
  };

  static propTypes = {
    searchData: PropTypes.string.isRequired,
  };

  componentDidUpdate(prevProps) {
    const prevSearchData = prevProps.searchData;
    const nextSearchData = this.props.searchData;
    if (prevSearchData !== nextSearchData) {
      this.setState({ images: [] });
      try {
        const { page } = this.state;
        const response = fetchImagesWithQuery(nextSearchData, page);
        let { images } = this.state;
        response.then(data => {
          data.data.hits.length === 0
            ? toast.error('Nothing found')
            : data.data.hits.forEach(({ id, webformatURL, largeImageURL }) => {
                !images.some(image => image.id === id) &&
                  this.setState(prevState => ({
                    images: [
                      ...prevState.images,
                      { id, webformatURL, largeImageURL },
                    ],
                  }));
              });
          data.data.hits.length >= 12 && this.nextPage();
        });
      } catch (error) {
        this.setState({ error });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  nextPage = () => {
    const { searchData, images } = this.state;
    let { page } = this.state;
    page++;
    this.setState({ isLoading: true });
    try {
      const nextResponse = fetchImagesWithQuery(searchData, page);
      nextResponse.then(data => {
        data.data.hits.forEach(({ id, webformatURL, largeImageURL }) => {
          !images.some(image => image.id === id) &&
            this.setState(prevState => ({
              nextImages: [
                ...prevState.nextImages,
                { id, webformatURL, largeImageURL },
              ],
            }));
        });
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false, nextImages: [], page: page });
    }
  };

  openModal = index => {
    const { images } = this.state;
    this.setState({ showModal: true, largeImage: images[index].largeImageURL });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onButton = () => {
    let { nextImages } = this.state;
    this.setState(prevState => ({
      images: [...prevState.images, ...nextImages],
    }));
    this.nextPage();
  };

  render() {
    const { onButton, toggleModal, openModal } = this;
    const { images, nextImages, isLoading, showModal, largeImage } = this.state;

    return (
      <>
        {showModal && (
          <Modal toggleModal={toggleModal} largeImage={largeImage} />
        )}
        {isLoading && <Loader />}
        <ul className={s.ImageGallery}>
          {images.length !== 0 && (
            <ImageGalleryItem images={images} openModal={openModal} />
          )}
        </ul>
        {images.length >= 12 && nextImages.length !== 0 && (
          <Button onButton={onButton} />
        )}
      </>
    );
  }
}
