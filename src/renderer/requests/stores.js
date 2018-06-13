'use strict'

import Request from './request'
import axios from 'axios'

class Stores extends Request {
  /**
   * Get list of all stores
   */
  getList () {
    axios.get('/stores')
      .then(response => {
        this.items = response.data
      })
      .catch(error => {
        this.message = error.response.data.errors.email + error.response.data.errors.password
      })
      .then(() => {
        this.loading = false
      })
  }
}

export default new Stores()
