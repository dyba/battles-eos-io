import React, { Component } from 'react';

class Button extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onClick } = this.props;

    this.setState({ loading: true });

    const promise = typeof onClick === "function" && onClick();

    if (promise && typeof promise.then === "function") {
      return promise.then(() => {
        this.isComponentMounted && this.setState({ loading: false });
      });
    }

    this.isComponentMounted && this.setState({ loading: false });
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  render() {
    const { className, type, style, children } = this.props;

    let { loading } = this.state;
    loading = loading || this.props.loading;

    return (
      <button
        className={`Button${ className ? ' ' + className : '' }${ loading ? ' loading' : '' }`}
        onClick={ this.handleClick }
        { ...{ type, style } }
      >{ children }</button>
    );

  }
}

export default Button;
