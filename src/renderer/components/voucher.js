'use strict'

import axios from 'axios'
import electron from 'electron'
const { BrowserWindow } = electron.remote

class Voucher {
  /**
   * Open a new window and show voucher for printing
   * @param {*} authorization Api token
   * @param {*} id voucher id to load
   */
  open (authorization, id) {
    let win = new BrowserWindow({width: 800, height: 600})
    win.on('closed', () => {
      win = null
    })

    // Load a remote URL
    win.loadURL(`${axios.defaults.baseURL}/voucher?api_token=${authorization}&id=${id}`)
  }
}

export default new Voucher()
