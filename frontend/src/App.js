import React, { Component, Fragment } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Backdrop from "./components/Backdrop/Backdrop";
import Toolbar from "./components/Toolbar/Toolbar";
import MainNavigation from "./components/Navigation/MainNavigation/MainNavigation";
import MobileNavigation from "./components/Navigation/MobileNavigation/MobileNavigation";
import ErrorHandler from "./components/ErrorHandler/ErrorHandler";
import FeedPage from "./pages/Feed/Feed";
import SinglePostPage from "./pages/Feed/SinglePost/SinglePost";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import "./App.css";
import { isGraphQL } from "./flags";

class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.setState({ isAuth: true, token: token, userId: userId });
    this.setAutoLogout(remainingMilliseconds);
  }

  mobileNavHandler = (isOpen) => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  logoutHandler = () => {
    this.setState({ isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    const url = isGraphQL
      ? "http://localhost:8081/graphql"
      : "http://localhost:8080/auth/login";

    const body = isGraphQL
      ? {
          query: `
            query login($email: String!, $password: String! ){
              login(email: $email, password: $password) { token  userId }
            }
          `,
          variables: { email: authData.email, password: authData.password },
        }
      : {
          email: authData.email,
          password: authData.password,
        };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!isGraphQL) {
          if (res.status === 422) {
            throw new Error("Validation failed.");
          }
          if (res.status !== 200 && res.status !== 201) {
            console.log("Error!");
            throw new Error("Could not authenticate you!");
          }
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);

        if (isGraphQL && resData.errors && resData.errors[0].status === 422) {
          throw new Error("Validation failed.");
        }
        if (isGraphQL && resData.errors?.length) {
          throw new Error("Could not authenticate you!");
        }

        if (isGraphQL) {
          resData = resData.data.login;
        }

        this.setState({
          isAuth: true,
          token: resData.token,
          authLoading: false,
          userId: resData.userId,
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });

    const url = isGraphQL
      ? "http://localhost:8081/graphql"
      : "http://localhost:8080/auth/signup";

    const body = isGraphQL
      ? {
          query: `mutation signup($name: String!, $email: String!, $password: String! ){
            createUser (user: { 
              name: $name, 
              email: $email, 
              password: $password
            }) {
              id
              email
            }
          }
        `,
          variables: {
            name: authData.signupForm.name.value,
            email: authData.signupForm.email.value,
            password: authData.signupForm.password.value,
          },
        }
      : {
          email: authData.signupForm.email.value,
          password: authData.signupForm.password.value,
          name: authData.signupForm.name.value,
        };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!isGraphQL) {
          if (res.status === 422) {
            throw new Error(
              "Validation failed. Make sure the email address isn't used yet!"
            );
          }
          if (res.status !== 200 && res.status !== 201) {
            console.log("Error!");
            throw new Error("Creating a user failed!");
          }
        }
        return res.json();
      })
      .then((resData) => {
        if (isGraphQL && resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (isGraphQL && resData.errors?.length) {
          throw new Error("Creating a user failed!");
        }
        console.log(resData);
        this.setState({ isAuth: false, authLoading: false });
        this.props.history.replace("/");
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isAuth: false,
          authLoading: false,
          error: err,
        });
      });
  };

  setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  render() {
    let routes = (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => (
            <LoginPage
              {...props}
              onLogin={this.loginHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Route
          path="/signup"
          exact
          render={(props) => (
            <SignupPage
              {...props}
              onSignup={this.signupHandler}
              loading={this.state.authLoading}
            />
          )}
        />
        <Redirect to="/" />
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => (
              <FeedPage userId={this.state.userId} token={this.state.token} />
            )}
          />
          <Route
            path="/:postId"
            render={(props) => (
              <SinglePostPage
                {...props}
                userId={this.state.userId}
                token={this.state.token}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      );
    }
    return (
      <Fragment>
        {this.state.showBackdrop && (
          <Backdrop onClick={this.backdropClickHandler} />
        )}
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <Layout
          header={
            <Toolbar>
              <MainNavigation
                onOpenMobileNav={this.mobileNavHandler.bind(this, true)}
                onLogout={this.logoutHandler}
                isAuth={this.state.isAuth}
              />
            </Toolbar>
          }
          mobileNav={
            <MobileNavigation
              open={this.state.showMobileNav}
              mobile
              onChooseItem={this.mobileNavHandler.bind(this, false)}
              onLogout={this.logoutHandler}
              isAuth={this.state.isAuth}
            />
          }
        />
        {routes}
      </Fragment>
    );
  }
}

export default withRouter(App);
