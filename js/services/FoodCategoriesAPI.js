import React, {Component} from 'react';
import {Image} from 'react-native';
import TotoAPI from './TotoAPI';

class FoodCategoriesAPI {

  constructor() {

    // Fetch the categories and prefetch the images
    new TotoAPI().fetch('/diet/categories').then((response) => response.json()).then((data) => {

      this.images = [];

      // For each category, prefetch an image
      for (var i = 0; i < data.categories.length; i++) {

        this.images.push(this.fetchImage(data.categories[i].image));
      }

    })
  }

  /**
   * Prefetch an image
   */
  fetchImage(relativeUrl) {

    return (
      <Image style={{width: 24, height: 24}} source={{uri: 'https://imatzdev.it/apis/diet/' + relativeUrl, headers: {'Authorization': 'Basic c3RvOnRvdG8='}}} />
    )
  }

}

export default new FoodCategoriesAPI();
