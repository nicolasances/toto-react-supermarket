import React, {Component} from 'react';
import {Image} from 'react-native';
import TotoAPI from './TotoAPI';
import TRC from 'toto-react-components';
import * as config from '../Config';

class FoodCategoriesAPI {

  constructor() {

    // Fetch the categories and prefetch the images
    new TotoAPI().fetch('/diet/categories').then((response) => response.json()).then((data) => {

      this.images = [];

      // For each category, prefetch an image
      for (var i = 0; i < data.categories.length; i++) {

        this.images.push({
          categoryId: data.categories[i].id,
          img: this.fetchImage(data.categories[i].id, data.categories[i].image, 30),
          img20: this.fetchImage(data.categories[i].id, data.categories[i].image, 20),
          img60: this.fetchImage(data.categories[i].id, data.categories[i].image, 60),
        });
      }

    })

    // Auth logic
    this.authorization = {'Authorization': config.AUTH}
    this.baseUrl = config.API_URL + '/diet/';

    // Bind
    this.getImage = this.getImage.bind(this);
  }

  /**
   * Specifies if the images have been loaded
   */
  loaded() {
    return this.images != null;
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
  fetchImage(categoryId, relativeUrl, size) {

    let s = size == null ? 32 : size;

    return (
      <Image  key={categoryId}
              style={{width: size, height: size, tintColor: TRC.TotoTheme.theme.COLOR_TEXT}}
              source={{uri: this.baseUrl + relativeUrl, headers: this.authorization}} />
    )
  }

}

export default new FoodCategoriesAPI();
