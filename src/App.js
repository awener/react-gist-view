import './App.css';
import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
class App extends React.Component {

  state = {
    gists: null
  };

  componentDidMount() {
    fetch('https://api.github.com/gists')
    .then(res => res.json())
    .then(gists => {
      this.setState({ gists })
    });
  }

  render() {
    const { gists } = this.state;
    return (
      <Router>
        <Container>
          <Row>
            <Col xs="4">
            { gists && 
              gists.map(gist => (
                <div key={gist.id}>
                  <Link to={`/g/${gist.id}`}>{gist.id}</Link>
                </div>
              ))
            }
            </Col>  
            { gists && 
              <Route path="/g/:gistId" render={({ match }) => (
                <Gist gist={gists.find(g => g.id === match.params.gistId)}/>
              )}/>
            }
          </Row>
        </Container>
      </Router>
      
    )
  }
}



  const Gist = ({ gist }) => {
    if (!gist) { return (<>No data</>) }
    return (
      <Col xs="8">
        <h2>DESCRIPTION -  {gist.description || 'no description'} ////////////////////</h2>
        <div>
          <h1>FILES</h1>
          { Object.keys(gist.files).map(item => (
            <Listing key={item} item={gist.files[item]}/>
          ))}
        </div>
      </Col>
  
    )
  }

  const Listing = (i) => {
    const [files, setFiles] = useState({});
    useEffect(() => {
      (async () => {
        await fetch(i.item.raw_url).then(n => n.text()).then(file => {
          setFiles({name: i.item.filename, data: file});
        });
      })();
    }, []);
    if (!i || !i.item) {
      return (<></>);
    }
      
    return (
      <>
      <h2>{files.name}</h2>
      <pre>{files.data}</pre>
      </>
    )
  }

export default App;
