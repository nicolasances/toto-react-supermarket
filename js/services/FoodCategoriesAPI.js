import React, {Component} from 'react';
import {Image} from 'react-native';
import TotoAPI from './TotoAPI';
import TRC from 'toto-react-components';

class FoodCategoriesAPI {

  constructor() {

    // Fetch the categories and prefetch the images
    new TotoAPI().fetch('/diet/categories').then((response) => response.json()).then((data) => {

      this.images = [];

      // For each category, prefetch an image
      for (var i = 0; i < data.categories.length; i++) {

        this.images.push({
          categoryId: data.categories[i].id,
          img: this.fetchImage(data.categories[i].id, data.categories[i].image)
        });
      }

    })
  }

  /**
   * REtrieves the image associated with the specified category
   */
  getImage(categoryId) {

    for (var i = 0; i < this.images.length; i++) {

      if (this.images[i].categoryId == categoryId) return this.images[i];

    }

  }

  /**
   * Prefetch an image
   */
  fetchImage(categoryId, relativeUrl) {

    return (
      <Image key={categoryId} style={{width: 32, height: 32, tintColor: TRC.TotoTheme.theme.COLOR_TEXT}} source={{uri: 'https://imatzdev.it/apis/diet/' + relativeUrl, headers: {'Authorization': 'Basic c3RvOnRvdG8='}}} />
    )
  }

}

export default new FoodCategoriesAPI();
