import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import s from './App.module.css';
import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class App extends Component {
  state = {
    searchData: '',
  };

  onSubmit = searchData => {
    if (searchData.trim() === '') {
      return toast.error('Enter the meaning for search');
    } else if (searchData === this.state.searchData) {
      return;
    }
    this.setState({ searchData: searchData });
  };

  render() {
    const { onSubmit } = this;
    const { searchData } = this.state;
    return (
      <div className={s.App}>
        <Searchbar onSubmit={onSubmit} />
        <ImageGallery searchData={searchData} />
        <ToastContainer autoClose={2500} />
      </div>
    );
  }
}
