import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import fetchImagesWithQuery from 'services/api';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import s from './App.module.css';
import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
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

  firstPage(searchData) {
    this.setState({ images: [], nextImages: [], isLoading: true });
    try {
      const page = 1;
      const response = fetchImagesWithQuery(searchData, page);
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
        this.setState({ isLoading: false });
      });
    } catch (error) {
      this.setState({ error, isLoading: false });
    } finally {
      this.setState({ page: 1 });
    }
  }

  nextPage = () => {
    const { searchData, images } = this.state;
    let { page, nextImages } = this.state;
    page++;
    this.setState(prevState => ({
      images: [...prevState.images, ...nextImages],
    }));
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
      this.setState({ nextImages: [], page: page });
    }
  };

  openModal = index => {
    const { images } = this.state;
    this.setState({ showModal: true, largeImage: images[index].largeImageURL });
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  onSubmit = searchData => {
    if (searchData.trim() === '') {
      return toast.error('Enter the meaning for search');
    } else if (searchData === this.state.searchData) {
      return;
    }
    this.setState({ searchData: searchData });
    this.firstPage(searchData);
  };

  render() {
    const { toggleModal, openModal, nextPage, onSubmit } = this;
    const { nextImages, images, isLoading, largeImage, showModal } = this.state;

    return (
      <div className={s.App}>
        <Searchbar onSubmit={onSubmit} />
        {images.length !== 0 && (
          <ImageGallery>
            <ImageGalleryItem images={images} openModal={openModal} />
          </ImageGallery>
        )}
        {showModal && (
          <Modal toggleModal={toggleModal} largeImage={largeImage} />
        )}
        {isLoading && <Loader />}
        <ToastContainer autoClose={2500} />
        {images.length >= 12 && nextImages.length !== 0 && (
          <Button nextPage={nextPage} />
        )}
      </div>
    );
  }
}
