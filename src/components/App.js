import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import Navbar from './Navbar'
import './App.css'

class App extends Component {
  // componentWillMount(): 主にサーバへのAPIコールを行うなど、実際のレンダリングが行われる前にサーバサイドのロジックを実装する為に使用
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  // localBlockchainData(): ブロックチェーン上のデータとやり取りするための関数
  // MetaMaskとの接続によって得られた情報とコントラクトとの情報を使って描画に使う情報を取得
  async loadBlockchainData() {
    const web3 = window.web3
    // ユーザのMetamaskの一番最初のアカウント（複数アカウントが存在する場合）を取得
    const accounts = await web3.eth.getAccounts()
    // ユーザのMetamaskアカウントを設定
    // この機能により、App.jsに記載されているconstructor（）内のaccount（デフォルト：'0x0'）が更新される
    this.setState({account: accounts[0]})
    // ユーザがMetamaskを介して接続しているネットワークIDを取得
    const networkId = await web3.eth.net.getId()
    // DaiTokenのデータを取得
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData){
      // DaiTokenの情報をdaiTokenに格納する
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      // constructor内のdaiTokenの情報を更新する
      this.setState({daiToken})
      // ユーザのDaiトークンの残高を取得する
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      // daiTokenBalance（ユーザのDaiトークンの残高）をストリング型に変更する
      this.setState({daiTokenBalance: daiTokenBalance.toString()})
      // ユーザのDaiトークンの残高をフロントエンドのConsoleに出力する
      console.log(daiTokenBalance.toString())
    } else {
      window.alert('DaiToken contract not deployed to detected network.')
    }
  }

  // loadWeb3(): ユーザがMetamaskアカウントを持っているか確認する関数
  async loadWeb3() {
    // ユーザがMetamaskアカウントを持っていた場合はアドレスを取得
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    // ユーザがMetamaskのアカウントを持っていなかった場合は、エラーを返す
    else {
      window.alert('Non ethereum browser detected. You should consider trying to install metamask')
    }
    this.setState({ loading: false})
  }
  
  // constructor(): ブロックチェーンから読み込んだデータ＋ユーザの状態を更新する関数
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  // フロントエンドのレンダリングが以下で実行される
  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://unchain-portal.netlify.app/home"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
