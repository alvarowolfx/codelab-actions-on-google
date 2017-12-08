import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {
  state = {
    orders: {}
  };

  componentDidMount() {
    const db = firebase.database();
    let ordersRef = db.ref('/orders');

    ordersRef.on('value', snapshot => {
      let orders = snapshot.val();
      this.setState({
        orders
      });
    });
  }

  render() {
    return (
      <div>
        <header class="mdc-toolbar mdc-toolbar--fixed">
          <div class="mdc-toolbar__row">
            <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
              <span class="mdc-toolbar__title">
                <h1 className="App-title">Welcome to Pizza Backoffice</h1>
              </span>
            </section>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </header>
        <br />
        <br />
        <main className="mdc-toolbar-fixed-adjust">
          <div className="mdc-layout-grid">
            <div className="mdc-layout-grid__inner">
              {Object.keys(this.state.orders).map(key => {
                let order = this.state.orders[key];
                let toppings = order.topping.join(',');
                if (toppings === 'null') {
                  toppings = 'none';
                }
                return (
                  <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
                    <div className="mdc-card">
                      <section className="mdc-card__primary">
                        <h1 className="mdc-card__title mdc-card__title--large">
                          Order from {order.name} to deliver at {order.time}
                        </h1>
                      </section>
                      <ul className="mdc-list">
                        <li className="mdc-list-item">
                          <span class="mdc-list-item__text">
                            Pizza type:
                            {`${order.type} ${order.size} with
                            ${order.crust} crust`}
                          </span>
                        </li>
                        <li className="mdc-list-item">
                          <span class="mdc-list-item__text">
                            Toppings: {toppings}
                          </span>
                        </li>
                        <li className="mdc-list-item">
                          <span class="mdc-list-item__text">
                            Sauce: {order.sauce || 'none'}
                          </span>
                        </li>
                      </ul>
                      {order.address && `Delivery info ${order.address}`}
                      <img
                        className="mdc-card__media-item mdc-card__media-item--3x"
                        src={`https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=600x240&maptype=roadmap
                        &markers=color:blue%7Clabel:S%7C${
                          order.location.coordinates.latitude
                        },${order.location.coordinates.longitude}`}
                      />
                      <section className="mdc-card__actions">
                        <a
                          href={`https://www.google.com/maps/?q=${
                            order.location.coordinates.latitude
                          },${order.location.coordinates.longitude}`}
                          target="_blank"
                          className="mdc-button mdc-button--compact mdc-card__action"
                        >
                          Get Directions
                        </a>
                      </section>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
