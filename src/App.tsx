import React from 'react';
import './App.scss';
import moment from 'moment';

class App extends React.Component {
  // 2 seconds
  private heartBeat = 2000; 
  
  public state: any = {
    feeds: [],
  }
  
  componentDidMount() {
    this.initFeeds();
  }

  initFeeds() {
    this.getLatestFeeds().then(feeds => {
      this.setState({
        feeds
      }, () => {
        this.liveUpdate();
      });
    }).catch(e => {
      setTimeout(this.initFeeds.bind(this), 100);
    })
  }

  liveUpdate() {
    setTimeout(async ()  => {
      try {
        let newFeeds = await this.getFutureFeeds(this.state.feeds[0].id);
        newFeeds = [...newFeeds, ...this.state.feeds];
        console.log('newFeeds', newFeeds);
        this.setState({
          feeds: newFeeds,
        });  
      } catch (e) {
        console.log('error',  e);
      }
      
      this.liveUpdate();
      
    }, this.heartBeat);
  }

  getLatestFeeds(): Promise<any[]> {
    return fetch('https://magiclab-twitter-interview.herokuapp.com/enhuizhu/api?count=10')
      .then(response => response.json())
  }

  getFutureFeeds(afterId: number) {
    return fetch(`https://magiclab-twitter-interview.herokuapp.com/enhuizhu/api?count=1&id=${afterId}&direction=1`)
      .then(response => response.json())
  }
  
  render() {
    console.log('feeds', this.state.feeds);
    return (
      <div className='App'>
        {
          this.state.feeds.map((f: any) => {
            return (
              <div className='item' key={f.id}>
                <div className='avatar'>
                  <img src={f.image}></img>
                </div>
                <div className='text-info'>
                  <div className='username'>
                    {f.username} &nbsp; {moment(f.timeStamp).startOf('hour').fromNow()}
                  </div>
                  <div className='feed-info'>
                    {f.text}
                  </div>
                </div>
                <div className='clear'></div>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default App;
