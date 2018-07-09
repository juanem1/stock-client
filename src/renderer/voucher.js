'use strict'

import electron from 'electron'
import axios from 'axios'

const BrowserWindow = electron.remote.BrowserWindow

class Voucher {
  /**
   * Create a new voucher window
   */
  open (apiToken, ids) {
    let voucherWindow = new BrowserWindow({width: 800, height: 600})
    voucherWindow.on('closed', () => {
      voucherWindow = null
    })
    voucherWindow.loadURL(`${axios.defaults.baseURL}/voucher?api_token=${apiToken}&id=${ids}`)
  }
}

export default new Voucher()
